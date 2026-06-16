export type FieldStatus = "submitted" | "missing";
export type ComplianceStatus = "compliant" | "partial" | "noncompliant";
export type ActivityType = "submitted" | "warning" | "missed";
export type UrgencyLevel = "urgent" | "soon" | "ok";

export interface ReportFields {
  attendance: FieldStatus;
  tithes: FieldStatus;
  income: FieldStatus;
  expenditure: FieldStatus;
}

export interface MonthlyReport {
  month: string;
  fields: ReportFields;
  completionPct: number;
  rating: number;
  status: ComplianceStatus;
  submittedOn: string;
}

export interface Assembly {
  id: string;
  initials: string;
  name: string;
  location: string;
  completionPct: number;
  status: ComplianceStatus;
  avatarColor: string;
  reports: MonthlyReport[];
}

export interface Deadline {
  assembly: string;
  description: string;
  urgency: UrgencyLevel;
  label: string;
}

export interface ActivityItem {
  type: ActivityType;
  text: string;
  time: string;
}

export interface KpiMetric {
  label: string;
  value: string;
  trend: string;
  trendDir: "up" | "down" | "neutral";
}

export const kpiMetrics: KpiMetric[] = [
  { label: "Total assemblies", value: "12", trend: "all regions", trendDir: "neutral" },
  { label: "Fully compliant", value: "3", trend: "↑ 1 vs last month", trendDir: "up" },
  { label: "Non-compliant", value: "6", trend: "↓ 2 vs last month", trendDir: "down" },
  { label: "Partial", value: "3", trend: "no change", trendDir: "neutral" },
  { label: "Avg completion", value: "61%", trend: "↑ 8% vs last month", trendDir: "up" },
  { label: "Reports due", value: "4", trend: "within 7 days", trendDir: "neutral" },
];

