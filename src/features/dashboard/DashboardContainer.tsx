"use client"

import React from "react"
import Cookies from "js-cookie"
import { useActionSounds } from "@/hooks/use-action-sounds"

export function AppStartupSound() {
    const { playStartup } = useActionSounds()

    React.useEffect(() => {
        // Guard: only play if cookie is "false" or not set
        const played = Cookies.get("startupSoundPlayed")
        if (played === "true") return

        // Play the sound
        playStartup()

        // Mark as played
        Cookies.set("startupSoundPlayed", "true", { path: "/" })
    }, [playStartup])

    return null
}

export function DashboardContainer() {
    return (
        <React.Fragment>
            <AppStartupSound />
        </React.Fragment>
    )
}