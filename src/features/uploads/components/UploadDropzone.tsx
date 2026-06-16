"use client"

import React from "react"
import { toast } from "sonner"
import { FileIcons } from "./FileIcons"

type UploadDropzoneProps = {
    onUpload: (file: File) => void
    accept?: string[]
}

export function UploadDropzone({
    onUpload,
    accept = [".xlsx", ".xls"],
}: UploadDropzoneProps) {
    const [isDragging, setIsDragging] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // -------------------------
    // Helpers
    // -------------------------
    const isValidFile = (file: File) => {
        return accept.some((ext) =>
            file.name.toLowerCase().endsWith(ext)
        )
    }

    const handleFile = (file: File | undefined) => {
        if (!file) return

        if (!isValidFile(file)) {
            toast.error(`Only ${accept.join(", ")} files are accepted.`)
            return
        }

        onUpload(file) // 🔥 unified entry point
    }

    // -------------------------
    // Drag Events
    // -------------------------
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        handleFile(file) // ✅ uses same logic
    }

    // -------------------------
    // Input Change
    // -------------------------
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        handleFile(file) // ✅ same logic again
    }

    return (
        <div className="p-1 h-full rounded-3xl bg-surface">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                relative h-full flex flex-col items-center justify-center gap-3
                rounded-[20px] border-[1.5px] border-dashed px-6 py-10
                cursor-pointer select-none transition-all duration-200
                ${isDragging
                        ? "border-theme-500 bg-theme-50 scale-[1.01]"
                        : "border-mist-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-theme-500 hover:bg-theme-50"
                    }
            `}
            >
                {/* Icon */}
                <div className="transition-transform duration-200">
                    <FileIcons />
                </div>

                {/* Text */}
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                        {isDragging
                            ? "Drop your file here"
                            : "Drag & drop or click to browse"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {accept.join(", ")} files only
                    </p>
                </div>

                {/* Hidden Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept.join(",")}
                    className="sr-only"
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}