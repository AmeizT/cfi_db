import { getMetaData } from "@/config/metadata";
import { HouseholdsView } from "@/features/people/families/views/HouseholdsView"

const meta = getMetaData({ title: "Households" })
export const metadata = { ...meta }

export default function HouseholdsPage() {
    return <HouseholdsView />
}