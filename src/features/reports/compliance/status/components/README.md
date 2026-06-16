# Compliance Dashboard — Next.js + Tailwind CSS

## File structure

```
├── page.tsx                                  ← Main dashboard page (app router)
├── lib/
│   ├── compliance-data.ts                   ← All types, mock data, constants
│   └── utils.ts                             ← cn() helper (clsx + tailwind-merge)
└── components/
    ├── ui/
    │   ├── StatusPill.tsx                   ← Compliant / Partial / Not compliant badge
    │   ├── FieldDot.tsx                     ← Circular field indicator (AT / TI / IN / EX)
    │   ├── ProgressBar.tsx                  ← Colour-coded completion bar
    │   └── StarRating.tsx                   ← 1–4 star rating display
    └── compliance/
        ├── KpiBar.tsx                       ← 6-metric summary row
        ├── ComplianceTable.tsx              ← Per-assembly monthly detail table
        ├── AssemblyLeaderboard.tsx          ← Filterable ranked list of assemblies
        ├── SubmissionHeatmap.tsx            ← Assembly × field grid
        ├── DeadlinesPanel.tsx               ← Upcoming / overdue deadlines
        ├── ReminderForm.tsx                 ← Send reminder (email / SMS / WhatsApp)
        ├── ActivityFeed.tsx                 ← Chronological audit trail
        └── Charts.tsx                       ← TrendChart + FieldBreakdownChart (Chart.js)
```

## Setup

### 1. Install dependencies

```bash
npm install react-chartjs-2 chart.js clsx tailwind-merge
```

### 2. Copy files

Place these files into your Next.js project:

- `page.tsx` → `app/compliance/page.tsx` (or any route you prefer)
- `lib/` → `lib/`
- `components/` → `components/`

### 3. Tailwind config

Make sure your `tailwind.config.ts` includes your component paths:

```ts
content: [
  "./app/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./lib/**/*.{ts,tsx}",
],
```

### 4. Replace mock data

In `lib/compliance-data.ts`, swap the static arrays (`assemblies`, `deadlines`, `activityFeed`, etc.)
with your real API calls or database queries. All components are typed — TypeScript will
guide you if a field is missing or renamed.

### 5. Charts SSR

`Charts.tsx` is marked `"use client"` — Chart.js requires the browser DOM.
If you need SSR-safe rendering, wrap the import with `next/dynamic`:

```tsx
// In page.tsx
import dynamic from "next/dynamic";
const TrendChart        = dynamic(() => import("@/components/compliance/Charts").then(m => m.TrendChart),        { ssr: false });
const FieldBreakdownChart = dynamic(() => import("@/components/compliance/Charts").then(m => m.FieldBreakdownChart), { ssr: false });
```

## Key patterns used

- **All colours via Tailwind semantic classes** — no hardcoded hex in JSX
- **`cn()` for conditional classes** — prevents className conflicts
- **Data separated from UI** — swap `compliance-data.ts` for real API without touching components
- **`"use client"` only where needed** — KpiBar, Heatmap, Deadlines are all server-safe
- **Typed props throughout** — all interfaces exported from `compliance-data.ts`
