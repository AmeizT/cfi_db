import { getMetaData } from "@/config/metadata"
import { LoginView } from "@/features/auth/login/views/LoginView"

const meta = getMetaData({ title: "CFI Workspace Login | Sign in to CFI Workspace Dashboard" })

export const metadata = { ...meta }

// async function verifyUserSession() {
//     const sessionStatus = (await validateSession()) as Status
//     if (sessionStatus === 200) {
//         redirect("/app/dashboard")
//     }
// }


export default async function LoginPage(){
    return (
        <LoginView />
    )
}