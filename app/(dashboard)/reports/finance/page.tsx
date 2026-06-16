import { getMetaData } from "@/config/metadata"

const meta = getMetaData({ title: "Finance Reports" })
export const metadata = { ...meta }

export default function FinanceReportPage() {
    return (
        <div>
            <h1>Finance Report Page</h1>
        </div>
    )
}