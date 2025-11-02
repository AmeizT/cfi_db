import { getMetaData } from "@/config/metadata"
import PasswordRecovery from "@/features/auth/iforgot/PasswordRecovery"

const meta = getMetaData({ title: "Account Recovery" })

export const metadata = { ...meta }

export default function AccountRecoveryPage() {
    return (
        <PasswordRecovery />
    )
}
