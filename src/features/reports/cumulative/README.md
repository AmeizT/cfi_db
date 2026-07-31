# Cumulative report backend contract

The shared cumulative view uses `GET /api/v1/reports/summary/{module}/` with a
`period` query parameter. Attendance additionally sends either `service_type`
or `is_special_event` so changing `?service=` refreshes the matching dataset.

The API must apply these filters before calculating KPI values, monthly chart
rows, and the table schema. In particular, `service_type=Sunday School` must
aggregate the Sunday School attendance source (which currently has its own
CRUD and aggregates endpoints). If the summary endpoint does not yet join that
source, the Sunday School cumulative dataset requires that backend extension.

Special Services already uses the attendance model's extensible
`is_special_event` and `special_event_name` fields. No individual event type,
including All Night, is hardcoded into the report route or sidebar.
