/**
 * Adjusts the lightness of an OKLCH color string.
 * @param oklch - The OKLCH color string, e.g. "oklch(0.6 0.2 120)"
 * @param lightness - New lightness value (0-1)
 * @param alpha - Optional alpha (opacity)
 * @returns OKLCH color string with updated lightness
 */
function adjustOklch(
    base: string,
    lightness: number,
    chromaFactor = 0.6,   // reduce saturation
    alpha = 0.85          // slightly faded
): string {
    const match = base.match(/oklch\(([^ ]+) ([^ ]+) ([^)]+)\)/)
    if (!match) return base

    const [, , c, h] = match
    const reducedChroma = Number(c) * chromaFactor

    return `oklch(${lightness} ${reducedChroma} ${h} / ${alpha})`
}


export function oklchLinearGradient(
    base: string,
    stops: number[] = [0.92, 0.82],
    chromaFactor = 0.55,
    alpha = 0.85
) {
    return `linear-gradient(
    135deg,
    ${stops
            .map(l => adjustOklch(base, l, chromaFactor, alpha))
            .join(", ")}
  )`
}


export function themeVariant(
    base: string,
    options?: {
        lightness?: number;
        chromaFactor?: number;
        alpha?: number;
    }
): string {
    return adjustOklch(
        base,
        options?.lightness ?? 0.92,
        options?.chromaFactor ?? 0.55,
        options?.alpha ?? 1
    );
}