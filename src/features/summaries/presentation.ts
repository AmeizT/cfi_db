import type { SummaryMetrics, Value, SummaryResponse, AssemblySummary } from "./types"
export function number(value: Value) {
    return value == null ? "—" : new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(Number(value))
}
export function money(value: Value, currency: string | null) {
    if (value == null) return "—"
    return `${currency ? `${currency} ` : ""}${number(value)}`
}
export function financeValue(s: SummaryMetrics, key: keyof SummaryMetrics["finance"]) {
    if (s.currency || !s.finance_by_currency?.length) return money(s.finance[key], s.currency)
    return s.finance_by_currency.map(group => group.currency
        ? `${group.currency} ${number(group.finance[key])}`
        : `${group.assembly_name ?? "Assembly"} (currency unknown): ${number(group.finance[key])}`
    ).join(" · ")
}
export function periodLabel(period: string) {
    return new Date(`${period}-01T12:00:00`).toLocaleDateString("en", { month: "long", year: "numeric" })
}
export function summaryCards(s: SummaryMetrics, regional: boolean, contributorCount?: number) {
    const scope = regional ? "YTD" : "Selected month"
    return [
        { label: regional ? "Total Attendance" : "General Attendance", value: number(regional ? s.attendance.total : s.attendance.general), note: `${scope} · attendances`, icon: "people" },
        { label: "Total Tithes", value: financeValue(s, "tithes"), note: scope, icon: "money" },
        { label: "Other Revenue", value: financeValue(s, "other_revenue"), note: scope, icon: "revenue" },
        { label: "Total Expenses", value: financeValue(s, "expenses"), note: `${scope} · includes paid remittances`, icon: "expense" },
        { label: "Total Members", value: number(s.membership.current), note: "Selected month · reported members", icon: "people" },
        { label: regional ? "New Assemblies" : "Tithe Contributors", value: number(regional ? s.outreach.plants.length : contributorCount ?? null), note: regional ? "Planted YTD" : "Selected month · identified givers", icon: "plant" },
        { label: "Homecells", value: number(s.outreach.homecells), note: "Current active register", icon: "home" },
        { label: "Leaders Ordained", value: number(s.outreach.ordained), note: "No dated ordination data", icon: "leader" },
    ]
}
export function ytdCards(s: SummaryMetrics) {
    return [
        { label: "General Attendance YTD", value: number(s.attendance.general), note: "January through selected month", icon: "people" },
        { label: "Tithes YTD", value: financeValue(s, "tithes"), note: "January through selected month", icon: "money" },
        { label: "Other Revenue YTD", value: financeValue(s, "other_revenue"), note: "January through selected month", icon: "revenue" },
        { label: "Expenses YTD", value: financeValue(s, "expenses"), note: "Includes paid remittances", icon: "expense" },
        { label: "Remittance Paid YTD", value: financeValue(s, "paid"), note: "Verified through selected month", icon: "money" },
        { label: "Remittance Outstanding", value: financeValue(s, "outstanding"), note: "YTD obligations · selected month cutoff", icon: "expense" },
    ]
}

export function topContributorsByCurrency(rows: AssemblySummary[]) {
    const groups = new Map<string, { currency: string | null; assemblyName: string | null; contributors: { id: number; name: string; amount: Value; assemblyId: number; assemblyName: string }[] }>()
    for (const row of rows) {
        const key = row.currency ?? `unknown-${row.id}`
        const group = groups.get(key) ?? { currency: row.currency, assemblyName: row.currency ? null : row.name, contributors: [] }
        group.contributors.push(...row.giving.top.map(c => ({ ...c, assemblyId: row.id, assemblyName: row.name })))
        groups.set(key, group)
    }
    return [...groups.values()].map(group => ({ ...group, contributors: group.contributors
        .sort((a, b) => Number(b.amount) - Number(a.amount) || a.assemblyId - b.assemblyId || a.id - b.id).slice(0, 5) }))
}

export function exportRows(data: SummaryResponse) {
    const result: { section: string; metric: string; value: string }[] = []
    function append(s: SummaryMetrics, title: string, ytd: boolean) {
        const period = ytd ? "YTD" : data.period
        Object.entries(s.attendance).forEach(([key, value]) => result.push({ section: title, metric: `Attendance · ${key} (${period})`, value: number(value ?? null) }))
        Object.entries(s.finance).forEach(([key]) => result.push({ section: title, metric: `${key.replaceAll("_", " ")} (${period})`, value: financeValue(s, key as keyof SummaryMetrics["finance"]) }))
        s.outreach.plants.forEach(p => result.push({ section: title, metric: `Assembly planted (${period})`, value: `${p.name} · ${p.date}` }))
        if (ytd) return
        if (s.giving) result.push({ section: title, metric: `Identified tithe contributors (${data.period}; assembly counts)`, value: number(s.giving.count) })
        Object.entries(s.membership).filter(([key]) => key !== "comparable_assemblies").forEach(([key, value]) => result.push({ section: title, metric: `Membership · ${key.replaceAll("_", " ")} (${data.period})`, value: number(value ?? null) }))
        result.push({ section: title, metric: "Homecells (current register)", value: number(s.outreach.homecells) })
        result.push({ section: title, metric: `Leaders ordained (${data.period})`, value: number(s.outreach.ordained) })
        s.targets.forEach(t => result.push({ section: title, metric: `${t.name} target (${data.period})`, value: t.target == null ? "No target set" : `${number(t.achieved)} / ${number(t.target)} (${number(t.percent)}%)` }))
    }
    if (data.regional) append(data.summary, data.name, true)
    append(data.regional ? data.monthly_summary : data.summary, data.name, false)
    if (data.regional) data.assemblies.forEach(a => {
        append(a, a.name, true)
        append({ ...a, ...a.monthly }, a.name, false)
    })
    data.assemblies.forEach(a => {
        a.giving.top.forEach(c => result.push({ section: a.name, metric: `Top giving · ${c.name} (${data.period})`, value: money(c.amount, a.currency) }))
        Object.entries(a.assets).forEach(([key, value]) => result.push({ section: a.name, metric: `Assets · ${key} (${data.period})`, value: number(value ?? null) }))
    })
    data.limitations.forEach(note => result.push({ section: "Data notes", metric: note, value: "" }))
    return result
}
