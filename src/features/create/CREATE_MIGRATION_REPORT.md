# Create migration — implementation and verification

Status: four existing-contract forms implemented. The six-form migration is **not complete**. Baptism and Baby Dedication require a backend contract decision; browser acceptance testing is outstanding.

## Forms

All new components are in `src/features/create/forms`. All use React Hook Form, reusable Zod payload schemas, and one authenticated server-action submission pipeline. The existing API serializers remain authoritative.

| Form | Route / component | Endpoint, relative to `/api/v1/` | Effective required input | Cache invalidation |
|---|---|---|---|---|
| Member | `/create/members` / `MemberForm.tsx` | `POST people/members/`; read by `member_key` | `first_name`, `last_name`, `date_of_birth`, `gender`, `country`, `phone_number`, `ministries`, `positions`. Phone may be empty and both lists may be empty. | Existing assembly keys: `people/members`, `people/member-directory`; assembly-scoped Create options |
| Household | `/create/households` / `HouseholdForm.tsx` | `POST people/households/`; read by ID | `name`; assembly defaults to authenticated context | Existing assembly key: `people/households` |
| Homecell | `/create/homecells` / `HomecellForm.tsx` | `POST people/homecells/`; read by ID | `group_name`; church comes from authenticated context | Existing assembly keys: `spaces/homecells`, `homecells` |
| Asset | `/create/assets` / `AssetForm.tsx` | `POST bookkeeper/assets/`; read by ID | `item_name`, `acquisition_date`, `asset_type`, `condition`, `units`; assembly and author now supplied securely by server | Existing assembly key: `finance/assets` |
| Baptism | Not implemented; existing card unchanged | No create endpoint found | Cannot determine from this checkout | No existing ceremony query to invalidate |
| Baby Dedication | Not implemented; existing card unchanged | No create endpoint found | Cannot determine from this checkout | No existing ceremony query to invalidate |

The cache paths above use `assemblyQueryKeys.key(assemblyId, ...)`, not new competing key conventions. Successful creation leaves the form locked and provides a link to the existing directory. Every successful POST is followed by a no-store GET to verify identity and assembly. A failed verification never triggers another POST.

## Audit findings and field classification

Inspected the Django models, runtime serializer fields (including generated validators), create/update methods, views, permissions, URL registrations, frontend schemas/services/query hooks, and available legacy UI. The referenced legacy Member submission action/form and legacy Asset/Homecell create forms are not present in this checkout. The existing Household dialog was used as reference and left unchanged.

### Member

Required API keys are listed above. The runtime serializer makes `phone_number` required because it participates in the uniqueness constraint, despite the model allowing blank. Declared slug relationship fields make ministries/positions required keys despite model `blank=True`. Neither requires a selection.

- Optional strings: `middle_name`, `maiden_name`, `place_of_birth`, secondary phone, email, address lines, city, province, previous church, baptism location, occupation, employer, skills, emergency contact fields, notes.
- Optional choices: prefix, relationship, membership status, membership stage, education level. Gender is a required choice. Exact choices come from current Django definitions.
- Nullable optional dates: marriage, member-since, death, baptism, confirmation. Member-since and baptism date have existing `1900-01-01` server defaults.
- Nullable FK: spouse, restricted to the record's assembly on writes. Ministries/positions are many-to-many name-based relationships to global catalogues without tenant ownership.
- Nullable optional image: avatar; uses existing processed-image storage. Avatar fallback is a cosmetic field not exposed by the new form.
- `baptized` is derived by existing `Member.save()` from baptism date and is not presented as an independent checkbox.
- Server-managed/read-only fields are omitted from create payloads: identity/key, assembly, author/editor, timestamps, trash state, PIN fields, computed names/age/transfer state. PIN hashes are now excluded from serializer responses.
- Country is the member's independent contact-country string in the current API, not a country FK or value derived from Church. The new field is labelled country of residence; it does not claim that the server derives it from assembly.
- Required controls are always visible and have no removal action. Optional controls are offered by section; removal unregisters and discards their values. No drafts are persisted.

### Household

Name is required. Optional strings: phone, secondary phone, email, address lines, city, province, country, notes. Status is an optional choice (`active`, `inactive`, `closed`) defaulting to active. Assembly is optional in the serializer and authorized server-side. Key, author/editor, timestamps, counts/contact summaries are generated/read-only.

The household create serializer does **not** accept members. Membership uses the existing `household-members/` or household `add-member/` endpoints with member, household, role and joined date. The new form creates the household first and directs users to the directory; it does not invent an unsupported nested-members payload. Tests cover unauthorized household and cross-assembly member assignment. Update-time ownership reassignment is also rejected.

### Homecell

Group name is required. Optional fields: description, non-church-members text, `leader_id`, `member_ids`, `is_archived` (default false). Leader/member inputs cannot be null when provided; omit an unselected leader and use an empty member list. Church is derived server-side. ID/timestamps and nested leader/member representations are read-only. No location, meeting schedule or assistant-leader fields exist in this contract. A read-only assembly ID was added for verification.

### Asset

Required fields are listed in the table. Optional: item code, description (2,000 characters), vendor, acquisition cost and residual value. Both monetary fields default to `0.00` and accept up to 10 digits with 2 decimal places. Values are transported as decimal strings. The existing serializer does not prohibit negative costs/residuals; no new financial policy was invented. Units must be a nonnegative integer. Type and condition use current model choices. The model's `status` and single `image` field are not in the create serializer and are not exposed.

