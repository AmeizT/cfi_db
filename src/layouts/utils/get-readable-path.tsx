export function getReadablePath(pathname: string, segments: number = 2): string {
    return pathname
    .split("/")
    .filter(Boolean)
    .slice(0, segments)
    .join(" ")
}