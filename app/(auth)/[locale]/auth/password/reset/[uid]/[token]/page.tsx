import { getMetaData } from "@/config/metadata"
import { PasswordReset } from "@/features/auth/iforgot/PasswordReset"

const meta = getMetaData({ title: "Create New Password" })

export const metadata = { ...meta }

export default async function PasswordResetConfirmPage({ params }: {
    params: Promise<{ uid: string; token: string;}>
}) {
    const { uid, token } = await params;

    return (
        <PasswordReset params={{ uid: uid, token: token }} />
    )
}