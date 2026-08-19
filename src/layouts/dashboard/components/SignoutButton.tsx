"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { logout } from "@/features/auth/utils/logout"
import { ExitIcon } from '@solar-icons/react/line-duotone/exit'

export function SignoutButton() {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    const handleLogout = async () => {
        if (isPending) return

        setIsPending(true)

        try {
            await logout()
            toast.success("Signed out successfully!")
            router.push("/en/auth/login")
        } catch {
            toast("Something went wrong while signing you out.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <DropdownMenuItem asChild className="focus:text-red-600">
            <Button
                onClick={handleLogout}
                disabled={isPending}
                variant="ghost"
                className="w-full justify-start gap-2 hover:scale-[1] focus-visible:ring-0 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950 dark:focus:text-red-400 font-normal"
            >
                {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <ExitIcon strokeWidth={2} className="size-5.5 has-focus:text-red-600" />
                )}

                {isPending ? "Logging out..." : "Logout"}
            </Button>
        </DropdownMenuItem>
    )
}