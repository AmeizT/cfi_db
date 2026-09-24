"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
    Banknote,
    BarChart3,
    ChevronRight,
    Download,
    Home,
    Sprout,
    Users,
    UserRound,
    Wallet,
} from "lucide-react"

import { useUser } from "@/hooks/query/use-user"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { usesRegionalShell } from "@/features/regional-shell/scope"

import { getSummary, getSummaryContributors } from "./api"
import { regionalFilterParams } from "./filters"
import {
    exportRows,
    financeValue,
    money,
    number,
    periodLabel,
    summaryCards,
    topContributorsByCurrency,
    ytdCards,
} from "./presentation"
import type { AssemblySummary, SummaryMetrics } from "./types"
import styles from "./summary.module.css"

const icons = {
    people: Users,
    money: Banknote,
    revenue: BarChart3,
    expense: Wallet,
    plant: Sprout,
    home: Home,
    leader: UserRound,
}

const monthNow = () => {
    const d = new Date()

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function Block({
    title,
    note,
    children,
}: {
    title: string
    note?: string
    children: ReactNode
}) {
    return (
        <section className={styles.block}>
            <h3>{title}</h3>
            {note && <p className={styles.note}>{note}</p>}
            {children}
        </section>
    )
}

function Fact({
    label,
    value,
}: {
    label: string
    value: ReactNode
}) {
    return (
        <div className={styles.fact}>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    )
}

function Snapshot({
    s,
    regional,
}: {
    s: SummaryMetrics
    regional: boolean
}) {
    const scope = "Selected month"

    return (
        <div className={styles.snapshot}>
            <Block
                title="Attendance"
                note={`${scope} · recorded attendances`}
            >
                <Fact
                    label="Sunday General"
                    value={number(s.attendance.general)}
                />
                <Fact
                    label="Sunday School"
                    value={number(s.attendance.school)}
                />
                <Fact
                    label="Cell Groups"
                    value={number(s.attendance.cells)}
                />

                <p className={styles.note}>
                    Monthly target context appears below.
                </p>
            </Block>

            <Block title="Finance Snapshot" note={scope}>
                {(
                    [
                        ["Tithes", "tithes"],
                        ["Other Revenue", "other_revenue"],
                        ["Expenses", "expenses"],
                        ["Remittance due", "due"],
                        ["Remittance paid", "paid"],
                        ["Outstanding", "outstanding"],
                    ] as const
                ).map(([label, key]) => (
                    <Fact
                        key={key}
                        label={label}
                        value={
                            <span className="whitespace-normal">
                                {financeValue(s, key)}
                            </span>
                        }
                    />
                ))}

                <p className={styles.note}>
                    Remittances: obligations in this period; verified payments
                    through month end.
                </p>
            </Block>

            <Block
                title="Membership & Growth"
                note="Selected month · reported membership"
            >
                <Fact
                    label="Previous month members"
                    value={number(s.membership.previous)}
                />
                <Fact
                    label="Members this month"
                    value={number(s.membership.current)}
                />
                <Fact
                    label="Net change"
                    value={number(s.membership.net)}
                />
                <Fact
                    label="Growth"
                    value={
                        s.membership.percent == null
                            ? "—"
                            : `${number(s.membership.percent)}%`
                    }
                />

                {regional &&
                    s.membership.comparable_assemblies != null && (
                        <p className={styles.note}>
                            Net change and growth compare{" "}
                            {s.membership.comparable_assemblies} assemblies with
                            reports in both months.
                        </p>
                    )}

                <p className={styles.note}>
                    {number(s.membership.new)} new memberships ·{" "}
                    {number(s.membership.transfers_in)} transfers in ·{" "}
                    {number(s.membership.transfers_out)} out ·{" "}
                    {number(s.membership.removals)} other departures.
                </p>

                <p className={styles.note}>
                    {number(s.membership.new_households)} households registered
                    this month · {number(s.membership.households)} in current
                    register.
                </p>
            </Block>

            <Block title="Church Planting & Outreach" note={scope}>
                <Fact
                    label="New assemblies planted this month"
                    value={s.outreach.plants.length}
                />

                {s.outreach.plants.map((p) => (
                    <p key={p.id} className={styles.plant}>
                        {p.name}
                        <span>{p.date}</span>
                    </p>
                ))}

                <Fact
                    label="Homecells · current register"
                    value={number(s.outreach.homecells)}
                />
                <Fact
                    label="Leaders ordained this month"
                    value={number(s.outreach.ordained)}
                />
            </Block>
        </div>
    )
}

function Targets({ s }: { s: SummaryMetrics }) {
    return (
        <div className={styles.targets}>
            {s.targets.map((t) => (
                <Block key={t.name} title={t.name}>
                    <div className={styles.targetLine}>
                        <span>
                            {t.target == null
                                ? "No target set"
                                : `Target ${number(t.target)}`}
                        </span>

                        <strong>
                            {t.percent == null
                                ? "—"
                                : `${number(t.percent)}%`}
                        </strong>
                    </div>

                    <div
                        role="progressbar"
                        aria-label={`${t.name} target achievement`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={
                            t.percent == null
                                ? undefined
                                : Math.min(100, Math.max(0, t.percent))
                        }
                        className={styles.progress}
                    >
                        <span
                            style={{
                                width: `${Math.max(
                                    0,
                                    Math.min(100, t.percent ?? 0),
                                )}%`,
                            }}
                        />
                    </div>

                    <p className={styles.note}>
                        Achieved{" "}
                        {t.name === "Tithes"
                            ? money(t.achieved, s.currency)
                            : number(t.achieved)}{" "}
                        · selected month
                    </p>
                </Block>
            ))}
        </div>
    )
}

function Table({
    headers,
    children,
}: {
    headers: string[]
    children: ReactNode
}) {
    return (
        <div className={styles.tableScroll}>
            <table>
                <thead>
                    <tr>
                        {headers.map((h) => (
                            <th key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>{children}</tbody>
            </table>
        </div>
    )
}

function AssemblyLink({
    a,
    period,
}: {
    a: AssemblySummary
    period: string
}) {
    return (
        <Link
            className={styles.link}
            href={`/summary/assembly?assembly=${a.id}&period=${period}`}
        >
            {a.name}
        </Link>
    )
}

function PeriodValues({
    monthly,
    ytd,
}: {
    monthly: string
    ytd: string
}) {
    return (
        <>
            <span className="block">{monthly}</span>
            <span className="block text-xs text-muted-foreground">
                {ytd} YTD
            </span>
        </>
    )
}

function RegionalGiving({
    rows,
    summary,
    period,
    onGiving,
}: {
    rows: AssemblySummary[]
    summary: SummaryMetrics
    period: string
    onGiving: (a: AssemblySummary) => void
}) {
    return (
        <Block
            title="Giving"
            note={`${periodLabel(period)} · top identified contributors by assembly and currency`}
        >
            <Fact
                label="Tithe contributors this month (assembly counts)"
                value={number(summary.giving?.count ?? null)}
            />

            {topContributorsByCurrency(rows).map((group) => (
                <div key={group.currency ?? group.assemblyName}>
                    <p className={styles.note}>
                        {group.currency ??
                            `${group.assemblyName} · currency not recorded`}
                    </p>

                    {group.contributors.length ? (
                        <Table
                            headers={[
                                "Contributor",
                                "Assembly",
                                "Amount",
                                "Details",
                            ]}
                        >
                            {group.contributors.map((c) => (
                                <tr key={`${c.assemblyId}-${c.id}`}>
                                    <td>{c.name}</td>
                                    <td>{c.assemblyName}</td>
                                    <td>{money(c.amount, group.currency)}</td>
                                    <td>
                                        <button
                                            className={styles.link}
                                            onClick={() => {
                                                const a = rows.find(
                                                    (row) =>
                                                        row.id === c.assemblyId,
                                                )

                                                if (a) {
                                                    onGiving(a)
                                                }
                                            }}
                                        >
                                            View all contributors
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    ) : (
                        <p className={styles.note}>
                            No identified contributors recorded this month.
                        </p>
                    )}
                </div>
            ))}
        </Block>
    )
}

function ZoneTables({
    rows,
    period,
    onGiving,
}: {
    rows: AssemblySummary[]
    period: string
    onGiving: (a: AssemblySummary) => void
}) {
    return (
        <div className={styles.zoneBody}>
            <Block
                title="Finance & Attendance"
                note={`${periodLabel(period)} primary · January through selected month below`}
            >
                <Table
                    headers={[
                        "Assembly",
                        "Tithes",
                        "Other Revenue",
                        "Expenses",
                        "Due",
                        "Paid",
                        "Outstanding",
                        "General Attendance",
                    ]}
                >
                    {rows.map((a) => (
                        <tr key={a.id}>
                            <td>
                                <AssemblyLink a={a} period={period} />
                            </td>

                            {(
                                [
                                    "tithes",
                                    "other_revenue",
                                    "expenses",
                                    "due",
                                    "paid",
                                    "outstanding",
                                ] as const
                            ).map((k) => (
                                <td key={k}>
                                    <PeriodValues
                                        monthly={money(
                                            a.monthly?.finance[k] ?? null,
                                            a.currency,
                                        )}
                                        ytd={money(
                                            a.finance[k],
                                            a.currency,
                                        )}
                                    />
                                </td>
                            ))}

                            <td>
                                <PeriodValues
                                    monthly={number(
                                        a.monthly?.attendance.general ?? null,
                                    )}
                                    ytd={number(a.attendance.general)}
                                />
                            </td>
                        </tr>
                    ))}
                </Table>
            </Block>

            <Block title="Growth (selected month)">
                <Table
                    headers={[
                        "Assembly",
                        "Previous members",
                        "This month",
                        "Growth",
                        "Attendance / target",
                    ]}
                >
                    {rows.map((a) => (
                        <tr key={a.id}>
                            <td>
                                <AssemblyLink a={a} period={period} />
                            </td>
                            <td>{number(a.membership.previous)}</td>
                            <td>{number(a.membership.current)}</td>
                            <td>
                                {a.membership.percent == null
                                    ? "—"
                                    : `${number(a.membership.percent)}%`}
                            </td>
                            <td>
                                {number(a.targets[1].achieved)} /{" "}
                                {a.targets[1].target == null
                                    ? "No target set"
                                    : number(a.targets[1].target)}
                            </td>
                        </tr>
                    ))}
                </Table>
            </Block>

            <Block title="Giving / Contributors (selected month)">
                <Table
                    headers={[
                        "Assembly",
                        "Contributors",
                        "Top contributor",
                        "Amount",
                        "Details",
                    ]}
                >
                    {rows.map((a) => (
                        <tr key={a.id}>
                            <td>
                                <AssemblyLink a={a} period={period} />
                            </td>
                            <td>{a.giving.count}</td>
                            <td>
                                {a.giving.top[0]?.name ?? "No contributors"}
                            </td>
                            <td>
                                {money(
                                    a.giving.top[0]?.amount ?? null,
                                    a.currency,
                                )}
                            </td>
                            <td>
                                <button
                                    className={styles.link}
                                    onClick={() => onGiving(a)}
                                >
                                    View all contributors
                                </button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Block>

            <Block title="Church Planting & Outreach">
                <Table
                    headers={[
                        "Assembly",
                        "Plants (month / YTD)",
                        "Homecells (current)",
                        "Leaders ordained (month)",
                    ]}
                >
                    {rows.map((a) => (
                        <tr key={a.id}>
                            <td>{a.name}</td>
                            <td>
                                <PeriodValues
                                    monthly={
                                        a.monthly?.outreach.plants
                                            .map((p) => p.name)
                                            .join(", ") || "None recorded"
                                    }
                                    ytd={
                                        a.outreach.plants
                                            .map((p) => p.name)
                                            .join(", ") || "None recorded"
                                    }
                                />
                            </td>
                            <td>{number(a.outreach.homecells)}</td>
                            <td>—</td>
                        </tr>
                    ))}
                </Table>
            </Block>
        </div>
    )
}

function GivingDrawer({
    assembly,
    period,
    close,
}: {
    assembly: AssemblySummary | null
    period: string
    close: () => void
}) {
    const { data: user } = useUser()

    const query = useQuery({
        queryKey: [
            "summary-contributors",
            user?.id,
            assembly?.id,
            period,
        ],
        queryFn: () =>
            getSummaryContributors({
                assembly: String(assembly!.id),
                period,
            }),
        enabled: !!assembly && !!user,
    })

    return (
        <Sheet
            open={!!assembly}
            onOpenChange={(open) => {
                if (!open) {
                    close()
                }
            }}
        >
            <SheetContent className="overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Tithe contributors</SheetTitle>
                    <SheetDescription>
                        {assembly?.name} · {periodLabel(period)}
                    </SheetDescription>
                </SheetHeader>

                <div className="p-6">
                    {query.isPending ? (
                        <p role="status">Loading contributors…</p>
                    ) : query.isError ? (
                        <div role="alert">
                            <p>{query.error.message}</p>
                            <Button
                                variant="outline"
                                onClick={() => query.refetch()}
                            >
                                Try again
                            </Button>
                        </div>
                    ) : (
                        <>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {query.data.contributors.length} identified
                                contributors. Anonymous payments are excluded
                                from this list.
                            </p>

                            <Table headers={["Contributor", "Amount"]}>
                                {query.data.contributors.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.name}</td>
                                        <td>
                                            {money(
                                                c.amount,
                                                query.data.currency,
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </Table>

                            {!query.data.contributors.length && (
                                <p>
                                    No identified tithe contributors recorded
                                    for this month.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export function SummaryPage({
    kind,
}: {
    kind: "regional" | "assembly"
}) {
    const regional = kind === "regional"
    const title = regional ? "Executive Summary" : "Assembly Summary"

    const router = useRouter()
    const pathname = usePathname()
    const search = useSearchParams()
    const user = useUser()

    const regionalShell = regional && usesRegionalShell(user.data)
    const activeZone = user.data?.active_regional_zone
    const period = search.get("period") ?? monthNow()

    const scope = regionalShell
        ? String(activeZone?.region ?? "")
        : search.get(regional ? "region" : "assembly") ??
          (regional ? "" : String(user.data?.church ?? ""))

    const zone = regionalShell
        ? String(activeZone?.id ?? "")
        : search.get("zone") ?? ""

    const country =
        regionalShell && search.get("zone") && search.get("zone") !== zone
            ? ""
            : search.get("country") ?? ""

    const allowed = regional
        ? user.data?.can_view_executive_summary
        : user.data?.can_view_assembly_summary

    const [giving, setGiving] = useState<AssemblySummary | null>(null)
    const [exportError, setExportError] = useState("")
    const [exporting, setExporting] = useState(false)

    const query = useQuery({
        queryKey: [
            "summary",
            kind,
            period,
            scope,
            zone,
            country,
            user.data?.id,
        ],
        queryFn: () =>
            getSummary(kind, {
                period,
                ...(regional ? { zone, country } : {}),
                ...(scope
                    ? {
                          [regional ? "region" : "assembly"]: scope,
                      }
                    : {}),
            }),
        enabled: !!allowed,
    })

    function update(key: string, value: string) {
        const params = regional
            ? regionalFilterParams(
                  search.toString(),
                  query.data?.filters,
                  key,
                  value,
                  period,
              )
            : new URLSearchParams(search.toString())

        if (!regional) {
            params.set("period", period)

            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        }

        setGiving(null)
        router.replace(`${pathname}?${params}`, { scroll: false })
    }

    async function download() {
        if (!query.data) {
            return
        }

        setExporting(true)
        setExportError("")

        try {
            const { exportTablePdf } = await import(
                "@/features/data-table/utils/pdf-export"
            )

            exportTablePdf({
                filename: `${kind}-summary-${period}.pdf`,
                title,
                metadata: {
                    region: query.data.name,
                    filters: {
                        period,
                        ...(query.data.filters
                            ? {
                                  zone:
                                      query.data.filters.zones.find(
                                          (z) =>
                                              z.id ===
                                              query.data!.filters!.zone,
                                      )?.name ?? "",
                                  country:
                                      query.data.filters.country === "all"
                                          ? "All countries (by currency)"
                                          : query.data.filters.countries.find(
                                                (c) =>
                                                    c.id ===
                                                    query.data!.filters!
                                                        .country,
                                            )?.name ?? "",
                              }
                            : {}),
                        scope: regional
                            ? "YTD through selected month; membership and targets monthly"
                            : "Selected month",
                    },
                },
                columns: [
                    { id: "section", label: "Section" },
                    { id: "metric", label: "Metric / period" },
                    { id: "value", label: "Value" },
                ],
                rows: exportRows(query.data),
            })
        } catch {
            setExportError(
                "Export could not be generated. Please try again.",
            )
        } finally {
            setExporting(false)
        }
    }

    const data = query.data
    const s = data?.summary
    const assembly = data?.assemblies[0]
    const options = data?.available_assemblies
    const monthly = regional ? data?.monthly_summary : s
    const filters = data?.filters

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>
                        CFI Workspace · Summary
                    </p>

                    <h1>{title}</h1>

                    <p className={styles.subtitle}>
                        {data?.name ?? "Churches. People. Growth."}
                        {data && (
                            <>
                                {" · "}
                                {regional
                                    ? `${
                                          filters?.zones.find(
                                              (z) => z.id === filters.zone,
                                          )?.name ?? ""
                                      } · ${
                                          filters?.country === "all"
                                              ? "All countries"
                                              : filters?.countries.find(
                                                    (c) =>
                                                        c.id ===
                                                        filters.country,
                                                )?.name ?? ""
                                      }`
                                    : periodLabel(data.period)}
                            </>
                        )}
                    </p>
                </div>

                <div className={styles.controls}>
                    {regional ? (
                        <>
                            {!regionalShell && (
                                <label>
                                    <span className="sr-only">Zone</span>

                                    <select
                                        aria-label="Zone"
                                        value={filters?.zone ?? ""}
                                        disabled={!filters?.zones.length}
                                        onChange={(e) =>
                                            update("zone", e.target.value)
                                        }
                                    >
                                        {!filters?.zones.length && (
                                            <option value="">
                                                No permitted zones
                                            </option>
                                        )}

                                        {filters?.zones.map((z) => (
                                            <option key={z.id} value={z.id}>
                                                {z.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            <label>
                                <span className="sr-only">Country</span>

                                <select
                                    aria-label="Country"
                                    value={filters?.country ?? ""}
                                    disabled={!filters?.countries.length}
                                    onChange={(e) =>
                                        update("country", e.target.value)
                                    }
                                >
                                    {!filters?.countries.length && (
                                        <option value="">
                                            No countries available
                                        </option>
                                    )}

                                    {filters?.countries.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}

                                    {!!filters?.countries.length && (
                                        <option value="all">
                                            All countries (by currency)
                                        </option>
                                    )}
                                </select>
                            </label>
                        </>
                    ) : (
                        !!options?.length && (
                            <label>
                                <span className="sr-only">Assembly</span>

                                <select
                                    aria-label="Assembly"
                                    value={
                                        scope || String(assembly?.id ?? "")
                                    }
                                    onChange={(e) =>
                                        update("assembly", e.target.value)
                                    }
                                >
                                    {options.map((o) => (
                                        <option key={o.id} value={o.id}>
                                            {o.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )
                    )}

                    <label>
                        <span className="sr-only">
                            Summary month and year
                        </span>

                        <input
                            aria-label="Summary month and year"
                            type="month"
                            value={period}
                            onChange={(e) => {
                                if (e.target.value) {
                                    update("period", e.target.value)
                                }
                            }}
                        />
                    </label>

                    <Button
                        variant="outline"
                        disabled={!data || query.isFetching || exporting}
                        onClick={download}
                    >
                        <Download size={16} />
                        {exporting ? "Exporting…" : "Export PDF"}
                    </Button>
                </div>
            </header>

            {exportError && <p role="alert">{exportError}</p>}

            {user.isPending ? (
                <p role="status">Loading access…</p>
            ) : user.isError ? (
                <p role="alert">
                    Your account could not be loaded. Refresh to try again.
                </p>
            ) : !allowed ? (
                <p role="alert">You do not have access to this summary.</p>
            ) : query.isPending ? (
                <div className={styles.loading} role="status">
                    Loading {title.toLowerCase()}…
                </div>
            ) : query.isError ? (
                <div className={styles.empty} role="alert">
                    <p>{query.error.message}</p>
                    <Button
                        variant="outline"
                        onClick={() => query.refetch()}
                    >
                        Try again
                    </Button>
                </div>
            ) : (
                data &&
                s &&
                monthly && (
                    <>
                        {!data.assemblies.length ? (
                            <div className={styles.empty}>
                                No assemblies available in this scope.
                            </div>
                        ) : (
                            <>
                                <div className={styles.coverage}>
                                    {s.report_count} of {s.expected_reports}{" "}
                                    monthly reports available. Totals include
                                    available data; missing assembly values
                                    remain —.
                                    {s.mixed_currencies &&
                                        " Financial totals are shown separately by currency."}
                                </div>

                                {regional && (
                                    <h2 className={styles.sectionTitle}>
                                        YTD Overview
                                        <span>
                                            January – {periodLabel(period)}
                                        </span>
                                    </h2>
                                )}

                                <div className={styles.cards}>
                                    {(regional
                                        ? ytdCards(s)
                                        : summaryCards(
                                              s,
                                              false,
                                              assembly?.giving.count,
                                          )
                                    ).map((card, i) => {
                                        const Icon =
                                            icons[
                                                card.icon as keyof typeof icons
                                            ]

                                        return (
                                            <section
                                                className={styles.card}
                                                key={card.label}
                                            >
                                                <span
                                                    className={styles.icon}
                                                    data-tone={i % 4}
                                                >
                                                    <Icon size={23} />
                                                </span>

                                                <div>
                                                    <h2>{card.label}</h2>
                                                    <strong>
                                                        {card.value}
                                                    </strong>
                                                    <p>{card.note}</p>
                                                </div>
                                            </section>
                                        )
                                    })}
                                </div>

                                <h2 className={styles.sectionTitle}>
                                    {regional
                                        ? periodLabel(period)
                                        : "Assembly"}{" "}
                                    Snapshot
                                </h2>

                                <Snapshot s={monthly} regional={regional} />

                                {regional && (
                                    <RegionalGiving
                                        rows={data.assemblies}
                                        summary={monthly}
                                        period={period}
                                        onGiving={setGiving}
                                    />
                                )}

                                <h2 className={styles.sectionTitle}>
                                    Performance vs Targets
                                    <span>
                                        Selected month · {periodLabel(period)}
                                    </span>
                                </h2>

                                <Targets s={monthly} />

                                {regional && (
                                    <p className={styles.note}>
                                        Regional target totals require targets
                                        for every assembly and matching
                                        currencies. See zone rows for available
                                        attendance targets.
                                    </p>
                                )}

                                {regional ? (
                                    <>
                                        <h2 className={styles.sectionTitle}>
                                            By Zone
                                            <span>
                                                {data.zones.length} zones ·
                                                select to expand
                                            </span>
                                        </h2>

                                        <div className={styles.zones}>
                                            {data.zones.map((zone) => (
                                                <details
                                                    key={
                                                        zone.id ?? "unassigned"
                                                    }
                                                    className={styles.zone}
                                                >
                                                    <summary>
                                                        <ChevronRight
                                                            size={16}
                                                        />
                                                        <strong>
                                                            {zone.name}
                                                        </strong>
                                                        <span>
                                                            {
                                                                zone.assemblies
                                                                    .length
                                                            }{" "}
                                                            assemblies
                                                        </span>
                                                        <span>
                                                            Attendance (YTD){" "}
                                                            <b>
                                                                {number(
                                                                    zone.summary
                                                                        .attendance
                                                                        .total,
                                                                )}
                                                            </b>
                                                        </span>
                                                        <span>
                                                            Tithes (YTD){" "}
                                                            <b>
                                                                {financeValue(
                                                                    zone.summary,
                                                                    "tithes",
                                                                )}
                                                            </b>
                                                        </span>
                                                        <span>
                                                            Members (month){" "}
                                                            <b>
                                                                {number(
                                                                    zone.summary
                                                                        .membership
                                                                        .current,
                                                                )}
                                                            </b>
                                                        </span>
                                                    </summary>

                                                    <ZoneTables
                                                        rows={zone.assemblies}
                                                        period={period}
                                                        onGiving={setGiving}
                                                    />
                                                </details>
                                            ))}
                                        </div>

                                        <div className={styles.highlights}>
                                            <Block title="Regional Highlights">
                                                <Fact
                                                    label="New assemblies planted YTD"
                                                    value={
                                                        s.outreach.plants.length
                                                    }
                                                />
                                                <Fact
                                                    label="Net membership change this month"
                                                    value={number(
                                                        s.membership.net,
                                                    )}
                                                />
                                            </Block>

                                            <Block title="Areas for Attention">
                                                <Fact
                                                    label="Assemblies below a defined monthly target"
                                                    value={
                                                        data.assemblies.filter(
                                                            (a) =>
                                                                a.targets.some(
                                                                    (t) =>
                                                                        t.target !=
                                                                            null &&
                                                                        t.achieved !=
                                                                            null &&
                                                                        Number(
                                                                            t.achieved,
                                                                        ) <
                                                                            Number(
                                                                                t.target,
                                                                            ),
                                                                ),
                                                        ).length
                                                    }
                                                />
                                                <Fact
                                                    label="Assemblies with outstanding remittances"
                                                    value={
                                                        data.assemblies.filter(
                                                            (a) =>
                                                                Number(
                                                                    a.finance
                                                                        .outstanding,
                                                                ) > 0,
                                                        ).length
                                                    }
                                                />
                                                <p className={styles.note}>
                                                    Based only on recorded
                                                    targets and obligations.
                                                </p>
                                            </Block>
                                        </div>
                                    </>
                                ) : (
                                    assembly && (
                                        <>
                                            <h2
                                                className={
                                                    styles.sectionTitle
                                                }
                                            >
                                                Contributors & Giving
                                                <span>Selected month</span>
                                            </h2>

                                            <div className={styles.highlights}>
                                                <Block title="Tithe Contributors">
                                                    <Fact
                                                        label="Identified givers this month"
                                                        value={
                                                            assembly.giving.count
                                                        }
                                                    />
                                                    <Fact
                                                        label="Change vs previous month"
                                                        value={number(
                                                            assembly.giving
                                                                .count -
                                                                assembly.giving
                                                                    .previous_count,
                                                        )}
                                                    />

                                                    <Table
                                                        headers={[
                                                            "Top contributor",
                                                            "Amount",
                                                        ]}
                                                    >
                                                        {assembly.giving.top.map(
                                                            (c) => (
                                                                <tr key={c.id}>
                                                                    <td>
                                                                        {c.name}
                                                                    </td>
                                                                    <td>
                                                                        {money(
                                                                            c.amount,
                                                                            assembly.currency,
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </Table>

                                                    {!assembly.giving.top
                                                        .length && (
                                                        <p
                                                            className={
                                                                styles.note
                                                            }
                                                        >
                                                            No identified tithe
                                                            contributors
                                                            recorded this month.
                                                        </p>
                                                    )}

                                                    <Button
                                                        variant="outline"
                                                        className="mt-4"
                                                        onClick={() =>
                                                            setGiving(assembly)
                                                        }
                                                    >
                                                        View all contributors
                                                    </Button>
                                                </Block>

                                                <Block
                                                    title="Assets"
                                                    note="Selected month · register activity"
                                                >
                                                    <Fact
                                                        label="Assets acquired"
                                                        value={number(
                                                            assembly.assets
                                                                .added,
                                                        )}
                                                    />
                                                    <Fact
                                                        label="Disposals"
                                                        value={number(
                                                            assembly.assets
                                                                .disposals,
                                                        )}
                                                    />
                                                    <Fact
                                                        label="Pending disposal approval"
                                                        value={number(
                                                            assembly.assets
                                                                .pending,
                                                        )}
                                                    />

                                                    {!Number(
                                                        assembly.assets.added,
                                                    ) && (
                                                        <p
                                                            className={
                                                                styles.note
                                                            }
                                                        >
                                                            No asset acquisitions
                                                            recorded this month.
                                                        </p>
                                                    )}
                                                </Block>
                                            </div>
                                        </>
                                    )
                                )}
                            </>
                        )}

                        <details className={styles.notes}>
                            <summary>Data sources & availability</summary>
                            <ul>
                                {data.limitations.map((note) => (
                                    <li key={note}>{note}</li>
                                ))}
                            </ul>
                        </details>

                        {/* Future Signals this month content can be inserted here without changing the summary layout. */}
                    </>
                )
            )}

            <GivingDrawer
                assembly={giving}
                period={period}
                close={() => setGiving(null)}
            />
        </main>
    )
}
