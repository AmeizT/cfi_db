export function getTextColor(
    oklch: string,
    deltaL = -0.3,
    deltaC = 0,
    alpha = 1
): string {
    const match = oklch.match(/oklch\(([^ ]+) ([^ ]+) ([^)]+)\)/)
    if (!match) return oklch

    const [, l, c, h] = match
    const newL = Math.max(0, Math.min(1, parseFloat(l) + deltaL)) // clamp 0-1
    const newC = Math.max(0, parseFloat(c) + deltaC)

    return `oklch(${newL} ${newC} ${h} / ${alpha})`
}