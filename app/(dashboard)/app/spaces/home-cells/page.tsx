import { getMetaData } from "@/config/metadata";
import { HomeCellsView } from "@/features/spaces/homecells/views/HomeCellsView"

const meta = getMetaData({ title: "Home Cells" })
export const metadata = { ...meta }

export default function HomeCellsPage() {
    return <HomeCellsView />
}
