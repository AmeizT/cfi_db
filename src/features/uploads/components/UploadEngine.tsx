"use client"

/* eslint-disable @next/next/no-img-element */

import React from "react"
import * as XLSX from "xlsx"
import { Camera, FileSpreadsheet, ImageIcon } from "lucide-react"
import { UploadDropzone } from "./UploadDropzone"
import { UploadPreviewTable } from "./UploadPreviewTable"
import { UploadErrorsPanel } from "./UploadErrors"
import { UploadActions } from "./UploadActions"
import { toast } from "sonner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"

type ColumnConfig = {
    key: string
    label: string
    required?: boolean
}

type UploadConfig = {
    type: string
    uploadUrl: string
    imageUploadUrl?: string
    templateUrl?: string
    columns: ColumnConfig[]
}

type RowData = Record<string, unknown>

type UploadError = {
    row: number
    field?: string
    message: string
}

type ApiUploadError = {
    row?: number
    field?: string
    message?: string
    error?: string
}

type UploadMode = "spreadsheet" | "image"
type OcrUploadState = "idle" | "parsing" | "preview" | "saving" | "error"

type OcrPreviewResponse = {
    success?: boolean
    raw_text?: string
    preview?: RowData[]
    errors?: ApiUploadError[]
    warnings?: string[]
    confidence?: number
}

type UploadResult = {
    error?: string
    errors?: ApiUploadError[]
}

type UploadEngineProps = {
    config: UploadConfig
    initialMode?: UploadMode
}

