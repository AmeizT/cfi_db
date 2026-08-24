import { getMetaData } from "@/config/metadata"
import { DirectoryView } from "@/features/people/directory/components/directory-view"

export const metadata = getMetaData({ title: "Directory" })

export default function MembersDirectoryPage() {
    return <DirectoryView />
}
