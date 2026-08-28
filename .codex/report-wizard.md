# Codex Prompt — Final Central Create / Report Wizard UI Amendments Before Launch

Make the following final, tightly scoped UI amendments to the existing Central Create and Report Wizard implementation.

The current Central Create and Report Wizard functionality is already working and is close to launch. **Do not perform broad refactors, redesign the architecture, rewrite Report Wizard functionality, change backend models, alter API contracts, or modify unrelated areas.**

This task should only address the four items below:

1. Migrate the Templates UI to the existing `ReportTemplateCard` component.
2. Fix mobile Report Wizard vertical scrolling.
3. Restrict `Confirm no activity` to sections where that action is actually appropriate.
4. Update Report Wizard frontend terminology consistently.

Preserve all existing working behaviour including:

* report loading
* report IDs
* manual entry
* uploads
* Excel/image parsing
* report progress
* previous/next navigation
* skip logic
* Review & Submit
* report locking
* reopening/grace-period behaviour
* permissions
* Central Create routing
* YTD/year progress
* current-report progress panel
* template download infrastructure

Before making changes, inspect the current code paths involved in these features and reuse existing utilities/components rather than introducing duplicate implementations.

---

# 1. Templates — Use Existing `ReportTemplateCard`

A new component already exists at approximately:

```text
features/central-create/components/ReportTemplateCard
```

Inspect the actual component and its props before editing the Templates page.

Migrate the Central Create Templates page so that **all report template entries use this existing `ReportTemplateCard` component** rather than custom/duplicated template-card markup.

Do not create another card component.

The Templates page should use `ReportTemplateCard` consistently for templates such as:

* Attendance
* Sunday School
* Tithes
* General Income
* Operating Costs
* Other Expenses

Use the actual templates currently available in the repository. Do not display downloadable templates that do not exist.

The card should receive the correct existing data such as, where supported by its API:

* title
* description
* file type
* file name
* download URL
* icon
* metadata
* disabled/unavailable state

Do not modify the component's public API unnecessarily unless there is a genuine issue preventing correct reuse.

---

# 2. Verify Template Downloads Actually Work

Do not treat this as only a visual migration.

After moving Templates to `ReportTemplateCard`, verify that each Download action still delivers the actual file.

Inspect the existing template infrastructure, including where applicable:

* generated `.xlsx` endpoints
* public/static template assets
* template registry
* template download helpers
* API client functions
* browser download logic
* filename handling

The Download button/action inside `ReportTemplateCard` must correctly trigger the existing download mechanism.

Verify specifically that the recently added **Sunday School Excel template** is included and downloads correctly.

The intended flow must work:

```text
Central Create
→ Templates
→ Sunday School
→ Download
→ actual .xlsx file downloads
```

Do not create placeholder URLs or non-functional Download buttons.

If the card currently receives a download callback, URL, or file descriptor, wire it to the existing infrastructure rather than duplicating download code.

Where practical, verify the resulting filename and MIME/type behaviour as well.

---

# 3. Do Not Redesign the Templates Page

This is not a new Templates redesign.

Only:

* migrate the cards to `ReportTemplateCard`
* ensure spacing/layout remains polished
* ensure real downloads work
* preserve responsive behaviour

Do not introduce another visual system.

Use the current Central Create design system and existing layout.

---

# 4. Fix Report Wizard Mobile Vertical Scrolling

There is currently a regression on mobile devices where users cannot properly scroll up and down through Report Wizard content.

Fix this.

First inspect the layout hierarchy around:

* Central Create shell
* mobile Report Wizard
* main content wrapper
* header/topbar
* report form
* bottom actions
* sheets/drawers
* `overflow-hidden`
* `overflow-y-auto`
* fixed/sticky containers
* `h-screen`
* `min-h-0`
* viewport units
* flex/grid parents

This is likely a layout/overflow issue.

Do not solve it by removing useful desktop behaviour.

The expected mobile behaviour is:

* the active Report Wizard form can scroll vertically
* users can reach all fields
* users can scroll back to the top
* the bottom action bar remains usable
* the mobile Report Steps sheet still scrolls correctly
* the YTD/Year Progress sheet still scrolls correctly
* no content is trapped behind fixed elements
* no body-scroll lock remains active after closing a Sheet/Drawer
* no nested container prevents touch scrolling

