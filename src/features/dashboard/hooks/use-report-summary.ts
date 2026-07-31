"use client"

import { MonthlyReport } from "@/dal/types"
import { format } from "date-fns"

export function useReportSummary(report?: MonthlyReport) {
  if (!report) return null

  const month = report.period_start
    ? format(new Date(report.period_start), "MMMM")
    : ""

  const title = `${month} report`

  // 📊 Compliance
  const compliance = report.compliance
  const pending = compliance?.pending ?? 0
  const progress = compliance?.progress ?? 0

  // 📈 Finance
  const finance = report.metrics?.finance
  const balance = finance?.balance ?? 0

  // 👥 Growth / Attendance
  const attendance = report.attendance_total ?? 0
  const members = report.members_total ?? 0

  // 🧩 Ministry
  const ministry = report.metrics?.ministry

  // -----------------------------
  // 🧠 MESSAGES ARRAY (headline + insights)
  // -----------------------------
  const messages: string[] = []

  // 🟣 Headline (always first)
  let headline = `Your ${title}`

  if (progress === 100) {
    headline += " is complete"
  } else if (progress > 0) {
    headline += ` is ${progress}% complete`
  } else {
    headline += " is in progress"
  }

  if (pending > 0) {
    headline += ` — ${pending} section${pending > 1 ? "s" : ""} pending`
  }

  messages.push(headline)

  // 💰 Finance insight
  if (balance < 0) {
    messages.push(
      `You are running at a deficit of ${report.assembly.currency} ${Math.abs(balance).toLocaleString()}`
    )
  } else if (balance > 0) {
    messages.push(
      `You have a surplus of ${report.assembly.currency} ${balance.toLocaleString()}`
    )
  }

  // 👥 Attendance insight
  if (attendance === 0) {
    messages.push("No attendance has been recorded yet")
  }

  // 🌱 Growth insight
  if (members === 0) {
    messages.push("No member data has been submitted")
  }

  // ⛪ Ministry insight
  if (ministry?.outreaches === 0) {
    messages.push("No outreach activity reported")
  }

  if (ministry?.homecells_planted === 0) {
    messages.push("No homecells have been planted")
  }

  return {
    title,
    messages, // ✅ single unified array
  }
}