import { AuditLog } from "@/dal/types"
import { AuditLogTable } from "./AuditLogTable"

interface AuditLogPageProps {
    logs: AuditLog[]
    isLoading: boolean
}

export function AuditLogPage({ logs, isLoading }: AuditLogPageProps) {
    return (
        <div className="space-y-5">
            <div className="hidden _flex items-start justify-between">
                <div>
                    <h1 className="text-[22px] font-medium text-gray-900 dark:text-gray-100">
                        Audit log
                    </h1>
                    <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
                        A record of all create, update, and delete actions across the system.
                    </p>
                </div>
                <button className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        style={{ width: 13, height: 13 }}
                    >
                        <path d="M8 2v12M4 10l4 4 4-4" />
                    </svg>
                    Export CSV
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg px-4 py-3">
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                        Total entries
                    </p>
                    <p className="text-[20px] font-medium text-gray-900 dark:text-gray-100">
                        {logs?.length}
                    </p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-950/40 rounded-lg px-4 py-3">
                    <p className="text-[11px] uppercase tracking-widest text-teal-700 dark:text-teal-400 mb-1">
                        Created
                    </p>
                    <p className="text-[20px] font-medium text-teal-800 dark:text-teal-300">
                        {logs?.filter((l) => l?.action === "Created")?.length}
                    </p>
                </div>
                <div className="bg-theme-50 dark:bg-theme-800/40 rounded-lg px-4 py-3">
                    <p className="text-[11px] uppercase tracking-widest text-theme-700 dark:text-theme-400 mb-1">
                        Updated
                    </p>
                    <p className="text-[20px] font-medium text-theme-800 dark:text-theme-300">
                        {logs?.filter((l) => l?.action === "Updated")?.length}
                    </p>
                </div>
            </div>

            <AuditLogTable logs={logs} />
        </div>
    )
}
