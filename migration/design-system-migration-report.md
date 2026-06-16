# Design System Migration Report

Date: 2026-06-16

Summary
- The project already defines a comprehensive set of CSS design tokens and theme mappings in `app/globals.css` (color variables, radius, charts, ring, input, etc.).
- Frontend UI primitives are implemented under `src/components/ui/*` and a large number of feature-level components consume those primitives.
- Hardcoded hex colors are minimal in the codebase; most color values use OKLCH tokens in `app/globals.css`. There are a couple of raw hex fallbacks in `app/globals.css` for `prefers-color-scheme`.

Goals
- Create a unified design system that: uses existing CSS variables, standardizes spacing/typography/radii/shadows, replaces remaining hardcoded values, and ensures consistent primitives for buttons, inputs, badges, dialogs, cards, tables, dropdowns, and alerts.

Where tokens live today
-- Primary token source: [src/styles/globals.css](src/styles/globals.css#L1-L200)
  - Color tokens: `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--card`, `--popover`, `--sidebar`, `--chart-*`, etc.
  - Semantic aliases in `@theme inline`: `--color-primary`, `--color-muted`, etc.
  - Radius tokens: `--radius`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`.
  - Note: the codebase predominantly uses a gray color palette; prefer semantic gray tokens (for example `--gray-50` through `--gray-900`) when standardizing colors.

Primary findings
- Tokens are defined and usable across the app — good starting point.
- Many UI primitives are implemented in `src/components/ui/` and already tend to use Tailwind utility classes and/or token-aware classnames; these are the files we'll update to enforce the design language.
- Files to prioritize (core primitives):
  - `src/components/ui/button.tsx`
  - `src/components/ui/input.tsx`
  - `src/components/ui/form-input.tsx`
  - `src/components/ui/textarea.tsx`
  - `src/components/ui/select.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/card.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/components/ui/alert.tsx`
  - `src/components/ui/table.tsx`
  - `src/components/ui/dropdown-menu.tsx`

Suggested canonical token map (use these semantic variables everywhere)
- Colors (semantic):
  - `--color-background` -> page background (already maps to `--background`)
  - `--color-foreground` -> body text
  - `--color-primary` / `--color-primary-foreground`
  - `--color-secondary` / `--color-secondary-foreground`
  - `--color-muted` / `--color-muted-foreground`
  - `--color-accent` / `--color-accent-foreground`
  - `--color-destructive`
  - `--color-border` / `--color-input` / `--color-ring`
  - chart colors: `--color-chart-1..5`
- Spacing scale (CSS custom properties):
  - `--space-xxs: 4px`
  - `--space-xs: 8px`
  - `--space-sm: 12px`
  - `--space-md: 16px`
  - `--space-lg: 24px`
  - `--space-xl: 32px`
  - `--space-2xl: 48px`
- Typography (semantic):
  - `--font-sans`, `--font-mono` (already available)
  - `--type-xs: 12px`, `--type-sm: 14px`, `--type-md: 16px`, `--type-lg: 20px`, `--type-xl: 24px`
- Radii: reuse `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` from `app/globals.css`.
- Shadows (semantic):
  - `--shadow-sm`, `--shadow-md`, `--shadow-lg` — define using subtle RGBA/OKLCH with opacity for light/dark modes.

Migration strategy (high level)
1. Generate this migration report (this file). (current)
2. Add a single design-system entry file that centralizes tokens and utility classes. Proposed location: `src/styles/design-system.css` (imports `app/globals.css` or references the same variables) and `src/styles/design-system.ts` for JS helpers if needed.
3. Update core primitives under `src/components/ui/` to consume tokens directly (CSS `var(--color-...)`) and remove hardcoded colors or ad-hoc Tailwind color utilities that conflict with tokens.
4. Replace feature-level ad-hoc styles by switching components to use the primitives (button, card, badge, input, etc.).
5. Run lint/type checks and smoke-test major pages.
6. Iterate on token naming and spacing scale after visual review.

Automatable edits (recommended order)
- Create `src/styles/design-system.css` that exposes helper classes and documents variable usage.
- Modify `src/components/ui/button.tsx` and other primitives to use CSS variables and a consistent set of classnames.
- Run a code-mod (search/replace) to replace literal color tokens or Tailwind color utilities with semantic token usage in priority files.

Risks and notes
- Tailwind-first approach: the project uses Tailwind — changing utility classes en-masse is risky. Prefer updating the component primitives to map token usage to Tailwind classes (e.g., add `bg-[var(--color-primary)]` in the component) instead of sweeping every Tailwind class.
- Visual diffs required: After updates, the team should visually verify pages. Consider adding a small UI snapshot test or a checklist of critical flows.
- Dark mode: tokens already handle dark mode via `.dark` class and `prefers-color-scheme`; preserve that behavior.

Next concrete actions (I'll perform these if you approve)
1. Create `src/styles/design-system.css` that documents tokens and provides utility helpers.
2. Update `src/components/ui/button.tsx` to the token-based implementation and run a build/lint.
3. Produce a PR-like diff and a short visual checklist for review.

If you want me to start, say "Proceed" and I will implement step 1 and then migrate `button.tsx` as a proof-of-concept, updating the todo list as I go.
