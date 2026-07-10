# CFI Workspace — Codex Implementation Prompts

This document converts the current backlog into implementation-ready prompts for Codex. Each prompt is deliberately scoped to the existing frontend and backend contracts: inspect the repository first, reuse established patterns, and do not invent API fields or endpoints.

## Recommended order

1. Refactor the shared `DataTable` API first.
2. Build the Compliance Issues page.
3. Build Members.
4. Build Assets.
5. Build Home Cells.

---

# Task review and implementation notes

## 1. DataTable component updates

**Assessment:** This is a good refactor. A single options object scales much better than accumulating boolean props such as `enablePinning`, `selectable`, `enableExport`, and `enableColumnVisibility` on the component signature.

**Recommendation:** Use a local variable named `tableOptions`, but name the prop `options`:

```tsx
const tableOptions = {
  enablePinning: true,
  selectable: true,
}

<DataTable options={tableOptions} />
```

`options` avoids the repetitive `tableOptions={tableOptions}` while remaining clear at call sites. Keep the options flat for the current small feature set. Group related options later only when the object grows materially, for example `selection: { enabled: true }`.

**Important details:**

- Use booleans, not strings: `enablePinning: true`, never `enablePinning="true"`.
- Define a central, exported `DataTableOptions` type and safe defaults so every table behaves predictably.
- Migrate every existing usage before removing legacy props; otherwise the project will temporarily contain two competing APIs.
- “Selectable” should control both row checkboxes and the selection toolbar, not merely show a checkbox column.

## 2. Issues

**Assessment:** The page has a strong reporting purpose and belongs under Compliance. The table, filters, KPI cards, and charts should all be driven by the same filtered dataset where practical.

**Important ambiguity to resolve in implementation:** “Issues Queued” needs a backend-defined meaning. It should map to an existing status such as `queued`, `pending_action`, or `open`; do not infer it from `resolved === false` unless that is the documented backend rule. The UI label can remain **Queued**, but its count must use the actual server status semantics.

**Recommendation:** Keep filters URL-synchronised so links are shareable and browser navigation works. Apply `assembly`, `country`, `section`, and `issue_type` through the backend query parameters when the endpoint supports them. Do not silently filter a paginated response only on the client and present it as the entire dataset.

**Important details:**

- Reuse the established Compliance tab configuration and API route conventions.
- Use a typed Zod schema matching the actual backend issue-list response.
- Preserve existing role/scoping rules. Regional users must not accidentally see data outside their permitted region/country scope.
- Render a friendly empty state for a filtered result with no issues.
- “Issue Action” should display the action/status supplied by the API. Do not add mutations unless an action endpoint and permissions already exist.

## 3. Members

**Assessment:** A table/cards toggle is particularly valuable for people data: tables are efficient for operations and filters, while cards are better for visual identification and mobile use.

**Recommendation:** Call the second People tab **Families & Children** rather than “Children or Family.” It is clearer, accommodates the relationship between the two, and leaves room for family-grouping functionality. The Members view itself should be completed end-to-end first.

**Important details:**

- Generate the member schema from the existing backend contract; do not guess at fields such as date of birth, roles, avatar, or family ID.
- Store `view=table|cards` and server-supported filters in the URL.
- For age range, calculate/display age from a date of birth only when the API provides it. Do not store a stale derived age in the schema.
- Use server-side filtering for gender, age range, roles, assembly, and search where supported. If the endpoint is paginated and lacks a filter, do not apply it only to the current page while implying a global result.
- The cards and table must consume the same query data, formatting utilities, permissions, loading state, and empty state.

## 4. Assets

**Assessment:** This is a natural Finance resource. Because one resource does not technically require tabs, add an **Assets** tab only if Finance already uses a tabbed information architecture or will imminently contain multiple finance resources. Consistency matters more than tabs for their own sake.

**Important details:**

