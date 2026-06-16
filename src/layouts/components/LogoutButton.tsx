import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signOut } from "@/features/auth/actions/sign-out"


export function LogoutButton({ userId }: { userId: string }) {
    const router = useRouter()

    const handleLogout = async () => {
        const result = await signOut(userId)

        if (result.success) {
            router.push("/en/auth/login?stage=verification")
        } else {
            toast("We couldn't log you out. Please try again")
        }
    }

    return (
        <button onClick={handleLogout}>
            Sign Out
        </button>
    )
}
