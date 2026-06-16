type ParsedTab = {
    main: string
    sub?: string
}

export function parseTab(value: string | null): ParsedTab {
    if (!value) return { main: "overview" }

    const [main, sub] = value.split(":")
    return { main, sub }
}