Be especially careful with combinations such as:

```css
overflow-hidden
height: 100vh
h-screen
position: fixed
```

inside nested mobile layouts.

Use appropriate flex/grid sizing such as `min-h-0` and scoped `overflow-y-auto` where required.

Do not apply arbitrary global CSS hacks.

---

# 5. Preserve Desktop Scrolling Behaviour

The mobile scrolling fix must not regress the current desktop layout.

Desktop should continue to support:

```text
Left Create Navigation
|
Main Report Form
|
Persistent Current Report Panel
```

The current Report Panel should remain visible on desktop.

Long main forms must still scroll properly.

The sticky bottom Previous / Skip / Continue actions must remain usable.

Do not reintroduce the old desktop Report Steps sheet as the primary experience.

---

# 6. `Confirm no activity` Must Not Appear Everywhere

Review the current Report Wizard behaviour for `Confirm no activity`.

This action should only appear for report sections where recording **no activity is a valid semantic outcome**.

For example:

```text
Other Expenses
```

may legitimately have no entries for a reporting period.

In that case:

```text
Confirm no activity
```

is appropriate.

However, sections that are handled through the normal Report Wizard **Skip** flow should not automatically display `Confirm no activity`.

Do not treat:

```text
Skip this section
```

and:

```text
Confirm no activity
```

as interchangeable actions.

They mean different things.

---

# 7. Semantic Difference Between Skip and Confirm No Activity

Preserve this distinction:

### Skip this section

Means the Report Wizard allows the user to bypass the current section according to existing workflow rules.

This uses the existing skip behaviour/state.

### Confirm no activity

Means the user is explicitly confirming that there was **no applicable activity/data to report** for that section during the reporting period.

This should only be available for sections configured as optional/not-required/no-activity-capable.

Do not alter backend skip behaviour.

Do not make `Confirm no activity` invoke the generic skip action unless that is already the intended underlying business logic.

Inspect the existing implementation first.

---

# 8. Prefer Section Configuration Over Hardcoding

Where the Report Wizard already exposes metadata such as:

```text
required
optional
notRequired
canConfirmNoActivity
canSkip
```

or an equivalent configuration, use that source of truth.

Prefer something conceptually like:

```ts
section.canConfirmNoActivity
```

rather than repeated checks such as:

```ts
section.slug === "other-expenses"
```

If no appropriate metadata currently exists, use the smallest safe UI-level mapping necessary.

Do not introduce a large backend/schema migration for this final UI task.

The important behaviour is:

* sections that support `Confirm no activity` show it
* sections that do not support it do not show it
* existing Skip behaviour remains available where currently allowed

---

# 9. Update Report Wizard Frontend Terminology

Update the Report Wizard's **display terminology** as follows:

```text
Revenue
→ General Income

Operating Expenses
→ Operating Costs

Activity & Other Expenses
→ Other Expenses
```

These are the final user-facing labels.

The Report Wizard should now consistently present:

```text
Attendance
Sunday School
Tithes
General Income
Operating Costs
Other Expenses
Review & Submit
```

Use the actual ordering already configured by the current Report Wizard. Do not reorder sections unless the current agreed Report Wizard configuration already specifies a different order.

---

# 10. This Is a Frontend Label Migration, Not a Backend Rename

Do **not** rename backend concepts solely to accomplish these UI labels.

For example, if the backend still uses concepts such as:

```text
revenue
operating_expenses
activity_other_expenses
```

leave them intact unless they have already been migrated elsewhere.

Do not rename:

* database models
* database tables
* API routes
* API keys
* serializer fields
* upload schema keys
* query parameter names
* TypeScript API contracts
* internal enums
* report IDs
* stored values

merely for display consistency.

Instead, update presentation labels at the appropriate frontend/configuration layer.

---

# 11. Apply New Names Everywhere Inside Report Wizard UI

Search the entire Central Create / Report Wizard frontend for user-visible occurrences of the old labels.

