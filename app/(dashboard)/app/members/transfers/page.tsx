import { getMetaData } from "@/config/metadata";
import { MemberTransfersView } from "@/features/people/transfers/views/MemberTransfersView"

const meta = getMetaData({ title: "Member Transfers" })
export const metadata = { ...meta }

export default function MemberTransfersPage() {
    return <MemberTransfersView />
}
