"use client"

import * as React from "react"
import { DownloadIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
    downloadRegionalCompliancePdf,
    MONTH_OPTIONS,
    type MonthNumber,
} from "../services/download-regional-compliance-pdf"

type PeriodType = "single" | "range"

type RegionalCompliancePdfDialogProps = {
    regionId: string | number
    regionName: string
    selectedZone?: {
        id: string | number
        name: string
    } | null
    selectedCountryName?: string | null
    assemblyCount: number
    selectedYear: number
    disabled?: boolean
}

function asMonthNumber(value: number): MonthNumber {
    return Math.min(Math.max(value, 1), 12) as MonthNumber
}

function getValidMonths(year: number, currentYear: number, currentMonth: number) {
    if (year > currentYear) return []

    const maxMonth = year === currentYear ? currentMonth : 12
    return MONTH_OPTIONS.filter((month) => month.value <= maxMonth)
}

function getInitialYear(selectedYear: number, currentYear: number) {
    if (!Number.isInteger(selectedYear) || selectedYear < 1) return currentYear

    return Math.min(selectedYear, currentYear)
}

function buildYearOptions(currentYear: number, selectedYear: number) {
    const years = new Set<number>()

    for (let year = currentYear; year >= currentYear - 6; year -= 1) {
        years.add(year)
    }

    if (selectedYear <= currentYear) {
        years.add(selectedYear)
    }

    return Array.from(years).sort((a, b) => b - a)
}

function getScopeLines({
    regionName,
    selectedZone,
    selectedCountryName,
    assemblyCount,
}: Pick<
    RegionalCompliancePdfDialogProps,
    "regionName" | "selectedZone" | "selectedCountryName" | "assemblyCount"
>) {
    const countLabel = `${assemblyCount} ${assemblyCount === 1 ? "assembly" : "assemblies"}`
    const filters = [
        selectedZone?.name,
        selectedCountryName,
    ].filter(Boolean)

    return {
        title: regionName,
        detail: filters.length ? `${filters.join(" - ")} - ${countLabel}` : `All ${countLabel}`,
    }
}

