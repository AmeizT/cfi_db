# Summary pages (Phase 1)

Routes: `/summary/regional` and `/summary/assembly`. Both accept `period=YYYY-MM`;
optional `region` and `assembly` IDs select authorized scopes. The sidebar reads
`can_view_executive_summary` / `can_view_assembly_summary` from CurrentUserSerializer.
Deploy the backend with the frontend so those capabilities and APIs are available.
Apply the zone identity and persisted-scope migrations described below with this release.

## Source trace and reuse

| Domain | Existing source / infrastructure | Summary use |
| --- | --- | --- |
| Financial totals | `AssemblyReport.calculate_totals`, report serializers; report/regional aggregate APIs | Compose stored report `tithe_total`, `income_total`, `expense_total`. Other revenue is income minus tithes. Expenses already include verified remittance cash payments. |
| Cumulative reports | `quarter_engine`, `periods.report_period`, `regional_dashboard/*`, `metrics/region_dashboard_service` | Reuse monthly report totals and period/percentage helpers. Older regional helpers cover an entire year, infer remittance payments as zero, and treat income differently, so they cannot supply this month-cutoff contract directly. |
| Attendance | `Attendance`, `SundaySchoolAttendance`, `attendance_totals.attendance_headcount` | Reuse schema-aware headcounts for Sunday general and homecell rows; Sunday school uses boys + girls, following the report calculation and collection start date. Total attendance is the stored report aggregate (all services). |
| Membership | `AssemblyReport.members_total`, `AssemblyMembership`, membership transfer services | Compare exact previous/current monthly report snapshots (including December/January). Membership events use joined/ended dates; transfers are not inferred from net growth or conversions. |
| Households / homecells | `Household`, `Homecell` register APIs | Explicitly current register totals; household creation timestamps supply monthly registrations. Historical register snapshots are unavailable. |
| Remittance | `RemittanceObligation`, `RemittancePayment` | Due from stored obligations; paid from verified payments through selected month end; outstanding clamped per obligation. Payments are aggregated separately to avoid duplicated due totals. |
| Contributors | `Tithe` / `FinancialBase` active manager; existing report contributor views | Batch group existing non-trashed payments by assembly/member/month. Thin drilldown supports arbitrary authorized assembly/month without exposing unscoped giving records. Anonymous payments aren't identifiable contributors. |
| Church planting | `Church.established_date`, `Zone.region` | Established in selected month (assembly) or Jan–selected month (regional), with plant names/dates. No inferred parent/sending-assembly relationship. |
| Targets | `Forecast` (formerly AssemblyMonthlyTarget) | Active monthly tithes/attendance targets; no total-members target field exists. `new_members` is not substituted for a total-members target. Zero targets remain zero; percentages with zero denominators are unavailable. |
| Ordinations | No dated ordination source found | Nullable, displayed as —. Current leader counts are not ordination events. |
| Assets | `Asset.acquisition_date` | Monthly acquired asset records. The free-text status field cannot establish dated disposal events or pending approvals; those remain nullable. |
| Access | `get_regional_staff_regions`, `RegionLeadership.Role`, `UserRoles`, existing global/assembly assignment relationships | Executive roles narrowed to superuser, regional admin and overseer; regional isolation applied before loading any data. Assembly summaries retain existing regional/global drilldown and assigned pastor/assembly relationships. |
| Export | `features/data-table/utils/pdf-export.ts` | Reuse the existing jsPDF table exporter with explicit period context, summary and assembly rows, and data notes. |

## API

- `GET /api/v1/reports/summaries/regional/?period=YYYY-MM[&region=ID]`
- `GET /api/v1/reports/summaries/assembly/?period=YYYY-MM[&assembly=ID]`
- `GET /api/v1/reports/summaries/contributors/?period=YYYY-MM&assembly=ID`

The read-only composition layer is `apps/reports/services/summaries/`. Regional
responses include zone groups, assembly rows, permitted region choices and
aggregate metrics. No report submission, recalculation or Inspector behavior is
changed. A comment marks the future Signals section insertion point.

Missing report snapshots and missing targets remain null. Available YTD totals
are accompanied by report coverage; gaps aren't zero-filled. Regional and zone roll-ups sum known observations; an all-missing metric stays
null and individual missing assembly values are retained. `coverage` records
available/total assembly counts per metric. Membership totals sum available
snapshots, while net growth and growth percentage use only assemblies with both
months (`comparable_assemblies`). Different currencies are returned separately in
`finance_by_currency`; unknown currencies remain separate per assembly. Scalars
remain available for a known single-currency scope. Target aggregates require complete coverage and one currency
for tithes. No prior-year percentage is shown without comparable source data.

## Validation

Backend: `DJANGO_ENV=LOCAL venv/bin/python manage.py test apps.reports.test_summaries apps.reports.test_regional_navigation_access --noinput`

