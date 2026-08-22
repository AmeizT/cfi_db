export function getJethroReply(message: string): string {
  const normalized = message.toLowerCase()

  if (normalized.includes("overdue") || normalized.includes("report")) {
    return "Looking at Orwetoveni's reports: April is in progress (Overhead still needs entries), and February has a skipped Attendance section that's never been given a reason. Everything else is either complete or not due yet."
  }

  if (normalized.includes("compliance")) {
    return "April's compliance is currently STABLE. The only flag is Overhead not started — once that's in, this should move to HEALTHY for the month."
  }

  if (normalized.includes("member")) {
    return "284 total members, with 3 new members added this month. I can break that down by month if that's useful — just ask."
  }

  return "I can help with that — this demo reply is keyword-matched. Replace getJethroReply with your API call when the Jethro backend is ready."
}
