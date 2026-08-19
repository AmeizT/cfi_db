import { getDate, getHours } from "date-fns"

type GreetingOptions = {
    username?: string
    now?: Date
}

export function greetByTime(value?: Date | GreetingOptions) {
    const now =
        value instanceof Date
            ? value
            : value?.now ?? new Date()

    const hour = getHours(now)
    const day = getDate(now)

    let greetings: string[]

    if (hour < 5) {
        greetings = [
            "Up late",
            "Still serving",
            "Night owl",
        ]
    } else if (hour < 12) {
        greetings = [
            "Good morning",
            "Morning",
            "Ready for the day",
            "Moving forward",
        ]
    } else if (hour < 18) {
        greetings = [
            "Good afternoon",
            "Making progress",
            "Making an impact",
            "Mission forward",
        ]
    } else {
        greetings = [
            "Good evening",
            "Moving forward",
            "Making an impact",
            "Still serving",
        ]
    }

    // Rotate predictably every 2 hours.
    // Including the day keeps the rotation from repeating
    // in exactly the same pattern every day.
    const timeSlot = Math.floor(hour / 2)
    const greetingIndex = (day + timeSlot) % greetings.length
    const greeting = greetings[greetingIndex]

    return !(value instanceof Date) && value?.username
        ? `${greeting}, ${value.username}`
        : greeting
}