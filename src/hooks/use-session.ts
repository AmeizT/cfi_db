import React from "react"
import { jwtDecode, JwtPayload } from "jwt-decode"

interface UseSessionProps {
    accessToken: string | undefined
    userID: string | undefined
    themeColor?: string
    signOut: (userID: string) => Promise<{ success: boolean }>
    refreshSession: () => void
    onInactivity?: () => void
}

export const useSession = ({
    accessToken,
    userID,
    signOut,
    refreshSession,
    onInactivity,
}: UseSessionProps) => {
    const [countdown, setCountdown] = React.useState<number>(59)
    const [showInactivityAlert, setShowInactivityAlert] = React.useState<boolean>(false)
    const inactivityTimerRef = React.useRef<NodeJS.Timeout | null>(null)
    const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

    React.useEffect(() => {
        const events = ["mousemove", "keydown", "scroll", "click"]
        
        const resetInactivityTimer = () => {
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)

            inactivityTimerRef.current = setTimeout(() => {
                setShowInactivityAlert(true)
                onInactivity?.()
            }, 30 * 60 * 1000)
        }

        const handleUserActivity = () => {
            resetInactivityTimer()
            setShowInactivityAlert(false)
            setCountdown(59)
        }

        events.forEach((event) => window.addEventListener(event, handleUserActivity))

        resetInactivityTimer()

        return () => {
            events.forEach((event) => window.removeEventListener(event, handleUserActivity))
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
        }
    }, [inactivityTimerRef, onInactivity])

    React.useEffect(() => {
        if (showInactivityAlert) {
            countdownIntervalRef.current = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(countdownIntervalRef.current!)
                        // Don't call signOut directly in the state updater
                        // Just set a flag that we'll handle in another effect
                        return 0
                    }
                    return prevCountdown - 1
                })
            }, 1000)
        } else {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
        }

        return () => {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
        }
    }, [showInactivityAlert])

    React.useEffect(() => {
        const checkTokenExpiration = () => {
            if (!accessToken) return
            const decodedToken = jwtDecode<JwtPayload>(accessToken)
            const currentTime = Date.now() / 1000
            const isSessionExpired = (decodedToken.exp || 0) - currentTime < 100

            if (isSessionExpired) {
                refreshSession()
            }
        }

        const interval = setInterval(checkTokenExpiration, 6000)
        checkTokenExpiration()

        return () => clearInterval(interval)
    }, [accessToken, refreshSession])

    React.useEffect(() => {
        if (countdown === 0 && showInactivityAlert && userID) {
            signOut(userID)
        }
    }, [countdown, showInactivityAlert, userID, signOut])

    return { countdown, setShowInactivityAlert, showInactivityAlert }
}