export const assemblies: Assembly[] = [
  {
    id: "nairobi-central",
    initials: "NA",
    name: "Nairobi Central",
    location: "Kenya",
    completionPct: 100,
    status: "compliant",
    avatarColor: "bg-green-100 text-green-800",
    reports: [
      { month: "January", fields: { attendance: "submitted", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 100, rating: 4, status: "compliant", submittedOn: "Jan 29, 2026" },
      { month: "February", fields: { attendance: "submitted", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 100, rating: 4, status: "compliant", submittedOn: "Feb 28, 2026" },
      { month: "March", fields: { attendance: "submitted", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 100, rating: 4, status: "compliant", submittedOn: "Mar 31, 2026" },
      { month: "April", fields: { attendance: "submitted", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 100, rating: 4, status: "compliant", submittedOn: "Apr 15, 2026" },
    ],
  },
  {
    id: "lagos-south",
    initials: "LG",
    name: "Lagos South",
    location: "Nigeria",
    completionPct: 100,
    status: "compliant",
    avatarColor: "bg-blue-100 text-blue-800",
    reports: [
      { month: "January", fields: { attendance: "submitted", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 100, rating: 4, status: "compliant", submittedOn: "Jan 31, 2026" },
      { month: "February", fields: { attendance: "submitted", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 100, rating: 4, status: "compliant", submittedOn: "Feb 28, 2026" },
      { month: "March", fields: { attendance: "submitted", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 100, rating: 4, status: "compliant", submittedOn: "Mar 31, 2026" },
      { month: "April", fields: { attendance: "submitted", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 100, rating: 4, status: "compliant", submittedOn: "Apr 16, 2026" },
    ],
  },
  {
    id: "accra-north",
    initials: "AC",
    name: "Accra North",
    location: "Ghana",
    completionPct: 75,
    status: "partial",
    avatarColor: "bg-amber-100 text-amber-800",
    reports: [
      { month: "January", fields: { attendance: "missing", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 75, rating: 3, status: "partial", submittedOn: "Jan 30, 2026" },
      { month: "February", fields: { attendance: "missing", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 75, rating: 3, status: "partial", submittedOn: "Feb 27, 2026" },
      { month: "March", fields: { attendance: "missing", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 75, rating: 3, status: "partial", submittedOn: "Mar 31, 2026" },
      { month: "April", fields: { attendance: "missing", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 75, rating: 3, status: "partial", submittedOn: "Apr 14, 2026" },
    ],
  },
  {
    id: "asmara",
    initials: "AS",
    name: "Asmara",
    location: "Eritrea",
    completionPct: 44,
    status: "noncompliant",
    avatarColor: "bg-red-100 text-red-800",
    reports: [
      { month: "January", fields: { attendance: "missing", tithes: "missing", income: "submitted", expenditure: "missing" }, completionPct: 25, rating: 1, status: "noncompliant", submittedOn: "Jan 29, 2026" },
      { month: "February", fields: { attendance: "missing", tithes: "missing", income: "submitted", expenditure: "submitted" }, completionPct: 50, rating: 1, status: "noncompliant", submittedOn: "Feb 28, 2026" },
      { month: "March", fields: { attendance: "missing", tithes: "submitted", income: "submitted", expenditure: "submitted" }, completionPct: 75, rating: 3, status: "noncompliant", submittedOn: "Mar 31, 2026" },
      { month: "April", fields: { attendance: "missing", tithes: "missing", income: "submitted", expenditure: "missing" }, completionPct: 25, rating: 1, status: "noncompliant", submittedOn: "Apr 25, 2026" },
    ],
  },
  {
    id: "kampala-west",
    initials: "KP",
    name: "Kampala West",
    location: "Uganda",
    completionPct: 25,
    status: "noncompliant",
    avatarColor: "bg-red-100 text-red-800",
    reports: [
      { month: "January", fields: { attendance: "missing", tithes: "missing", income: "missing", expenditure: "submitted" }, completionPct: 25, rating: 1, status: "noncompliant", submittedOn: "Jan 31, 2026" },
      { month: "February", fields: { attendance: "missing", tithes: "missing", income: "submitted", expenditure: "missing" }, completionPct: 25, rating: 1, status: "noncompliant", submittedOn: "Feb 28, 2026" },
      { month: "March", fields: { attendance: "missing", tithes: "missing", income: "missing", expenditure: "missing" }, completionPct: 0, rating: 1, status: "noncompliant", submittedOn: "—" },
      { month: "April", fields: { attendance: "missing", tithes: "missing", income: "missing", expenditure: "missing" }, completionPct: 0, rating: 1, status: "noncompliant", submittedOn: "—" },
    ],
  },
];

export const deadlines: Deadline[] = [
  { assembly: "Asmara", description: "May report due", urgency: "urgent", label: "3 days" },
  { assembly: "Kampala West", description: "April overdue", urgency: "urgent", label: "Overdue" },
  { assembly: "Dar es Salaam", description: "May report due", urgency: "soon", label: "6 days" },
  { assembly: "Harare East", description: "May report due", urgency: "ok", label: "12 days" },
];

export const activityFeed: ActivityItem[] = [
  { type: "submitted", text: "Lagos South submitted their April report — all 4 fields complete.", time: "Today, 9:14 AM" },
  { type: "warning", text: "Asmara submitted income only — attendance, tithes and expenditure still missing.", time: "Today, 8:02 AM" },
  { type: "missed", text: "Automated reminder sent to Kampala West (April overdue by 17 days).", time: "Yesterday, 10:30 AM" },
  { type: "submitted", text: "Nairobi Central submitted their April report — fully compliant.", time: "Apr 15, 2:45 PM" },
  { type: "warning", text: "Accra North missing attendance field for April — 3 other fields submitted.", time: "Apr 14, 11:20 AM" },
];

export const fieldBreakdown = [
  { label: "Income", pct: 91, color: "bg-green-600" },
  { label: "Expenditure", pct: 78, color: "bg-blue-500" },
  { label: "Tithes", pct: 54, color: "bg-amber-400" },
  { label: "Attendance", pct: 41, color: "bg-red-500" },
];

export const trendData = {
  labels: ["Jan", "Feb", "Mar", "Apr"],
  avgCompletion: [38, 51, 68, 61],
  fullyCompliant: [1, 1, 2, 3],
};

export const heatmapAssemblies = [
  { name: "Nairobi Central", fields: { attendance: "submitted", tithes: "submitted", income: "submitted", expenditure: "submitted" } },
  { name: "Lagos South", fields: { attendance: "submitted", tithes: "submitted", income: "submitted", expenditure: "submitted" } },
  { name: "Accra North", fields: { attendance: "missing", tithes: "submitted", income: "submitted", expenditure: "submitted" } },
  { name: "Asmara", fields: { attendance: "missing", tithes: "missing", income: "submitted", expenditure: "missing" } },
  { name: "Kampala West", fields: { attendance: "missing", tithes: "missing", income: "missing", expenditure: "missing" } },
] as const;
