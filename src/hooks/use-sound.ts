"use client"

import { useCallback, useEffect, useRef } from "react"

type UseSoundOptions = {
    volume?: number
    debounceMs?: number
}

export function useSound(
    src: string,
    { volume = 0.4, debounceMs = 500 }: UseSoundOptions = {}
) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const lastPlayedRef = useRef(0)

    // Create the Audio instance only on the client
    useEffect(() => {
        const audio = new Audio(src)
        audio.volume = volume
        audioRef.current = audio

        return () => {
            audioRef.current = null
        }
    }, [src, volume])

    const play = useCallback(() => {
        if (!audioRef.current) return

        // Respect user preference
        const soundEnabled =
            localStorage.getItem("sound-enabled") !== "false"

        if (!soundEnabled) return

        // Debounce to avoid spam
        const now = Date.now()
        if (now - lastPlayedRef.current < debounceMs) return

        lastPlayedRef.current = now

        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {
            // Mobile autoplay restriction – safe to ignore
        })
    }, [debounceMs])

    return { play }
}