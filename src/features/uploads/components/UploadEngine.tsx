"use client"

import React from "react"
import * as XLSX from "xlsx"
import { UploadDropzone } from "./UploadDropzone"
import { UploadPreviewTable } from "./UploadPreviewTable"
import { UploadErrorsPanel } from "./UploadErrors"
import { UploadActions } from "./UploadActions"
import Link from "next/link"
import { toast } from "sonner"

type ColumnConfig = {
  key: string
  label: string
  required?: boolean
}

type UploadConfig = {
  type: string
  uploadUrl: string
  templateUrl?: string
  columns: ColumnConfig[]
}

type RowData = Record<string, unknown>

type UploadError = {
  row: number
  field: string
  message: string
}

type UploadEngineProps = {
  config: UploadConfig
}

export function UploadEngine({ config }: UploadEngineProps) {
    const [data, setData] = React.useState<RowData[]>([])
    const [errors, setErrors] = React.useState<UploadError[]>([])
    const [file, setFile] = React.useState<File | null>(null)
    const [loading, setLoading] = React.useState(false)

    const handleFileUpload = async (file: File) => {
        setFile(file)

        const reader = new FileReader()

        reader.onload = (e) => {
            const binary = e.target?.result
            const workbook = XLSX.read(binary, { type: "binary" })
            const sheet = workbook.Sheets[workbook.SheetNames[0]]

            const json = XLSX.utils.sheet_to_json<RowData>(sheet)

            const validation = validateRows(json)

            setData(json)
            setErrors(validation)
        }

        reader.readAsBinaryString(file)
    }

    // -------------------------
    // Validation
    // -------------------------
    const validateRows = (rows: RowData[]): UploadError[] => {
        const errors: UploadError[] = []

        rows.forEach((row: RowData, index: number) => {
            config.columns.forEach((col) => {
                if (col.required && (row[col.key] === undefined || row[col.key] === "")) {
                    errors.push({
                        row: index + 2,
                        field: col.key,
                        message: `${col.label} is required`,
                    })
                }
            })
        })

        return errors
    }

    // -------------------------
    // Submit
    // -------------------------
    const handleSubmit = async () => {
        if (!file) return

        setLoading(true)

        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch(config.uploadUrl, {
            method: "POST",
            body: formData,
            credentials: "include",
        })

        const result: { errors?: UploadError[] } = await res.json()

        if(res.status === 200){
            toast.success("Upload successful")
        } else {
            toast.error("Failed to upload the stats please try again.")
        }

        if (result.errors) {
            setErrors(result.errors)
        } else {
            setData([])
            setFile(null)
        }

        setLoading(false)
    }

    return (
        <div className="space-y-6 h-full">
            {/* <div>
                <Link href={config.templateUrl || ""}>
                    Download Template
                </Link>
            </div> */}

            <UploadDropzone onUpload={handleFileUpload} />

            {data.length > 0 && (
                <>
                    <UploadPreviewTable data={data} errors={errors} />
                    <UploadErrorsPanel errors={errors} />
                    <UploadActions
                        onSubmit={handleSubmit}
                        loading={loading}
                        disabled={errors.length > 0}
                    />
                </>
            )}
        </div>
    )
}