/** WCAG relative luminance of a rendered sRGB theme color. */
export function sidebarUsesLightForeground(red: number, green: number, blue: number) {
    const linear = [red, green, blue].map((channel) => {
        const value = channel / 255
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })
    const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
    return 1.05 / (luminance + 0.05) >= 4.5
}

/** Canvas resolves supported CSS colors, including OKLCH, into rendered sRGB. */
export function applySidebarForeground(root: HTMLElement, color: string) {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return
    context.fillStyle = "white"
    context.fillRect(0, 0, 1, 1)
    context.fillStyle = color
    context.fillRect(0, 0, 1, 1)
    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data
    const light = sidebarUsesLightForeground(red, green, blue)
    root.style.setProperty("--assembly-sidebar-active-foreground", light ? "var(--color-white)" : "var(--color-black)")
}
