"use client"

import { getHours } from "date-fns"

interface GreetByTimeOptions {
    username?: string
}

const randomGreeting = (greetings: string[]) => {
    return greetings[Math.floor(Math.random() * greetings.length)]
}

export function greetByTime({ username }: GreetByTimeOptions) {
    const hour = getHours(new Date())

    if (hour >= 0 && hour < 5) {
        return randomGreeting([
            `${"Up late,"} ${username}?`,
            "Hello, night owl",
            "Still serving, night owl?",
            "Burning the midnight oil?",
        ])
    }

    if (hour >= 5 && hour < 12) {
        return randomGreeting([
            `${"Good morning"}, ${username}`,
            "Good morning, kingdom builder",
            `${"Rise and build"}, ${username}`,
            "A new day to make an impact",
            // "Ready to move the mission forward?",
        ])
    }

    if (hour >= 12 && hour < 18) {
        return randomGreeting([
            `${"Good afternoon"}, ${username}`,
            "Good afternoon, changemaker",
            `${"Keep the mission moving"}, ${username}`,
            `${"Making progress today?"}, ${username}`,
            `${"Another step forward"}, ${username}`,
        ])
    }

    return randomGreeting([
        `${"Good evening"}, ${username}`,
        "Good evening, faithful steward",
        // `${"Wrapping up a meaningful day"}, ${username}?`,
        "Evening, kingdom builder",
        `${"Another day of impact"}, ${username}`,
    ])
}