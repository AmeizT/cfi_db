"use client"

import { AttendanceRecord } from "../types/attendance"

type Props = {
    record: AttendanceRecord | null
    close: () => void
    updateRecord: (record: AttendanceRecord) => void
}

export function AttendanceDetailDrawer({
    record,
    close,
    updateRecord,
}: Props) {

    if (!record) return null

    return (
        <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-xl p-6">

            <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">
                    Attendance Details
                </h2>

                <button onClick={close}>✕</button>
            </div>

            <p className="text-sm mb-4">
                {new Date(record.timestamp).toDateString()}
            </p>

            <div className="space-y-4">

                <div>
                    <label className="text-sm">Preacher</label>
                    <input
                        className="w-full border p-2"
                        value={record.preacher ?? ""}
                        onChange={(e) =>
                            updateRecord({
                                ...record,
                                preacher: e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <label className="text-sm">Sermon</label>
                    <textarea
                        className="w-full border p-2"
                        value={record.sermon ?? ""}
                        onChange={(e) =>
                            updateRecord({
                                ...record,
                                sermon: e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <label className="text-sm">Scriptures</label>
                    <textarea
                        className="w-full border p-2"
                        value={record.scriptures ?? ""}
                        onChange={(e) =>
                            updateRecord({
                                ...record,
                                scriptures: e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <label className="text-sm">Weather</label>
                    <input
                        className="w-full border p-2"
                        value={record.weather ?? ""}
                        onChange={(e) =>
                            updateRecord({
                                ...record,
                                weather: e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <label className="text-sm">Notes</label>
                    <textarea
                        className="w-full border p-2"
                        value={record.notes ?? ""}
                        onChange={(e) =>
                            updateRecord({
                                ...record,
                                notes: e.target.value,
                            })
                        }
                    />
                </div>

            </div>
        </div>
    )
}