export function RegionalCompliancePdfDialog({
    regionId,
    regionName,
    selectedZone,
    selectedCountryName,
    assemblyCount,
    selectedYear,
    disabled,
}: RegionalCompliancePdfDialogProps) {
    const now = React.useMemo(() => new Date(), [])
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    const initialYear = getInitialYear(selectedYear, currentYear)
    const [open, setOpen] = React.useState(false)
    const [isPending, setIsPending] = React.useState(false)
    const [year, setYear] = React.useState(initialYear)
    const [periodType, setPeriodType] = React.useState<PeriodType>("single")
    const [month, setMonth] = React.useState<MonthNumber>(
        asMonthNumber(Math.min(currentMonth, 12))
    )
    const [fromMonth, setFromMonth] = React.useState<MonthNumber>(1)
    const [toMonth, setToMonth] = React.useState<MonthNumber>(
        asMonthNumber(Math.min(currentMonth, 12))
    )
    const yearOptions = React.useMemo(
        () => buildYearOptions(currentYear, selectedYear),
        [currentYear, selectedYear]
    )
    const validMonths = React.useMemo(
        () => getValidMonths(year, currentYear, currentMonth),
        [currentMonth, currentYear, year]
    )
    const scope = getScopeLines({
        regionName,
        selectedZone,
        selectedCountryName,
        assemblyCount,
    })
    const effectiveFromMonth = periodType === "single" ? month : fromMonth
    const effectiveToMonth = periodType === "single" ? month : toMonth
    const rangeError =
        effectiveFromMonth > effectiveToMonth
            ? "The end month must be the same as or after the start month."
            : null
    const futureError =
        year > currentYear || (year === currentYear && effectiveToMonth > currentMonth)
            ? "Monthly compliance reports cannot be generated for future periods."
            : null
    const validationError = rangeError ?? futureError

    function handleYearChange(value: string) {
        const nextYear = Number(value)
        const nextMaxMonth = nextYear === currentYear ? currentMonth : 12

        setYear(nextYear)
        setMonth((current) => asMonthNumber(Math.min(current, nextMaxMonth)))
        setFromMonth((current) => asMonthNumber(Math.min(current, nextMaxMonth)))
        setToMonth((current) => asMonthNumber(Math.min(current, nextMaxMonth)))
    }

    async function handleGenerate() {
        if (validationError) return

        setIsPending(true)

        try {
            await downloadRegionalCompliancePdf({
                regionId,
                year,
                fromMonth: effectiveFromMonth,
                toMonth: effectiveToMonth,
                zoneId: selectedZone?.id,
                country: selectedCountryName,
            })
            toast.success("Compliance report downloaded successfully.")
            setOpen(false)
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to generate the compliance report."
            )
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    size="sm"
                    variant="offset"
                    disabled={disabled || assemblyCount <= 0}
                >
                    <DownloadIcon className="size-4" />
                    Download PDF
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Generate monthly compliance report</DialogTitle>
                    <DialogDescription className="sr-only">
                        Select one month or a month range in a single reporting year.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                    <div className="rounded-md border bg-muted/40 p-3">
                        <div className="text-xs font-medium uppercase text-muted-foreground">
                            Scope
                        </div>
                        <div className="mt-1 text-sm font-semibold">{scope.title}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{scope.detail}</div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="regional-compliance-pdf-year">
                            Reporting year
                        </Label>
                        <Select
                            value={String(year)}
                            disabled={isPending}
                            onValueChange={handleYearChange}
                        >
                            <SelectTrigger id="regional-compliance-pdf-year">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {yearOptions.map((option) => (
                                    <SelectItem key={option} value={String(option)}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-3">
                        <Label>Period type</Label>
                        <RadioGroup
                            value={periodType}
                            disabled={isPending}
                            className="grid gap-2 sm:grid-cols-2"
                            onValueChange={(value) => setPeriodType(value as PeriodType)}
                        >
                            <Label className="rounded-md border px-3 py-2">
                                <RadioGroupItem value="single" />
                                Single month
                            </Label>
                            <Label className="rounded-md border px-3 py-2">
                                <RadioGroupItem value="range" />
                                Month range
                            </Label>
                        </RadioGroup>
                    </div>

                    {periodType === "single" ? (
                        <div className="grid gap-2">
                            <Label htmlFor="regional-compliance-pdf-month">
                                Month
                            </Label>
                            <Select
                                value={String(month)}
                                disabled={isPending}
                                onValueChange={(value) => setMonth(Number(value) as MonthNumber)}
                            >
                                <SelectTrigger id="regional-compliance-pdf-month">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {validMonths.map((option) => (
                                        <SelectItem key={option.value} value={String(option.value)}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="regional-compliance-pdf-from-month">
                                    From month
                                </Label>
                                <Select
                                    value={String(fromMonth)}
                                    disabled={isPending}
                                    onValueChange={(value) =>
                                        setFromMonth(Number(value) as MonthNumber)
                                    }
                                >
                                    <SelectTrigger id="regional-compliance-pdf-from-month">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {validMonths.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={String(option.value)}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="regional-compliance-pdf-to-month">
                                    To month
                                </Label>
                                <Select
                                    value={String(toMonth)}
                                    disabled={isPending}
                                    onValueChange={(value) =>
                                        setToMonth(Number(value) as MonthNumber)
                                    }
                                >
                                    <SelectTrigger id="regional-compliance-pdf-to-month">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {validMonths.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={String(option.value)}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {validationError ? (
                        <p className="text-sm font-medium text-destructive">
                            {validationError}
                        </p>
                    ) : null}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        disabled={Boolean(validationError) || isPending || assemblyCount <= 0}
                        onClick={handleGenerate}
                    >
                        {isPending ? (
                            <>
                                <Spinner size="size-4" />
                                Preparing report...
                            </>
                        ) : (
                            <>
                                <DownloadIcon className="size-4" />
                                Generate PDF
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
