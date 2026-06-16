"use client";

import React from "react"
import { NUMERIC_FIELDS } from "../constants"
import { makeEmpty } from "../data/seed"
import { getHeadcount } from "../utils"
import { AttendancePageHeader } from "../components/AttendancePageHeader"
import { SummaryChips } from "../components/SummaryChips"
import { AttendanceTableHeader } from "../components/AttendanceTableHeader"
import { AttendanceTableRow } from "../components/AttendanceTableRow"
import { AttendanceTableFooter } from "../components/AttendanceTableFooter"
import { AttendanceEmptyState } from "../components/AttendanceEmptyState"
import { AttendanceDrawer } from "../components/AttendanceDrawer"
import { Attendance } from "@/dal/types"

/**
 * AttendanceTable
 *
 * Drop into any page — carries no outer padding, margin, or max-width.
 * Requires the following keyframes in your globals.css:
 *
 *   @keyframes drawerIn {
 *     from { transform: translateX(40px); opacity: 0; }
 *     to   { transform: translateX(0);    opacity: 1; }
 *   }
 */

interface Props {
  attendance: Attendance[]
}

export function AttendanceTableView({ attendance }: Props) {
  const [rows, setRows] = React.useState<Attendance[]>(attendance);
  const [drawer, setDrawer] = React.useState<Attendance | null>(null);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  const updateCell = (id: number, key: keyof Attendance, value: number) =>
    setRows((r) => r?.map((row) => (row?.id === id ? { ...row, [key]: value } : row)));

  const saveDrawer = (updated: Attendance) =>
    setRows((r) => r?.map((row) => (row?.id === updated.id ? updated : row)));

  const deleteRow = (id: number) => {
    setRows((r) => r?.filter((row) => row?.id !== id));
    setSelected((s) => { const n = new Set(s); n.delete(id); return n; });
  };

  const addRow = () => {
    const r = makeEmpty() as Attendance
    setRows((p) => [r, ...p])
    setDrawer(r)
  }

  const toggleSelect = (id: number) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const allSelected = rows?.length > 0 && selected.size === rows?.length;

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(rows?.map((r) => r?.id)))

  const deleteSelected = () => {
    setRows((r) => r?.filter((row) => !selected?.has(row?.id)))
    setSelected(new Set())
  }

  const totals = React.useMemo(
    () =>
      NUMERIC_FIELDS.reduce(
        (acc, { key }) => ({ ...acc, [key]: rows?.reduce((s, r) => s + (r[key] as number || 0), 0) }),
        {} as Partial<Record<keyof Attendance, number>>,
      ),
    [rows],
  );

  const totalHeadcount = React.useMemo(
    () => rows?.reduce((s, r) => s + getHeadcount(r), 0),
    [rows],
  )

  return (
    <>
      <div className="flex flex-col gap-6">
        <AttendancePageHeader
          recordCount={rows?.length}
          totalHeadcount={totalHeadcount}
          selectedCount={selected.size}
          onDeleteSelected={deleteSelected}
          onAddRow={addRow}
        />

        {/* Summary chips */}
        <SummaryChips totals={totals} />

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-auto">
          <table className="w-full border-collapse table-fixed">
            <AttendanceTableHeader
              allSelected={allSelected}
              onToggleAll={toggleAll}
            />

            <tbody>
              {rows?.length === 0 ? (
                <AttendanceEmptyState onAddRow={addRow} />
              ) : (
                rows?.map((row) => (
                  <AttendanceTableRow
                    key={row?.id}
                    row={row}
                    isSelected={selected.has(row?.id)}
                    onToggleSelect={toggleSelect}
                    onUpdateCell={updateCell}
                    onOpenDrawer={setDrawer}
                  />
                ))
              )}
            </tbody>

            {rows?.length > 0 && (
              <AttendanceTableFooter
                totals={totals}
                totalHeadcount={totalHeadcount}
              />
            )}
          </table>
        </div>

        {/* Hint bar */}
        <p className="flex gap-5 font-mono text-[11px] text-muted-foreground/40">
          <span>↗ Hover row to open details</span>
          <span>· Click any number to edit</span>
          <span>· Enter to confirm</span>
        </p>
      </div>

      {drawer && (
        <AttendanceDrawer
          row={drawer}
          onClose={() => setDrawer(null)}
          onSave={saveDrawer}
          onDelete={deleteRow}
        />
      )}
    </>
  );
}