- Build the schema from the real asset-list API response.
- Reuse the project’s country/assembly currency resolution rather than formatting every asset with a hard-coded currency.
- Show only values the API provides: for example asset name, category, assigned assembly, acquisition date, condition/status, value, and notes. Do not invent accounting calculations such as depreciation.
- A card view should prioritise the asset image (when present), name, category, value, condition, and assigned location/assembly.

## 5. Spaces / Home Cells

**Assessment:** This follows the same reusable resource pattern as Members and Assets. Standardise the user-facing label as **Home Cells** and keep the internal API/model term (`homecell` or `home_cell`) aligned with the backend rather than renaming it casually.

**Important details:**

- Add a **Home Cells** tab under Spaces when the Spaces area uses tabs.
- Use the actual fields returned by the backend, likely name/code, leader, assembly, meeting information, location, and membership/attendance summaries where available.
- Do not build a map, geocoding, or location visualisation unless coordinates and an approved mapping integration already exist.
- The table and cards need the same data source, scope controls, loading state, errors, and empty state.

---

# Shared implementation guardrails for every prompt

Use these rules in each Codex task:

- Inspect the existing repository before changing code. Reuse existing components, API route helpers, query-key conventions, Zod patterns, tab registries, filter components, chart wrappers, loading skeletons, and empty/error states.
- Do not invent endpoint paths, request parameters, response fields, enum values, currencies, permissions, or mutations. Use the generated API types/openapi artifacts/backend serializers already present in the repository as the source of truth.
- Keep all list views URL-driven where the project already uses query parameters. Preserve unrelated search parameters when changing a filter or table/card view.
- Ensure scoped users only see data authorised by the backend and existing frontend scope controls. Do not expose unscoped data through client-side queries.
- Use `text-foreground` for primary text and `text-muted-foreground` for secondary text, following the project’s neutral dark-mode palette. Do not introduce new arbitrary text colours.
- Keep TypeScript strict. Do not add `any`, suppress errors, or weaken schemas just to make a screen compile.
- Prefer existing component primitives and responsive layouts. Tables need horizontal overflow handling; cards need accessible labels, keyboard-accessible actions, and sensible empty/loading states.
- Run the project’s available typecheck, lint, and relevant test/build commands. Report exactly which files changed, which commands passed, and any contract gaps that blocked a feature.

---

# Codex Prompt 1 — Refactor DataTable to an options object

```md
## Goal
Refactor the shared `DataTable` component so table capabilities are configured through one typed `options` object instead of separate boolean props.

## Required API
Use this calling style:

```tsx
const tableOptions = {
  enablePinning: true,
  selectable: true,
}

<DataTable options={tableOptions} />
```

Use `options` as the component prop name. `tableOptions` is the recommended local variable name at call sites.

## Implementation requirements

1. Inspect the existing `DataTable` component, its prop type, all consumer components, and the table toolbar/selection/pinning implementations before editing.
2. Add and export a central `DataTableOptions` interface/type beside the shared table types. Start with:

```ts
export type DataTableOptions = {
  enablePinning?: boolean
  selectable?: boolean
}
```

Add only options that are already supported by the current table. Do not add speculative flags.
3. Define safe defaults in one place, for example:

```ts
export const DEFAULT_DATA_TABLE_OPTIONS: Required<DataTableOptions> = {
  enablePinning: false,
  selectable: false,
}
```

Resolve the final options immutably inside `DataTable` by merging defaults with the supplied object. Do not mutate the caller’s object.
4. Replace the existing separate pinning/selection props with `options?: DataTableOptions`.
5. Make `options.selectable` control the complete selection experience: selectable-row checkbox column, header select-all behaviour, selected-ID state, and bulk-selection toolbar. Existing non-selectable tables must not render dead checkbox UI.
6. Make `options.enablePinning` control every pinning-related affordance and configuration already supported by the component. Existing tables without this option must retain their current non-pinning behaviour.
7. Migrate every `DataTable` call site in the repository to the new API. Use boolean values, never string attributes such as `enablePinning="true"`.
8. Remove legacy props only after all internal call sites have been migrated. Do not leave two public APIs that can conflict.
9. Preserve existing table features, TypeScript generics, server/client boundaries, URL state, responsive behaviour, and dark-mode styling.
10. Run the available typecheck, lint, and affected tests/build. Fix all errors introduced by this refactor.

## Acceptance criteria

- `DataTable` accepts `options={{ enablePinning: true, selectable: true }}` without type errors.
- A table with no `options` keeps the safe default behaviour.
- A selectable table can select rows, select all valid data rows, display the existing bulk toolbar, and exclude any non-data/section rows according to current table rules.
- A non-selectable table renders no selectable controls.
- A pinning-enabled table exposes the existing pinning behaviour; a default table does not.
- There are no remaining internal uses of the removed legacy capability props.
- Typecheck and lint pass.

## Deliverable
Provide a concise implementation summary listing files changed, the final `DataTableOptions` API, migrated call sites, and validation commands/results.
```