Update all relevant UI surfaces, including where present:

* Report Wizard right panel
* Report step labels
* form headings
* form descriptions where necessary
* Previous/Continue button labels
* mobile Report Steps sheet
* YTD/Year Progress panel
* expanded monthly report progress details
* Review & Submit summaries
* unresolved-section messages
* completion summaries
* validation/user-facing messages
* breadcrumbs
* current-step labels
* upload-mode headings
* template labels
* tooltips
* empty states
* accessibility labels
* navigation labels

For example:

```text
Continue to Operating Expenses
```

must become:

```text
Continue to Operating Costs
```

and:

```text
Continue to Activity & Other Expenses
```

must become:

```text
Continue to Other Expenses
```

Do not leave a mixture of old and new terminology in the UI.

---

# 12. Templates Must Use the New Frontend Terminology Too

On the Central Create Templates page, user-facing report template labels should also use:

```text
General Income
Operating Costs
Other Expenses
```

rather than:

```text
Revenue
Operating Expenses
Activity & Other Expenses
```

However, do not rename actual existing Excel filenames, parser keys, or download endpoints if doing so would break uploads/downloads.

If safe filename aliases already exist, they may be displayed more cleanly, but functionality takes priority.

The workbook contents must remain compatible with the existing upload parsers.

---

# 13. Do Not Break Existing Upload Mapping

The terminology update must not alter import/export behaviour.

For example, if an upload parser currently expects internal keys associated with `revenue`, continue using those internal keys.

Only the user-facing label becomes:

```text
General Income
```

Likewise:

```text
Operating Expenses → Operating Costs
Activity & Other Expenses → Other Expenses
```

must not require users' existing valid uploaded files to suddenly stop working.

---

# 14. Confirm Progress UIs Also Use New Names

Both progress surfaces must adopt the new terminology.

## Current Report Panel

Example:

```text
August 2026 Report
Step 4 of 7 · 2 resolved

Attendance
Sunday School
Tithes
General Income
Operating Costs
Other Expenses

Review & Submit
```

## Year / YTD Progress

When a month expands, section-level progress should also use:

```text
Attendance
Sunday School
Tithes
General Income
Operating Costs
Other Expenses
```

There should be no old `Revenue`, `Operating Expenses`, or `Activity & Other Expenses` wording visible in these progress interfaces.

---

# 15. Preserve Existing Section Statuses

Do not change report status calculations while updating labels.

Existing states should continue to work:

```text
Not started
In progress
Completed
Skipped
Not required
```

or their current equivalents.

Do not change status semantics merely because section names changed.

---

# 16. Preserve Existing Report Wizard Functionality

After these amendments, verify that all existing Report Wizard workflows still work:

* load existing report
* manual entry
* upload mode
* switch Manual / Uploads
* Previous
* Continue
* Skip
* allowed Confirm no activity
* attachments
* data persistence
* Review & Submit
* progress panel
* Year Progress
* report navigation
* reopening
* locked/read-only reports

This is a launch-stability task.

Avoid unrelated cleanup.

---

# 17. Do Not Modify Other Central Create Areas Yet

Do not migrate or redesign:

* Members
* Households
* Baptism
* Baby Dedication
* Assets
* Homecells
* other create forms

Those will be handled in a separate task.

Only touch their navigation indirectly if required to keep Central Create layout stable.

---

# 18. Avoid Unrelated Refactors

Do not:

* rewrite Central Create
* rewrite Report Wizard
* change backend models
* modify serializers unnecessarily
* alter API endpoints
* create duplicate progress state
* rewrite upload parsers
* rewrite Excel infrastructure
* change report locking
* change grace-period behaviour
* change permissions
* redesign forms
* change existing form field structures
* perform broad component renames
* introduce new dependencies
* perform repository-wide cleanup

Keep the diff focused and safe.

---

# 19. Acceptance Criteria

This task is complete only when all of the following are true:

## Templates

