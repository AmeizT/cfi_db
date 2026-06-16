export function buildTab(main: string, sub?: string) {
    return sub ? `${main}:${sub}` : main
}