---

# Codex Prompt 2 — Compliance Issues list, KPIs, filters, and charts

```md
## Goal
Build a production-ready **Issues** tab under Compliance for listing and analysing report issues, with particular support for skipped-report issues. The backend already provides the issues list; integrate with the existing frontend API/query architecture rather than creating mock data.

## Discovery first

Before implementation, inspect:

- The existing Compliance tab registry/routes and page layout.
- The issue-list backend route, generated OpenAPI/API types, serializers, and currently supported query parameters.
- Existing `apiRoutes`, service functions, TanStack Query hooks, Zod schemas, DataTable column builders, table filters, KPI components, chart wrappers, and scope/currency logic.
- Existing status/enum semantics, especially how `queued`, `open`, `pending action`, and `resolved` are represented.

Do not guess endpoint names, fields, statuses, or filter parameter names.

## Required UI

### 1. Navigation and route

- Add an **Issues** tab under Compliance using the established tab configuration pattern.
- Preserve current region/zone/country scope parameters and unrelated query parameters.
- Follow the project’s existing route convention; do not introduce a competing URL shape.

### 2. Data contract and fetching

- Create a strict Zod schema for the real issue-list response and issue item shape.
- Add the required API route constant only when it does not already exist.
- Create a service function and TanStack Query hook following the project’s standard query-key and error handling patterns.
- Keep pagination, ordering, filters, and scope parameters aligned with backend capabilities.
- Do not use `any`, placeholder records, or fabricated mappings.

### 3. KPI cards

Show four KPI cards based on the same active filters/scope where backend aggregates or the complete filtered dataset make this accurate:

1. **Assemblies** — number of distinct affected assemblies, or the backend aggregate if provided.
2. **Issues Raised** — total issues matching the active filters.
3. **Issues Queued** — use the backend’s documented queued/pending-action status only. Do not equate all unresolved issues with queued unless the contract explicitly defines that behaviour.
4. **Issues Resolved** — count resolved issues using the documented status/boolean.

Use existing KPI components, loading states, and formatting. Clearly distinguish unavailable data from zero.

### 4. Issues data table

Create a typed DataTable that includes these columns when supplied by the API:

- Assembly
- Country
- Issue root/section (for example attendance, tithes, revenue, expenditures)
- Issue type
- Reason/description
- Issue raised by
- Issue raised at
- Issue action or required action
- Issue resolved (clear Yes/No/status presentation)

Also include the normal project-standard row actions/details affordance only when an existing permission-safe pattern supports it. Avoid writing issue-resolution mutations unless an approved backend mutation endpoint exists.

Use suitable sorting, truncation with an accessible full-description tooltip/details view, responsive behaviour, loading skeletons, error handling, and an empty state that respects the active filters.

### 5. Top-level filters

Add URL-synchronised filters for:

- Assembly
- Country
- Section
- Issue type

Use backend filtering when the endpoint supports it. Do not apply a client-only filter to a single paginated response and imply that it represents all issues. Filter changes should reset pagination where the existing list pattern does so, preserve unrelated query parameters, and obey the logged-in user’s scope.

### 6. Charts

Build three accessible, responsive charts with the project’s existing chart library/components:

1. Issues raised per month.
2. Assemblies ranked by total issues raised.
3. Sections ranked/grouped by total issues raised.

Requirements:

- Use backend aggregate/chart endpoints when available. Otherwise derive results only from a complete, unpaginated filtered dataset that is safe and efficient to load.
- Never derive organisation-wide charts from only the visible page of a paginated table.
- Sort time data chronologically and use readable month labels.
- Sort assembly and section totals descending; apply an existing/top-N convention or sensible truncation if the chart would become unreadable.
- Provide accessible labels/tooltips and a meaningful no-data state.
- Ensure chart data honours the active scope and filters.

## Quality constraints

- Follow the shared project guardrails in `.codex/task.md` and existing code conventions.
- Use `text-foreground` and `text-muted-foreground` consistently, including dark mode.
- Keep all TypeScript/Zod types strict.
- Do not alter backend data contracts unless a separate backend task is required.

## Acceptance criteria

- Compliance contains a working Issues tab.
- The page fetches real backend issue data through an API route/service/query hook and strict schema.
- KPI values, table, filters, and charts respect the same user scope and active filters.
- The issues table presents all requested fields that exist in the backend response.
- URL filters survive refresh/navigation and do not discard unrelated search parameters.
- No chart represents only one page of results as a global aggregate.
- Empty/loading/error states and dark mode are handled cleanly.
- Typecheck, lint, and relevant tests/build pass.

## Deliverable
Summarise the discovered endpoint/field/status contract, files changed, how queued/resolved counts were mapped, chart data source strategy, and validation results. Explicitly identify any missing backend aggregate/filter capability instead of guessing.
```

