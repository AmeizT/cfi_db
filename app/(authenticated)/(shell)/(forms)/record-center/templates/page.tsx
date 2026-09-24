import { getMetaData } from "@/config/metadata"
import { CentralCreateTemplatesView } from "@/features/central-create/views/CentralCreateTemplatesView"

export const metadata = getMetaData({ title: "Templates" })

export default function CentralCreateTemplatesPage() {
    return <CentralCreateTemplatesView />
}
