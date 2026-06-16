# Audit Log — Next.js Components

## File structure

```
app/
  compliance/
    audit-log/
      page.tsx                ← Next.js page entry point

components/
  index.ts                   ← Barrel export
  AuditLogPage.tsx           ← Full page layout with KPI summary cards
  AuditLogTable.tsx          ← Table with filtering state (client component)
  AuditLogRow.tsx            ← Expandable row with diff panel (client component)
  AuditLogToolbar.tsx        ← Search + action/model filters
  DiffPanel.tsx              ← Before / After data display
  ActionBadge.tsx            ← Created / Updated / Deleted pill
  ModelBadge.tsx             ← Model name pill
  UserAvatar.tsx             ← Initials avatar circle

data/
  audit-log.ts               ← Mock data matching the API shape

lib/
  audit-log-utils.ts         ← Helpers: formatTimestamp, getInitials, style maps

types/
  audit-log.ts               ← AuditLog, AuditAction TypeScript interfaces
```

## Setup

Ensure Tailwind CSS is configured and `@/` resolves to your project root.

## Usage

### With static mock data
```tsx
import { AuditLogPage } from "@/components";
import { auditLogs } from "@/data/audit-log";

export default function Page() {
  return <AuditLogPage logs={auditLogs} />;
}
```

### With live API data (server component)
```tsx
import { AuditLogPage } from "@/components";
import { AuditLog } from "@/types/audit-log";

async function getLogs(): Promise<AuditLog[]> {
  const res = await fetch("/api/audit-log", { cache: "no-store" });
  return res.json();
}

export default async function Page() {
  const logs = await getLogs();
  return <AuditLogPage logs={logs} />;
}
```

### Table only (embedded in another page)
```tsx
import { AuditLogTable } from "@/components";

<AuditLogTable logs={logs} />
```

## Data contract

```ts
interface AuditLog {
  id: number;
  user: number;
  user_email: string;
  model: string;           // e.g. "overhead", "tithe", "attendance"
  object_id: number;
  action: "Created" | "Updated" | "Deleted";
  old_data: Record<string, unknown> | null;   // null for Created
  new_data: Record<string, unknown> | null;   // null for Deleted
  timestamp: string;       // ISO 8601
}
```

## Notes
- `AuditLogTable` and `AuditLogRow` are `"use client"` — filtering and expand
  state runs in the browser. `AuditLogPage` is a server component.
- `created_at` and `updated_at` are stripped from the diff panels (noise).
  Add to `DIFF_SKIP_KEYS` in `lib/audit-log-utils.ts` to exclude more fields.
- The Export CSV button is wired up as a UI shell — connect it to your
  download endpoint or use `papaparse` to generate client-side CSV.