---

# Codex Prompt 3 — Members schema, People tabs, list view, and card view

```md
## Goal
Implement the Members area under People using real backend data, a strict schema, a TanStack Query hook, a typed DataTable, and a responsive table/cards view switcher. Add People tabs for **Members** and **Families & Children**.

## Discovery first

Inspect the existing:

- People routes, tab registry, page layouts, and permission/scope rules.
- Backend members endpoint, generated API types, supported filters, pagination, and serializers.
- Existing Zod schemas, API routes, service/query-hook conventions, DataTable column builders, view-switcher components, card grids, avatar utilities, and URL-query helpers.
- Any existing children/family endpoint or page.

Do not guess data fields, endpoint paths, role identifiers, or query parameter names.

## Required implementation

### 1. Tabs and routing

- Add **Members** and **Families & Children** to the People tab configuration using established page/tab conventions.
- Build the Members page end-to-end.
- For Families & Children, reuse an existing page/API if one exists. If the required backend resource does not yet exist, create the route/tab shell with an honest, polished empty state explaining that data is not yet available; do not invent records or endpoints.

### 2. Strict member data contract

- Create/export a `MemberSchema` and any paginated/list response schema based exactly on the current backend response.
- Use inferred types from the schema where that matches project conventions.
- Include optional/nullability handling for real fields such as avatar, contact data, date of birth, role(s), assembly, family links, and status only when the contract exposes them.
- Do not store an age field unless the backend explicitly returns one. Derive display age from a date of birth only at render time and only when appropriate.

### 3. API integration

- Add/update the members API route constant as needed.
- Create a service function and a dedicated TanStack Query hook with a stable, scoped query key.
- Carry relevant URL parameters through the service according to backend support: pagination, search, ordering, gender, role, age range, assembly/country scope, and any existing status filters.
- Preserve user scope. Do not allow client choices to bypass backend authorisation.

### 4. Members table

Create typed table columns from actual API fields. Prefer a practical operational set such as identity/avatar, member name, gender, age or date of birth, role(s), assembly, contact/status, and actions, but only render columns supported by the response.

Use the shared `DataTable` API and existing table conventions for sorting, column visibility, pagination, row actions, loading, errors, and empty state.

### 5. Table/cards view switcher

- Add a visible, accessible control to switch between `table` and `cards`.
- Persist the choice in the URL as `view=table` or `view=cards`; default to the project’s preferred view without overwriting other query parameters.
- Use one query result, one formatting layer, and one filter state for both presentations. Changing view must not refetch different data or reset filters unnecessarily.
- The card view should be responsive and use actual available data. Prioritise avatar/fallback, name, role(s), assembly, gender/age where allowed, and a clear link/action to view details when that existing route exists.
- Make cards keyboard accessible and maintain adequate contrast in light and dark mode.

### 6. Filters

Add filter controls only for backend-supported filters, prioritising:

- Gender
- Age range
- Role(s)
- Assembly/country within the user’s permitted scope
- Search, if supported

Synchronise filters to the URL. When a list endpoint is paginated, do not apply an apparent global filter only to the current page. Reset pagination according to current list conventions when changing a filter.

## Acceptance criteria

- People has Members and Families & Children tabs.
- Members loads real data through a strict schema, route/service, and query hook.
- The same filtered dataset can be viewed as a typed table or responsive cards, with `view` preserved in the URL.
- Supported gender, age range, role, and scope filters are URL-driven and accurate.
- No unsupported API fields or filter parameters are fabricated.
- Loading, empty, error, responsive, accessibility, and dark-mode states are complete.
- Typecheck, lint, and relevant tests/build pass.

## Deliverable
Report the discovered member contract, routes/files changed, implemented filters, whether Families & Children was connected to a real endpoint or given a pending-data empty state, and validation results.
```

