import { getMetaData } from "@/config/metadata"
import { TithesRouteContent } from "@/features/reports/finance/tithes/workspace/TithesWorkspace"

const meta = getMetaData({ title: "Tithes Reports" })
export const metadata = { ...meta }

export default function TithesRootPage() {
    return <TithesRouteContent view="records" />
}
