# Financial Activity aggregation notes

The Statement, Revenue, and Expenses views use the same report-scoped revenue,
overhead, variable-expense, and cash-flow sources. Weekly totals therefore
reconcile to the monthly Income Statement when all weeks in that report are
summed. Week boundaries are Monday through Sunday.

The current report endpoint is scoped to a single monthly report. A backend
aggregation endpoint is still needed for comparisons that cross report/month
boundaries, server-side category distributions over very large datasets, and
combined offering/tithe/donation classifications when those values live in
separate models. The UI intentionally does not fabricate those unsupported
totals.
