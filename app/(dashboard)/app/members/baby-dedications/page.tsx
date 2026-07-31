import { getMetaData } from "@/config/metadata"
import { BabyDedicationsView } from "@/features/people/baby-dedications/views/BabyDedicationsView"

export const metadata = getMetaData({ title: "Baby Dedications" })

export default function BabyDedicationsPage() {
    return <BabyDedicationsView />
}
