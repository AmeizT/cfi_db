import { getMetaData } from "@/config/metadata";
import { AssetsView } from "@/features/finance/assets/views/AssetsView"

const meta = getMetaData({ title: "Assets" })
export const metadata = { ...meta }

export default function AssetsPage() {
    return <AssetsView />
}