The old serializer required an image-list key but accepted an empty list. Images now default to an empty list, preserving image-free creation for JSON and multipart requests. Uploads use the existing `AssetImage` infrastructure. Backend validation decodes images with Pillow and limits each to 500 KB and JPEG/PNG/WebP, with at most 10 assets images. The frontend/server action also caps combined uploads at 750 KB to stay below the existing action body limit. Asset and image database writes are transactional.

Assembly/author are server supplied, explicit mismatched ownership is rejected, and the create response now includes its read-only ID for verification. Existing multipart support remains; JSON support is additive.

### Missing ceremony contracts

A repository-wide Python search found no Baptism/Baby Dedication models, serializers, migrations or endpoints. `apps/people/schemas.py` contains display-column placeholders only. Both frontend directory views render `CeremonyListView`, which has no data service or mutation. Attendance baptism totals and Member baptism fields are not a separate ceremony-create contract. They were not repurposed. The outstanding question is whether the missing implementation lives elsewhere or a new ceremony schema should be designed.

## Security

- Existing JWT cookie/server-action infrastructure is reused. No alternate authentication flow, tokens in URLs, or client token handling was introduced.
- Each new form sends its expected assembly as `X-Assembly-ID`. The backend compares it to authenticated active context and existing assembly authorization. Stale forms fail closed after a workspace switch.
- Explicit foreign assembly/church IDs are rejected for Member/Homecell/Asset; Household retains its existing authorized-assembly behavior and also checks expected workspace for the new forms.
- Spouse, Homecell leader and members are restricted by assembly. Household member/ownership authorization is enforced for creation and updates.
- Selector responses contain only member ID/display name, scoped to the active assembly; search uses a POST body. Global ministry/position catalogues are reused.
- New create payloads are Zod allowlists. Server-controlled input cannot pass through arbitrary FormData keys.
- Every form has a synchronous submission latch and disabled pending state. Confirmed or uncertain writes remain locked. No automatic create retry is configured. This does not provide cross-tab/server-wide idempotency.
- Known backend field failures are mapped to safe field messages. Raw response text, exceptions, submitted values and arbitrary error details are not shown or logged.
- No payload logging, client storage drafts, personal data in URLs or client-exposed credentials were introduced. Member PIN-hash exposure was removed at the serializer.
- The form subtree resets on assembly changes. Selector queries use existing assembly keys, no cross-assembly placeholder data, and zero inactive retention. Search results live in form-local state.

## Backend files changed for this work

Paths are relative to the separate backend repository `backend/cfidb`:

- `apps/people/create_security.py`: shared active-scope checks and decoded-image validation.
- `apps/people/serializers/members.py`: spouse scoping, create assembly validation, image validation, remove PIN hash from output.
- `apps/people/views/members.py`: expected-active-assembly enforcement on creation.
- `apps/people/serializers/spaces.py`: scoped relationships, reject mismatched create ownership, read-only assembly ID.
- `apps/people/serializers/households.py`: authorize household ownership and household-membership targets on writes.
- `apps/people/views/households.py`: expected-active-assembly enforcement for the new create flow.
- `apps/people/views/create_options.py` and `apps/people/urls.py`: authenticated, scoped, minimal selector endpoint.
- `apps/bookkeeper/serializers/assets.py`: secure ownership, read-only create ID, optional image list, bounded image validation and transactional records.
- `apps/bookkeeper/views/assets.py`: additive JSON parser support.
- `apps/churches/serializers.py`: fix existing Asset read failure from nonexistent Church.language; preserve the language response key using locale.
- `apps/people/test_create_security.py`: API and security regressions.

No database schema migration or modification of the working database was needed. Existing unrelated local edits in both repositories were preserved.

## Verification

- TypeScript: `tsc --noEmit --incremental false` passed.
- Targeted ESLint for new forms and contract tests passed.
- 17 frontend tests passed: new create contracts/privacy/upload validation plus existing Create Home/report migration tests.
- 27 backend tests passed: new security/API tests plus existing Member integrity/response and Household workflow regressions.
- Each of the four available entities was created and subsequently read through the API in Django's isolated test database, with its assembly verified.
- Tested anonymous requests, unauthorized ownership, stale active scope, unauthorized/missing relationship IDs, required fields, invalid dates/email/phone/enums/amounts, author/PIN mass assignment, image content/size, multipart Member photo upload, and scoped selector switching.
- Tests also cover the newly discovered household update-time ownership reassignment vulnerability.
- Pre-existing timezone warnings occur during test setup. Unrelated pre-existing whitespace warnings remain in backend user/settings files; those files were not edited for this task.
- **Outstanding:** no browser connection is available. Visual light/dark review, actual rapid-click request counting, rendered backend errors, hydration/console checks and end-to-end testing with a signed-in browser remain unverified. No production records were created.

## Legacy fallback

No legacy frontend form was removed, moved, renamed, refactored or redirected. Reporting continues to use its existing implementation and passes its migration tests. Existing Member/Household API regression checks pass. Browser acceptance of the legacy and new experiences is still required before switching the production Create entry point.
