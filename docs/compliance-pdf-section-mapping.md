# Compliance PDF section resolution

The PDF previously used `build_assembly_compliance_row()`'s stored section statuses. The report editor instead uses `lifecycle.get_report_sections()`: it combines those records with source data through `get_section_source()` and `get_effective_section_status()`. Source entries do not necessarily change stored `not_started` statuses. That explains green sections in the editor but red badges and zero completion in the PDF.

The PDF now resolves selected assembly-months through that same lifecycle service. It does not mutate status records, infer section state from `AssemblyReport.status`, or query source rows outside the report's assembly and date range. Authorization and scope filtering run before source resolution.

`services/pdf_section_states.py` owns the presentation groups and the shared badge/completion resolver:

| Badge | Canonical section | Source used by lifecycle |
| --- | --- | --- |
| AT | `general_attendance` | `Attendance`, timestamp within report period, excluding deleted rows |
| SAT | `sunday_school_attendance` | `SundaySchoolAttendance`, service date within period, excluding deleted rows; draft records remain in progress |
| TI | `tithes` | `Tithe` rows within period |
| IN | `revenue` | `Revenue` rows within period |
| EX | `operating_expenses` + `activity_other_expenses` | `Overhead` + `Expenditure` rows within period |
| RM | None | Not tracked by `ReportSectionStatus`; grey N/A, excluded from completion |

`completed` and confirmed `no_activity` are green. `in_progress` is amber. `not_started` is missing/red. `not_required` is grey and excluded from the denominator. `skipped` retains its own treatment and reason; it does not count as completed. These are effective lifecycle statuses, not aliases or display abbreviations.

Completion = completed canonical required sections / canonical required sections. There are six canonical sections when all are required, including two expense sections behind EX. Three complete sections therefore give 50%. Both expense sections must be complete for EX to be green; a mixed complete/missing pair is amber, and a skip remains visible. Before Sunday School reporting is required, its effective `not_required` state is excluded. Workflow readiness may count a skip as resolved; this PDF's completion measures completed/present sections, not readiness.

The cover and monthly summaries receive the same corrected completion values as the rows. The renderer and report-level status rules were not redesigned.

Remittance does have financial models: `RemittanceObligation` and `RemittancePayment` (`pending`, `verified`, `rejected`), plus legacy fields on `FixedExpenditure`. Verified payments contribute to financial totals. None is a canonical report section in the lifecycle or compliance calculator, so payment verification is not silently translated into a new required compliance section. RM remains N/A under the existing scope.

Validation: all 27 PDF and report-lifecycle tests passed, including real tithe source records with stale stored statuses, three completed canonical sections yielding 50%, draft Sunday School, skips, non-required sections, and pagination. The regenerated synthetic sample was rendered and visually checked on all three pages.
