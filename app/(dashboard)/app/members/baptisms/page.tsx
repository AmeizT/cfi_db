import { getMetaData } from "@/config/metadata";
import { BaptismsView } from "@/features/people/baptisms/views/BaptismsView"

const meta = getMetaData({ title: "Baptisms" })
export const metadata = { ...meta }

export default function BaptismPage() {
    return <BaptismsView />
}