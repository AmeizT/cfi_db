import { useSound } from "./use-sound"

export function useActionSounds() {
    const success = useSound("/sounds/success.wav", {
        volume: 0.4,
        debounceMs: 800,
    })

    const error = useSound("/sounds/error.mp3", {
        volume: 0.4,
    })

    const startup = useSound("/sounds/startup.mp3", {
        volume: 0.3,
        debounceMs: 2000,
    })

    return {
        playSuccess: success.play,
        playError: error.play,
        playStartup: startup.play,
    }
}