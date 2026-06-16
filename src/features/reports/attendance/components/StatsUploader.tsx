import React from "react"
import { initialFormActionState } from "@/constants/form"
import { uploadAttendanceSheet } from "../actions/upload-attendance-sheet"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import { UploadCircle01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

export function StatsUploader() {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
    const [feedback, setFeedback] = React.useState<string>("")
    const [isDragging, setIsDragging] = React.useState(false)
    const [formState, formAction, pending] = React.useActionState(
        uploadAttendanceSheet,
        initialFormActionState
    )
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    async function submitHandler(formData: FormData) {
        if (selectedFile) {
            formData.append("file", selectedFile)
        }
        await formAction(formData)
    }

    React.useEffect(() => {
        if(formState.status === 200){
            toast.success("Attendance sheet uploaded successfully!")
        }
    }, [formState])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
            setFeedback("")
        } else {
            setSelectedFile(null)
        }
    }

    const handleRemoveFile = () => {
        setSelectedFile(null)
        setFeedback("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
            setSelectedFile(file)
            setFeedback("")
        } else {
            setFeedback("Only .xlsx or .xls files are accepted.")
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    return (
        <Dialog>
            <form action={submitHandler} className="flex flex-col gap-4 max-w-md">
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-fit">
                        <HugeiconsIcon icon={UploadCircle01Icon} strokeWidth={2} className="size-4.5" />

                        Import spreadsheet
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-2xl bg-mist-50">
                    <DialogHeader>
                        <DialogTitle className="block font-semibold text-gray-800">
                            Attendance Sheet
                        </DialogTitle>

                        <DialogDescription className="text-sm text-gray-500">
                            Upload an Excel file (.xlsx or .xls) using the provided template.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div>
                        {!selectedFile && (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-all duration-200 select-none ${isDragging ? "border-theme-500 bg-theme-50 scale-[1.01]" : "border-gray-300 bg-gray-50 hover:border-theme-400 hover:bg-theme-50/50"}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${isDragging ? "bg-theme-100" : "bg-white border border-gray-200"}`}>
                                    <svg className={`w-6 h-6 transition-colors ${isDragging ? "text-theme-600" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-700">
                                        {isDragging ? "Drop your file here" : "Drag & drop or click to browse"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">.xlsx or .xls files only</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    id="attendance-file"
                                    name="file"
                                    type="file"
                                    accept=".xlsx,.xls"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                />
                            </div>
                        )}

                        {/* File Preview Card */}
                        {selectedFile && (
                            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                {/* Excel icon */}
                                <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>

                                {/* File info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(selectedFile.size)}</p>
                                </div>

                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
                                    aria-label="Remove file"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Feedback message */}
                        {feedback && (
                            <p className="text-xs text-amber-600 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                {feedback}
                            </p>
                        )}
                    </div>


                    <DialogFooter>
                        <DialogClose asChild className="hidden">
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        
                        <Button
                            type="submit"
                            disabled={!selectedFile || pending}
                            className="mt-1 w-full flex items-center justify-center gap-2 rounded-lg bg-theme-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-theme-700 active:scale-[0.98] disabled:border disabled:border-mist-400 disabled:bg-mist-200 disabled:text-mist-600 disabled:shadow-none transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {pending ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                                    </svg>
                                    Uploading…
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                    Upload File
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