---

# Codex Prompt 4 — Assets schema, Finance view, table/cards toggle

```md
## Goal
Implement the Assets resource under Finance using real backend data, a strict schema, a TanStack Query hook, a typed DataTable, and a table/cards view switcher.

## Discovery first

Inspect the current Finance page architecture before making changes:

- Existing Finance routes, tabs, access controls, and scope/currency logic.
- The backend assets list endpoint, generated types/serializers, pagination, filters, and permissions.
- Existing schema, API route/service/query-hook, DataTable, card-grid, image, money-formatting, and URL-query patterns.

Do not invent endpoint paths, fields, currencies, asset categories, condition enums, accounting values, or filters.

## Required implementation

### 1. Navigation

- Add an **Assets** tab under Finance if Finance already follows a tabbed resource pattern. If Finance currently has one resource with no tab architecture, integrate Assets in the established navigation/page structure instead of adding a redundant one-item tab system.
- Preserve current scope/search parameters and follow existing route conventions.

### 2. Strict schema and fetching

- Create/export `AssetSchema` and the real list/pagination response schema from the backend contract.
- Add/update API route constants only where required.
- Add a service function and TanStack Query hook using stable query keys and existing error handling.
- Carry only supported scope, search, pagination, ordering, and filter parameters.

### 3. Assets table

Create typed columns using fields actually supplied by the API. Typical candidates, only where available, are:

- Asset image/identifier
- Name
- Asset category/type
- Assigned assembly, location, or department
- Acquisition date
- Condition/status
- Value
- Notes
- Existing permission-safe row actions/details affordance

Format financial values with the project’s existing currency resolver. For regional/country-scoped views, follow the existing rule that determines the correct country or assembly currency. Never hard-code a currency.

Use existing table loading, error, empty, sorting, responsive, and dark-mode patterns.

### 4. Table/cards view switcher

- Add an accessible view toggle and persist it as `view=table|cards` in the URL.
- Use the same query data, filters, permissions, loading, error, and empty state for both views.
- In cards, prioritise an actual asset image when present, otherwise an accessible fallback; show name, category, value, condition/status, and assignment/location where available.
- Do not implement depreciation, appreciation, book-value calculations, or mutations unless a documented endpoint already supports them.

### 5. Filtering

Add filters only if the endpoint supports them. Prioritise available asset category/type, condition/status, assigned assembly/country scope, and search. Keep filters URL-synchronised and accurate across pagination.

## Acceptance criteria

- Finance exposes an Assets view in the project’s established navigation architecture.
- Assets fetches real backend data through a strict schema, service, and query hook.
- The typed table uses the correct dynamic currency formatting.
- Table and card views use the same active data/filter state and persist the view in the URL.
- No accounting fields, enum values, API parameters, or calculations are fabricated.
- The page handles loading, empty, error, responsive, accessibility, and dark-mode states.
- Typecheck, lint, and relevant tests/build pass.

## Deliverable
Report the discovered asset endpoint and response fields, currency-formatting path used, files changed, available filters implemented, and validation results.
```

