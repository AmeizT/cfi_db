import { getMetaData } from "@/config/metadata"
import { RegionalAssembliesView } from "@/features/administration/regional/views/RegionalAssembliesView"

const meta = getMetaData({ title: "Regional Assemblies" })
export const metadata = { ...meta }

export default function RegionalAssembliesPage() {
    return <RegionalAssembliesView />
}
