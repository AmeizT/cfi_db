import React from "react"
import { useSession } from "@/hooks/use-session"
import { signOut } from "@/features/auth/actions/sign-out"
import { IconAlertHexagonFilled, IconPower } from "@tabler/icons-react"
import { refreshSession } from "@/features/auth/actions/session/refresh-session"
import { User } from "@/features/auth/schemas/user"

interface InactivityViewProps {
    accessToken?: string | undefined
    user?: User
}

export function InactivityView({ accessToken, user }: InactivityViewProps) {
    const memoizedSignOut = React.useCallback((
            userId: string) => signOut(String(userId)
            ), [])
    
    const { countdown, setShowInactivityAlert } = useSession({
        accessToken: accessToken,
        userID: user?.id as unknown as string,
        signOut: memoizedSignOut,
        refreshSession: refreshSession,
        onInactivity: () => {
            setShowInactivityAlert(true)
        },
    })

    return (
        <div className = "px-4 lg:px-0 w-full h-dvh fixed inset-0 flex justify-center items-center bg-mist-100 dark:bg-neutral-800/80 backdrop-blur-3xl z-50" >
            <div className="p-6 lg:w-1/2 xl:w-1/3 flex flex-col lg:flex-row gap-6 bg-white dark:bg-neutral-800 border border-mist-200 dark:border-neutral-600 rounded-3xl dark:shadow-md">
                <div className="p-3 w-fit h-fit bg-linear-to-b from-mist-100 to-white dark:from-neutral-700 dark:to-neutral-800 rounded-full">
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-full border border-mist-200 dark:border-neutral-700">
                        <IconAlertHexagonFilled className="size-7 text-amber-400" />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h5 className="font-semibold">
                            You&apos;ve been inactive for a while — are you still using the app?
                        </h5>

                        <p className="text-sm text-muted-foreground">
                            To keep things secure, you&apos;ll be logged out in <span suppressHydrationWarning className="font-semibold">{countdown}</span> unless you jump back in.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button className="w-full lg:w-fit px-3 py-1.5 rounded-[9px] border border-mist-300 dark:border-neutral-600 text-sm font-semibold bg-white dark:bg-neutral-800 hover:bg-mist-50 dark:hover:bg-neutral-700 transition-colors">
                            Stay Logged In
                        </button>

                        <button className="w-full lg:w-fit px-2.5 py-1.5 flex items-center gap-2 rounded-[9px] text-sm text-white font-medium bg-linear-to-br from-neutral-700 to-neutral-900 dark:from-blue-400 dark:to-blue-600">
                            <IconPower className="size-5" /> Log Out Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}