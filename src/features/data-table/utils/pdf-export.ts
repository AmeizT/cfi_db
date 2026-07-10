import { jsPDF } from "jspdf"

export type PdfReportMetadata = {
    title?: string
    region?: string
    zone?: string
    country?: string
    generatedBy?: string
    generatedAt?: Date
    filters?: Record<string, string>
    [key: string]: unknown
}

export type PdfTableColumn = {
    id: string
    label: string
}

export type PdfTableRow = Record<string, unknown>

type ExportTablePdfInput = {
    filename: string
    title?: string
    metadata?: PdfReportMetadata
    columns: PdfTableColumn[]
    rows: PdfTableRow[]
}

type PdfOrientation = "p" | "l"

const PAGE_MARGIN = 12
const HEADER_HEIGHT = 34
const FOOTER_HEIGHT = 12
const ROW_PADDING = 2
const LINE_HEIGHT = 4.5

function formatLabel(value: string) {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function formatPdfValue(value: unknown): string {
    if (value == null) return ""
    if (value instanceof Date) return value.toLocaleString()
    if (typeof value === "number") return new Intl.NumberFormat().format(value)
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (Array.isArray(value)) return value.map(formatPdfValue).join(", ")
    if (typeof value === "object") return JSON.stringify(value)

    return String(value)
}

function metadataEntries(metadata?: PdfReportMetadata) {
    if (!metadata) return []

    const entries: Array<[string, string]> = []
    const preferredKeys = [
        "region",
        "zone",
        "country",
        "generatedBy",
        "generatedAt",
    ]

    for (const key of preferredKeys) {
        const value = metadata[key]
        if (value != null && value !== "") {
            entries.push([formatLabel(key), formatPdfValue(value)])
        }
    }

    if (metadata.filters) {
        const filterText = Object.entries(metadata.filters)
            .filter(([, value]) => value)
            .map(([key, value]) => `${formatLabel(key)}: ${value}`)
            .join("; ")

        if (filterText) {
            entries.push(["Filters", filterText])
        }
    }

    return entries
}

function addReportHeader(
    doc: jsPDF,
    title: string,
    metadata?: PdfReportMetadata
) {
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFillColor(248, 250, 252)
    doc.rect(0, 0, pageWidth, HEADER_HEIGHT, "F")

    doc.setFont("helvetica", "bold")
    doc.setFontSize(15)
    doc.setTextColor(15, 23, 42)
    doc.text(title, PAGE_MARGIN, 12)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    doc.setTextColor(71, 85, 105)

    const entries = metadataEntries(metadata)
    const lines = entries.map(([key, value]) => `${key}: ${value}`)
    const wrapped = doc.splitTextToSize(lines.join("   |   "), pageWidth - PAGE_MARGIN * 2)
    doc.text(wrapped.slice(0, 3), PAGE_MARGIN, 19)

    doc.setDrawColor(226, 232, 240)
    doc.line(PAGE_MARGIN, HEADER_HEIGHT - 2, pageWidth - PAGE_MARGIN, HEADER_HEIGHT - 2)
}

function addPageFooters(doc: jsPDF, metadata?: PdfReportMetadata) {
    const pageCount = doc.getNumberOfPages()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const generatedAt = metadata?.generatedAt ?? new Date()

    for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page)
        doc.setDrawColor(226, 232, 240)
        doc.line(PAGE_MARGIN, pageHeight - FOOTER_HEIGHT, pageWidth - PAGE_MARGIN, pageHeight - FOOTER_HEIGHT)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.setTextColor(100, 116, 139)
        doc.text(`Generated ${generatedAt.toLocaleString()}`, PAGE_MARGIN, pageHeight - 5)
        doc.text(`Page ${page} of ${pageCount}`, pageWidth - PAGE_MARGIN, pageHeight - 5, {
            align: "right",
        })
    }
}

function addPage(doc: jsPDF, title: string, metadata?: PdfReportMetadata) {
    doc.addPage()
    addReportHeader(doc, title, metadata)

    return HEADER_HEIGHT + 4
}

function drawTableHeader(
    doc: jsPDF,
    columns: PdfTableColumn[],
    columnWidths: number[],
    y: number
) {
    const pageWidth = doc.internal.pageSize.getWidth()
    let x = PAGE_MARGIN

    doc.setFillColor(241, 245, 249)
    doc.rect(PAGE_MARGIN, y, pageWidth - PAGE_MARGIN * 2, 8, "F")
    doc.setDrawColor(226, 232, 240)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(51, 65, 85)

    columns.forEach((column, index) => {
        doc.text(column.label, x + ROW_PADDING, y + 5.2, {
            maxWidth: columnWidths[index] - ROW_PADDING * 2,
        })
        x += columnWidths[index]
    })

    return y + 8
}

export function exportTablePdf({
    filename,
    title = "Data Table Report",
    metadata,
    columns,
    rows,
}: ExportTablePdfInput) {
    const orientation: PdfOrientation = columns.length > 6 ? "l" : "p"
    const doc = new jsPDF({ orientation, unit: "mm", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const tableWidth = pageWidth - PAGE_MARGIN * 2
    const columnWidth = tableWidth / Math.max(columns.length, 1)
    const columnWidths = columns.map(() => columnWidth)
    const maxY = pageHeight - FOOTER_HEIGHT - 4

    addReportHeader(doc, title, metadata)

    let y = HEADER_HEIGHT + 4
    y = drawTableHeader(doc, columns, columnWidths, y)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.setTextColor(30, 41, 59)

    rows.forEach((row) => {
        const linesByColumn = columns.map((column, index) => {
            const text = formatPdfValue(row[column.id])
            return doc.splitTextToSize(text, columnWidths[index] - ROW_PADDING * 2)
        })
        const rowHeight = Math.max(
            8,
            ...linesByColumn.map((lines) => lines.length * LINE_HEIGHT + ROW_PADDING * 2)
        )

        if (y + rowHeight > maxY) {
            y = addPage(doc, title, metadata)
            y = drawTableHeader(doc, columns, columnWidths, y)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(7.5)
            doc.setTextColor(30, 41, 59)
        }

        let x = PAGE_MARGIN
        doc.setDrawColor(226, 232, 240)

        linesByColumn.forEach((lines, index) => {
            doc.rect(x, y, columnWidths[index], rowHeight)
            doc.text(lines, x + ROW_PADDING, y + 5, {
                maxWidth: columnWidths[index] - ROW_PADDING * 2,
            })
            x += columnWidths[index]
        })

        y += rowHeight
    })

    if (!rows.length) {
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.setTextColor(100, 116, 139)
        doc.text("No rows are currently displayed.", PAGE_MARGIN, y + 8)
    }

    addPageFooters(doc, metadata)
    doc.save(`${filename}.pdf`)
}