* [ ] Templates page uses the existing `ReportTemplateCard`.
* [ ] Duplicate/custom template card markup has been removed where appropriate.
* [ ] Existing template data is passed correctly to `ReportTemplateCard`.
* [ ] Download actions work.
* [ ] Attendance template downloads correctly if available.
* [ ] Sunday School template downloads correctly.
* [ ] Tithes template downloads correctly if available.
* [ ] General Income template downloads correctly if available.
* [ ] Operating Costs template downloads correctly if available.
* [ ] Other Expenses template downloads correctly if available.
* [ ] No fake download buttons remain.
* [ ] Template UI uses the new frontend terminology.

## Mobile scrolling

* [ ] Report Wizard can scroll vertically on mobile.
* [ ] Users can scroll both down and back up.
* [ ] Long forms are fully reachable.
* [ ] Sticky actions do not block form fields.
* [ ] Mobile Report Steps sheet scrolls.
* [ ] Year Progress sheet scrolls.
* [ ] Closing sheets does not leave the page scroll-locked.
* [ ] Desktop scrolling still works correctly.
* [ ] Persistent desktop Report Panel remains intact.

## Confirm no activity

* [ ] `Confirm no activity` only appears on appropriate optional/not-required sections.
* [ ] Other Expenses supports it where intended.
* [ ] Sections that should use Skip do not incorrectly show `Confirm no activity`.
* [ ] Skip behaviour remains unchanged.
* [ ] Existing report states remain correct.
* [ ] Eligibility is derived from section configuration where feasible.

## Terminology

* [ ] `Revenue` is displayed as `General Income`.
* [ ] `Operating Expenses` is displayed as `Operating Costs`.
* [ ] `Activity & Other Expenses` is displayed as `Other Expenses`.
* [ ] Current Report Panel uses the new labels.
* [ ] Mobile Report Steps uses the new labels.
* [ ] Year Progress uses the new labels.
* [ ] Main form headings use the new labels.
* [ ] Bottom Continue actions use the new labels.
* [ ] Review & Submit uses the new labels.
* [ ] Templates uses the new labels.
* [ ] No relevant old terminology remains visible in Report Wizard UI.
* [ ] Backend/internal contracts remain unchanged unless already migrated.

## Regression safety

* [ ] Manual entry still works.
* [ ] Upload mode still works.
* [ ] Excel upload still works.
* [ ] Image upload still works where supported.
* [ ] Existing reports still load.
* [ ] Existing report IDs remain intact.
* [ ] Previous works.
* [ ] Continue works.
* [ ] Skip works.
* [ ] Review & Submit works.
* [ ] YTD progress still works.
* [ ] Current-report progress still works.
* [ ] No new console errors.
* [ ] TypeScript/type-check passes.
* [ ] Lint passes for modified files.
* [ ] Relevant tests pass.

---

# 20. Implementation Order

Perform the work in this order:

1. Inspect `ReportTemplateCard` and the current Templates implementation.
2. Migrate all available template items to `ReportTemplateCard`.
3. Verify all real Download actions, especially Sunday School.
4. Diagnose the mobile Report Wizard overflow/scrolling issue.
5. Fix mobile vertical scrolling without regressing desktop.
6. Inspect current `Confirm no activity` rendering/logic.
7. Restrict it to appropriate sections while preserving Skip behaviour.
8. Locate the central frontend source of Report Wizard section labels.
9. Apply the new terminology there where possible.
10. Search all Report Wizard/Central Create UI for residual old labels.
11. Update progress, navigation, templates, buttons, headings, Review & Submit, and mobile surfaces.
12. Run regression tests/checks.
13. Stop.

Do not continue into other Central Create forms.

---

# 21. Final Implementation Report

When finished, return a concise implementation report containing:

1. `ReportTemplateCard` migration summary
2. Template download mechanism used
3. Sunday School template/download verification
4. Root cause of the mobile scrolling issue
5. Mobile scrolling fix applied
6. `Confirm no activity` eligibility logic
7. Report Wizard terminology source updated
8. User-facing locations updated to the new names
9. Any internal old names intentionally retained for compatibility
10. Files changed
11. Type-check result
12. Lint result
13. Tests run and results
14. Any issue intentionally deferred

This is a **final launch-readiness amendment**, so keep the implementation narrowly focused, preserve existing working behaviour, and avoid unnecessary refactors.
