export function formatCurrency(
  amount: number,
  options: Intl.NumberFormatOptions & { language?: string } = {}
): string {
  if (isNaN(amount)) return ""

  // const {
  //   language = "en-US",
  //   currency = "USD",
  //   style = "currency",
  //   minimumFractionDigits = 2,
  //   maximumFractionDigits = 2,
  //   ...rest
  // } = options

  const {
    language = "en-US",
    currency = "USD",
    style = "currency",
    notation,
    minimumFractionDigits = notation === "compact" ? 0 : 2,
    maximumFractionDigits = notation === "compact" ? 1 : 2,
    ...rest
  } = options

  return new Intl.NumberFormat(language, {
    style,
    currency,
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
    ...rest,
  }).format(amount)
}


export function formatNumber(
  amount: number,
  options: Intl.NumberFormatOptions & {
    language?: string
    currency?: string
  } = {}
): string {
  if (isNaN(amount)) return ""

  const {
    language = "en-US",
    currency,
    notation,
    minimumFractionDigits = currency
      ? (notation === "compact" ? 0 : 2)
      : 0,
    maximumFractionDigits = currency
      ? (notation === "compact" ? 1 : 2)
      : notation === "compact"
        ? 1
        : 0,
    style = currency ? "currency" : "decimal",
    ...rest
  } = options

  return new Intl.NumberFormat(language, {
    style,
    currency,
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
    ...rest,
  }).format(amount)
}