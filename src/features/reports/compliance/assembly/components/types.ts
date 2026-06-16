export type FieldStatus = "submitted" | "missing";
export type ComplianceStatus = "compliant" | "partial" | "noncompliant";

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
  rating: number; // 1–4
  status: ComplianceStatus;
  submittedOn: string;
}

export interface AssemblyCompliance {
  name: string;
  period: string;
  reports: MonthlyReport[];
}
