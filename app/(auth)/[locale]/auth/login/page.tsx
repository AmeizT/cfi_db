import { redirect } from "next/navigation"
import { getMetaData } from "@/config/metadata"
import LoginView from "@/features/auth/signin/views/Signin"
import { validateSession } from "@/features/auth/actions/session/validate-session"

const meta = getMetaData({ title: "CFI Workspace Login | Sign in to CFI Workspace Dashboard" })

export const metadata = { ...meta }

type Status = 200 | 201 | 401 | 403 | 404 | undefined

async function verifyUserSession() {
    const sessionStatus = (await validateSession()) as Status
    if (sessionStatus === 200) {
        redirect("/dashboard")
    }
}

export default async function LoginPage(){
    await verifyUserSession()

    return (
        <LoginView />
    )
}