---

# Codex Prompt 5 — Home Cells schema, Spaces view, table/cards toggle

```md
## Goal
Implement **Home Cells** under Spaces using real backend data, a strict schema, a TanStack Query hook, a typed DataTable, and a responsive table/cards view switcher.

Use **Home Cells** as the user-facing label. Keep the internal model/API term (`homecell`, `home_cell`, or another existing convention) consistent with the backend and repository.

## Discovery first

Inspect:

- Existing Spaces navigation, page layout, tab registry, scope controls, and permissions.
- The home-cell backend endpoint, generated API types/serializers, pagination, supported query parameters, and enums.
- Existing schema, API route/service/query-hook, table, cards, avatar/person summaries, URL-query helpers, loading/error/empty states, and theme patterns.

Do not guess API names, endpoint paths, leader fields, meeting schedules, locations, membership counts, or filters.

## Required implementation

### 1. Navigation and route

- Add a **Home Cells** tab under Spaces when the current Spaces area uses tabs; otherwise integrate the resource in the established Spaces navigation pattern.
- Preserve scope and unrelated query parameters and follow current routing conventions.

### 2. Strict schema and fetching

- Create/export a strict item schema and list/pagination schema based exactly on the actual backend home-cell response.
- Add/update the API route constant, service function, and TanStack Query hook using existing project conventions.
- Use a stable, scoped query key and pass only backend-supported pagination, ordering, search, and filter parameters.

### 3. Home Cells table

Create typed columns from real API fields. Depending on the contract, these may include:

- Home Cell name and code
- Leader(s)
- Parent assembly
- Country/region scope where supplied
- Meeting day/time/frequency
- Location or locality
- Member/attendance summaries
- Status
- Existing permission-safe details/actions

Only show columns backed by actual API fields. Use sensible responsive priorities, consistent date/time formatting, and existing table patterns.

### 4. Table/cards view switcher

- Add an accessible `table` / `cards` view toggle persisted as `view=table|cards` in the URL.
- Share one query source, one scope/filter state, and one set of loading/error/empty states between the two views.
- Make each card useful for a coordinator: show name/code, leader, parent assembly, meeting details, locality, and key membership/attendance summary only when the API provides them.
- Use existing avatar/image/fallback components; do not fabricate imagery.
- Do not add maps, geocoding, coordinates, or routing integrations unless they already exist and the API provides valid coordinate data.

### 5. Filters

Add only server-supported filters, prioritising parent assembly/country scope, leader, status, meeting day, and search where available. Synchronise them with the URL and do not misrepresent client filtering of one paginated page as a global result.

## Acceptance criteria

- Spaces exposes Home Cells according to existing navigation architecture.
- The list uses real backend data through a strict schema, API service, and query hook.
- The typed table and card grid present the same filtered data and persist the selected view in the URL.
- Only real fields and supported filters are shown.
- Scope/permissions, loading, empty, error, responsive, accessibility, and dark-mode states are complete.
- Typecheck, lint, and relevant tests/build pass.

## Deliverable
Report the discovered endpoint and contract, internal naming used, navigation changes, implemented fields/filters, files changed, and validation results.
```

---

# Suggested implementation sequence

Run Prompt 1 first. Once the shared `DataTable` API is merged, run Prompts 2–5 one at a time. That keeps each resource implementation focused, makes review easier, and avoids creating multiple incompatible table integrations in parallel.