export function UploadEngine({ config, initialMode = "spreadsheet" }: UploadEngineProps) {
    const [mode, setMode] = React.useState<UploadMode>(initialMode)
    const [ocrUploadState, setOcrUploadState] = React.useState<OcrUploadState>("idle")
    const [data, setData] = React.useState<RowData[]>([])
    const [errors, setErrors] = React.useState<UploadError[]>([])
    const [warnings, setWarnings] = React.useState<string[]>([])
    const [rawText, setRawText] = React.useState("")
    const [confidence, setConfidence] = React.useState<number | null>(null)
    const [file, setFile] = React.useState<File | null>(null)
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null)
    const [spreadsheetLoading, setSpreadsheetLoading] = React.useState(false)
    const [progress, setProgress] = React.useState(0)

    const resetPreview = React.useCallback(() => {
        setData([])
        setErrors([])
        setWarnings([])
        setRawText("")
        setConfidence(null)
        setProgress(0)
        setFile(null)
    }, [])

    React.useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl)
            }
        }
    }, [imagePreviewUrl])

    const hasImageUpload = Boolean(config.imageUploadUrl)
    const accept = mode === "image"
        ? ["image/*", ".jpg", ".jpeg", ".png", ".webp"]
        : [".xlsx", ".xls", ".csv"]
    const confidencePercent = confidence === null
        ? null
        : Math.round(confidence > 1 ? confidence : confidence * 100)
    const isOcrMode = mode === "image"
    const isOcrParsing = ocrUploadState === "parsing"
    const isOcrSaving = ocrUploadState === "saving"
    const isOcrBusy = isOcrParsing || isOcrSaving
    const showOcrUpload = isOcrMode && ["idle", "parsing", "error"].includes(ocrUploadState)
    const showOcrPreview = isOcrMode && ["preview", "saving"].includes(ocrUploadState)
    const showSpreadsheetPreview = mode === "spreadsheet" && data.length > 0
    const showSpreadsheetUpload = mode === "spreadsheet"

    React.useEffect(() => {
        queueMicrotask(() => {
            setMode(initialMode)
            resetPreview()
            setOcrUploadState("idle")
            setImagePreviewUrl(null)
        })
    }, [config.type, initialMode, resetPreview])

    const resetOcrUpload = () => {
        resetPreview()
        setOcrUploadState("idle")
        setImagePreviewUrl(null)
    }

    const handleModeChange = (value: string) => {
        if (!value) return
        if (isOcrBusy) return

        resetPreview()
        setOcrUploadState("idle")
        setImagePreviewUrl(null)
        setMode(value as UploadMode)
    }

    const handleFileUpload = async (selectedFile: File) => {
        if (mode === "image") {
            await handleImageUpload(selectedFile)
            return
        }

        handleSpreadsheetUpload(selectedFile)
    }

    const handleSpreadsheetUpload = (selectedFile: File) => {
        setFile(selectedFile)
        setErrors([])
        setWarnings([])
        setRawText("")
        setConfidence(null)

        const reader = new FileReader()

        reader.onload = (event) => {
            try {
                const binary = event.target?.result
                const workbook = XLSX.read(binary, { type: "binary" })
                const sheet = workbook.Sheets[workbook.SheetNames[0]]
                const json = XLSX.utils.sheet_to_json<RowData>(sheet)
                const validation = validateRows(json)

                setData(json)
                setErrors(validation)
            } catch {
                toast.error("Unable to read spreadsheet")
            }
        }

        reader.onerror = () => {
            toast.error("Unable to read spreadsheet")
        }

        reader.readAsBinaryString(selectedFile)
    }

    const handleImageUpload = async (selectedFile: File) => {
        if (isOcrBusy) return

        if (!config.imageUploadUrl) {
            toast.error("Image upload is not available for this report")
            return
        }

        setFile(selectedFile)
        setData([])
        setErrors([])
        setWarnings([])
        setRawText("")
        setConfidence(null)
        setProgress(0)
        setOcrUploadState("parsing")

        const nextImageUrl = URL.createObjectURL(selectedFile)
        setImagePreviewUrl(nextImageUrl)

        const formData = new FormData()
        formData.append("file", selectedFile)

        try {
            const { body } = await postFormData<OcrPreviewResponse>(
                config.imageUploadUrl,
                formData,
                setProgress
            )
            const nextErrors = normalizeErrors(body.errors)
            const previewRows = body.preview ?? []

            setData(previewRows)
            setErrors(nextErrors)
            setWarnings(body.warnings ?? [])
            setRawText(body.raw_text ?? "")
            setConfidence(typeof body.confidence === "number" ? body.confidence : null)

            if (previewRows.length === 0) {
                setFile(null)
                setImagePreviewUrl(null)
                setOcrUploadState("error")
                toast.error(nextErrors[0]?.message ?? "No values could be extracted from this image")
                return
            }

            setOcrUploadState("preview")

            if (nextErrors.length > 0) {
                toast.error("Review the extracted values before saving")
            } else {
                toast.success("OCR preview ready")
            }
        } catch (error) {
            resetPreview()
            setOcrUploadState("error")
            setImagePreviewUrl(null)
            toast.error(getErrorMessage(error))
        }
    }

    const validateRows = (rows: RowData[]): UploadError[] => {
        const nextErrors: UploadError[] = []

        rows.forEach((row: RowData, index: number) => {
            config.columns.forEach((col) => {
                if (col.required && (row[col.key] === undefined || row[col.key] === "")) {
                    nextErrors.push({
                        row: index + 2,
                        field: col.key,
                        message: `${col.label} is required`,
                    })
                }
            })
        })

        return nextErrors
    }

    const handleCellChange = (rowIndex: number, field: string, value: string) => {
        if (isOcrSaving) return

        setData((rows) => rows.map((row, index) => (
            index === rowIndex ? { ...row, [field]: value } : row
        )))

        setErrors((currentErrors) => currentErrors.filter((error) => {
            const editedRowNumber = rowIndex + 2
            return error.row !== editedRowNumber && error.row !== 1
        }))
    }

    const handleSubmit = async () => {
        if (mode === "image") {
            await submitImageRows()
            return
        }

        await submitSpreadsheet()
    }

    const submitSpreadsheet = async () => {
        if (!file || spreadsheetLoading) return

        setSpreadsheetLoading(true)
        setProgress(0)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const { body } = await postFormData<UploadResult>(
                config.uploadUrl,
                formData,
                setProgress
            )
            const nextErrors = normalizeErrors(body.errors)

            if (nextErrors.length > 0) {
                setErrors(nextErrors)
                toast.error("Some rows could not be uploaded")
            } else {
                resetPreview()
                toast.success("Upload successful")
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setSpreadsheetLoading(false)
        }
    }

    const submitImageRows = async () => {
        if (!config.imageUploadUrl || data.length === 0 || isOcrBusy) return

        setOcrUploadState("saving")

        try {
            const response = await fetch(config.imageUploadUrl, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    commit: true,
                    rows: data,
                }),
            })
            const result = await response.json() as UploadResult
            const nextErrors = normalizeErrors(result.errors)

            if (!response.ok) {
                throw new Error(result.error || "Failed to save extracted rows")
            }

            if (nextErrors.length > 0) {
                setErrors(nextErrors)
                setOcrUploadState("preview")
                toast.error("Some rows could not be saved")
            } else {
                resetOcrUpload()
                toast.success("Extracted rows saved")
            }
        } catch (error) {
            setOcrUploadState("preview")
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <div className="space-y-6 h-full" aria-busy={isOcrBusy}>
            {hasImageUpload && (
                <ToggleGroup
                    type="single"
                    value={mode}
                    onValueChange={handleModeChange}
                    variant="outline"
                    className="rounded-lg border bg-background p-1"
                    disabled={isOcrBusy}
                >
                    <ToggleGroupItem value="spreadsheet" aria-label="Spreadsheet upload" className="gap-2 rounded-md">
                        <FileSpreadsheet className="size-4" />
                        Spreadsheet
                    </ToggleGroupItem>
                    <ToggleGroupItem value="image" aria-label="Image upload" className="gap-2 rounded-md">
                        <ImageIcon className="size-4" />
                        Image
                    </ToggleGroupItem>
                </ToggleGroup>
            )}

            {showSpreadsheetUpload && (
                <UploadDropzone
                    onUpload={handleFileUpload}
                    accept={accept}
                    disabled={spreadsheetLoading}
                />
            )}

            {showOcrUpload && (
                <UploadDropzone
                    onUpload={handleFileUpload}
                    accept={accept}
                    capture="environment"
                    label="Drag an image, take a photo, or browse"
                    disabled={isOcrParsing}
                    previewUrl={imagePreviewUrl}
                >
                    {isOcrParsing && (
                        <OcrParsingOverlay progress={progress} />
                    )}
                </UploadDropzone>
            )}

            {spreadsheetLoading && progress > 0 && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Progress value={progress} className="h-2" />
                    <span className="w-10 text-right tabular-nums">{progress}%</span>
                </div>
            )}

            {showOcrPreview && imagePreviewUrl && (
                <div className="grid gap-4 rounded-xl border bg-background p-3 lg:grid-cols-[220px_1fr]">
                    <img
                        src={imagePreviewUrl}
                        alt="Uploaded report preview"
                        className="h-56 w-full rounded-lg object-cover"
                    />

                    <div className="flex min-w-0 flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 font-medium">
                                <Camera className="size-4" />
                                OCR confidence {confidencePercent === null ? "--" : `${confidencePercent}%`}
                            </span>
                        </div>

                        {rawText && (
                            <details className="text-sm text-muted-foreground">
                                <summary className="cursor-pointer font-medium text-foreground">Raw OCR text</summary>
                                <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs">
                                    {rawText}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )}

            {showSpreadsheetPreview && (
                <>
                    <UploadPreviewTable
                        data={data}
                        errors={errors}
                    />
                    <UploadErrorsPanel errors={errors} />
                    <UploadActions
                        onSubmit={handleSubmit}
                        loading={spreadsheetLoading}
                        disabled={errors.length > 0 || data.length === 0}
                        submitLabel="Submit"
                        loadingLabel="Uploading..."
                    />
                </>
            )}

            {showOcrPreview && data.length > 0 && (
                <div className="space-y-4" aria-busy={isOcrSaving}>
                    {warnings.length > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                            <p className="font-semibold text-foreground">Review warnings</p>
                            <ul className="mt-2 space-y-1">
                                {warnings.map((warning) => (
                                    <li key={warning}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <UploadPreviewTable
                        data={data}
                        errors={errors}
                        editable
                        disabled={isOcrSaving}
                        onChange={handleCellChange}
                    />
                    <UploadErrorsPanel errors={errors} />
                    <UploadActions
                        onSubmit={handleSubmit}
                        loading={isOcrSaving}
                        disabled={errors.length > 0 || data.length === 0}
                        submitLabel="Save extracted values"
                        loadingLabel="Saving..."
                        secondaryLabel="Upload another image"
                        onSecondary={resetOcrUpload}
                        secondaryDisabled={isOcrSaving}
                    />
                </div>
            )}
        </div>
    )
}

function OcrParsingOverlay({ progress }: { progress: number }) {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[20px] bg-background/70 p-6 backdrop-blur-sm">
            <div className="flex max-w-sm flex-col items-center text-center">
                <Spinner className="bg-muted-foreground" />
                <p className="mt-4 text-sm font-semibold text-foreground">
                    Reading image...
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Extracting report values. This may take a few seconds.
                </p>
                {progress > 0 && (
                    <div className="mt-4 flex w-full items-center gap-3">
                        <Progress value={progress} className="h-2" />
                        <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                            {progress}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

function normalizeErrors(errors?: ApiUploadError[]): UploadError[] {
    if (!errors) return []

    return errors.map((error, index) => ({
        row: Number(error.row ?? index + 1),
        field: error.field,
        message: error.message ?? error.error ?? "Upload error",
    }))
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message
    }

    return "Upload failed"
}

function postFormData<T>(
    url: string,
    formData: FormData,
    onProgress: (progress: number) => void
): Promise<{ body: T; status: number }> {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()

        request.open("POST", url)
        request.withCredentials = true

        request.upload.onprogress = (event) => {
            if (!event.lengthComputable) return
            onProgress(Math.round((event.loaded / event.total) * 100))
        }

        request.onload = () => {
            const body = parseJson<T>(request.responseText)

            if (request.status >= 200 && request.status < 300) {
                resolve({ body, status: request.status })
                return
            }

            reject(new Error(extractErrorMessage(body) || "Upload failed"))
        }

        request.onerror = () => {
            reject(new Error("Upload failed"))
        }

        request.send(formData)
    })
}

function parseJson<T>(value: string): T {
    try {
        return JSON.parse(value) as T
    } catch {
        return {} as T
    }
}

function extractErrorMessage(body: unknown) {
    if (!body || typeof body !== "object") return null

    const errorBody = body as { error?: unknown; message?: unknown }

    if (typeof errorBody.error === "string") {
        return errorBody.error
    }

    if (typeof errorBody.message === "string") {
        return errorBody.message
    }

    return null
}
