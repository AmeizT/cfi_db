import { getMetaData } from "@/config/metadata"
import { TithesList } from "@/features/finance/tithes/components/TitheList"

const meta = getMetaData({ title: "Tithes Reports" })
export const metadata = { ...meta }

export default function TithesReportPage() {
    return (
        <TithesList />
    )
}