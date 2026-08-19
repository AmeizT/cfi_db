export function normalizeFinancialCategoryName(value: string) {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .map((token) => {
            if (token.length > 4 && token.endsWith("ies")) return `${token.slice(0, -3)}y`
            if (token.length > 4 && token.endsWith("ses")) return token.slice(0, -2)
            if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) {
                return token.slice(0, -1)
            }
            return token
        })
        .join(" ")
}
