export function formatReportPeriod(value: string) {
  const date = new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date)
}

export function formatReportDate(value?: string | null, includeTime = false) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value))
}

export function formatReportValue(value: string | number, currency?: string) {
  const number = Number(value)
  if (!Number.isFinite(number)) return "—"
  if (!currency) return number.toLocaleString()
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency }).format(number)
  } catch {
    return `${currency} ${number.toLocaleString()}`
  }
}

export function reportPeriodKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00`)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export function reportPeriodHref(value: string | Date) {
  return `/reports/period/${reportPeriodKey(value)}`
}

export function reportDestination(report: { period_start: string }) {
  return reportPeriodHref(report.period_start)
}

export function adjacentReportPeriod(value: string, offset: number) {
  const date = new Date(`${value}T00:00:00`)
  date.setMonth(date.getMonth() + offset)
  return reportPeriodHref(date)
}
