"use client"

/* eslint-disable @next/next/no-img-element */

import React from "react"
import { toast } from "sonner"
import { FileIcons } from "./FileIcons"
import { cn } from "@/lib/utils"

type UploadDropzoneProps = {
    onUpload: (file: File) => void
    accept?: string[]
    capture?: boolean | "user" | "environment"
    label?: string
    disabled?: boolean
    previewUrl?: string | null
    children?: React.ReactNode
}

export function UploadDropzone({
    onUpload,
    accept = [".xlsx", ".xls"],
    capture,
    label = "Drag & drop or click to browse",
    disabled = false,
    previewUrl,
    children,
}: UploadDropzoneProps) {
    const [isDragging, setIsDragging] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const isValidFile = (file: File) => {
        return accept.some((accepted) => {
            const value = accepted.toLowerCase()

            if (value.startsWith(".")) {
                return file.name.toLowerCase().endsWith(value)
            }

            if (value.endsWith("/*")) {
                return file.type.toLowerCase().startsWith(value.replace("/*", "/"))
            }

            return file.type.toLowerCase() === value
        })
    }

    const handleFile = (file: File | undefined) => {
        if (disabled) return
        if (!file) return

        if (!isValidFile(file)) {
            toast.error(`Only ${accept.join(", ")} files are accepted.`)
            return
        }

        onUpload(file)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (disabled) return
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (disabled) return
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        handleFile(file)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        handleFile(file)
        e.target.value = ""
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            fileInputRef.current?.click()
        }
    }

    return (
        <div className="p-1 h-full rounded-3xl bg-surface">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                    if (!disabled) fileInputRef.current?.click()
                }}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                aria-busy={disabled}
                className={cn(
                    "relative h-full min-h-56 overflow-hidden flex flex-col items-center justify-center gap-3",
                    "rounded-[20px] border-[1.5px] border-dashed px-6 py-10",
                    "select-none transition-all duration-200 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    disabled ? "cursor-wait" : "cursor-pointer",
                    isDragging && !disabled
                        ? "border-theme-500 bg-theme-50 scale-[1.01]"
                        : "border-mist-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-theme-500 hover:bg-theme-50"
                )}
            >
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Selected upload preview"
                        className="absolute inset-0 h-full w-full object-cover opacity-40"
                    />
                )}

                <div className="relative transition-transform duration-200">
                    <FileIcons />
                </div>

                <div className="relative text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-neutral-200">
                        {isDragging
                            ? "Drop your file here"
                            : label}
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
                    capture={capture}
                    disabled={disabled}
                    className="sr-only"
                    onChange={handleChange}
                />

                {children}
            </div>
        </div>
    )
}
