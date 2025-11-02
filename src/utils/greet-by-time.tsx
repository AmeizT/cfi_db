"use client"

import { getHours } from "date-fns"

export function greetByTime() {
    const hour = getHours(new Date())

    if (hour >= 0 && hour < 12) {
        return "Morning"
    } else if (hour >= 12 && hour < 18) {
        return "Afternoon"
    } else {
        return "Evening"
    }
}