Frontend: `node --import tsx --test src/features/summaries/summary.test.ts src/layouts/__tests__/regional-navigation.test.ts src/features/auth/services/get-user-core.test.ts`

Also run TypeScript and ESLint. The backend query-count test compares one versus
multiple assemblies to ensure the data path has no per-assembly query growth.

## Regional aggregation correction

Previously both views called `build_summary`, but `combine` used a strict
all-or-nothing `nullable_sum`: one assembly without a report erased every other
assembly's known value. Mixed-currency finances had no grouped alternative,
contributor counts weren't rolled up, and ordained counts were hardcoded null
in the reducer. Coverage text itself was never a filter.

Both APIs now use `build_assembly_summaries` for canonical monthly rows with YTD
values. `_period_metrics` is the sole period calculation, used for both monthly
and YTD windows. `build_summary` selects the YTD fields for regional display and
passes rows to the same pure reducer used by zone summaries. `monthly_summary`
also exposes selected-month regional totals. Domain queries remain batched.
Contributor totals sum identified assembly-month counts (a giver to two
assemblies counts once per assembly); they aren't unique people region-wide.
Financial cards, snapshots, zone headings and PDF exports consume currency
groups without changing the layout or styles. Access rules are unchanged.

## Zone / country selection and period presentation

Regional requests now accept `zone` and `country` (country code or the returned
legacy-name key). Choices are derived only from assemblies within the user's
permitted executive regions. Defaults prefer an assigned, permitted zone,
otherwise the first named permitted zone, then the first country in that zone.
Regional Admin and Overseer selections persist on the current user through the
shell Zone Switcher; Summary consumes that active zone. Other permitted users
retain URL-based zone selection. Switching the shell zone clears country scope
and selects the new zone's first country. `country=all` is explicit and remains separated
by actual stored currencies. Missing country metadata is labelled rather than
invented; matching legacy names reuse an available country code.

The YTD overview uses `summary` and general attendance; the named monthly
snapshot and targets use `monthly_summary`. Regional assembly rows retain their
existing YTD fields and now expose `monthly` for side-by-side display. Finance
and attendance cells show selected-month values first with smaller YTD values
below. Members and current homecells are never accumulated. Giving is monthly,
and top assembly contributors are ranked separately per currency. PDF exports
also retain both periods and the zone/country context. No existing metric
formulas, sidebar routes, or Assembly Summary calculations were changed.

## Regional shell and zone identity

The backend `churches.services.regional_scope` owns regional-shell eligibility,
permitted zones and active-zone resolution. Superusers retain the full shell.
Regional pages, performance responses and administration lists use the active
zone; stale or revoked saved selections fall back to a permitted zone.

`CurrentUserSerializer` exposes `uses_regional_shell`, `regional_zones` and
`active_regional_zone`; PATCH `regional_zone` persists a validated selection.
The switcher invalidates data queries and reuses assembly avatar/color helpers.
Assembly users retain their Assembly Switcher and theme.

### Diagnosing an assembly sidebar on a regional account

Inspect the response from `/api/v1/auth/users/me/`, which `useUser` parses with
`UserSchema`. Regional role keys are `regional_admin` and `overseer` in active
`RegionLeadership` assignments; `Pastor` and `Overseer` in the separate user-role
table do not themselves establish a regional assignment. `is_region_staff`
also includes other regional roles, so it is not the executive-shell selector.

`regional_scope.uses_regional_shell` explicitly excludes `is_superuser` before
checking those assignments. `usesRegionalShell` in the frontend preserves that
exemption. Both `ContextSidebar` (switcher) and `getWorkspaceNavigationSections`
(menu) consume this helper. A superuser with a `regional_admin` assignment is
therefore expected to see the full shell and Assembly Switcher. Verify the
regional experience using a non-superuser regional account; do not remove the
exemption or change account permissions to force the regional menu.

`test_current_user_endpoint_shell_contract_for_each_role` covers the actual
Djoser GET/PATCH endpoint for both executive roles, a regional-assigned
superuser, and an assembly pastor. Frontend scope tests also verify the menu
after permission filtering for these role fixtures.

Apply `churches.0053_zone_avatar` and `users.0032_user_regional_zone`. The first
adds the Church-equivalent image/fallback fields and fills only empty fallback
values using the existing color generator. Images use the existing storage
backend under `zones/profile/`. The scoped zone identity endpoint is
`/api/v1/churches/zones/<id>/identity/` and supports image uploads.

Both Summary pages inherit app typography. Mobile controls stack, cards reduce
columns, and detailed tables scroll inside their containers. Automated checks
cover role navigation, scope persistence/isolation, image uploads and backfill,
plus existing Summary regressions. Browser verification at 320, 375, 390, 430px
and tablet widths remains outstanding because the browser connection was unavailable.
