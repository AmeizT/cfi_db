# Global CSS audit and module map

The application and playground import `src/styles/globals.css`. It imports the
modules below; components should continue importing only the entry point.

| File | Responsibility |
| --- | --- |
| `globals.css` | Framework imports/plugins, dark variant, global transitions and base layer |
| `tokens.css` | Semantic light/dark tokens, charts, fonts, shadows and Tailwind aliases |
| `assembly-theme.css` | Canonical assembly palette, aliases and legacy color compatibility tokens |
| `shell.css` | Shell/sidebar tokens, final sidebar aliases, connectors and active rows |
| `utilities.css` | Custom utilities, including compatibility class names |
| `animations.css` | Animation tokens and keyframes, retaining their original layers |
| `effects.css` | Glass, dropdown effects, noise, crosshatch and decorative borders |
| `components.css` | Existing `.color` and `.v-separator` helpers |

## Navigation-origin and muted-text follow-up (2026-09-18)

Active ownership now follows the clicked item key and source (`navigation` or
`shortcuts`), rather than automatically preferring a matching Shortcut. The source
is session-only: direct loads, reloads and unrelated external route changes fall
back to canonical navigation. Same-route clicks can transfer ownership. Link
`onNavigate` callbacks avoid changing ownership for modified/new-tab clicks.
Shortcut generation, ordering, layout and glass styling are unchanged.

Muted foreground is neutral-600 in light mode and neutral-400 in dark mode.
`text-muted`, sidebar muted labels and glass `--ink-muted` now share that token.
The old fixed `text-muted` OKLCH value was a separate, too-pale source. Calculated
contrast for the new neutral colors is 7.80:1 on white, 7.15:1 on the neutral light
surface and 6.91:1 on the dark card surface; arbitrary overlays may differ.

Validation: 23 targeted routing/rendering/shortcut tests pass, including Tithes and
Members origin transfers and direct loads. Typecheck and CSS compilation pass;
targeted lint has no errors and two existing unused-symbol warnings. Live browser
interaction and screenshots remain unverified because no browser is available.

## Dark-mode follow-up (2026-09-18)

The original audit below records the no-redesign refactor. The subsequent requested
corrections now intentionally replace its retained dark-border and glass-selector
quirks:

- Dark semantic borders use neutral-700; subtle borders use neutral-800.
- Sidebar connector strokes consume `--shell-sidebar-connector`, overridden to
  neutral-800 in dark mode; connector geometry and animation are unchanged.
- Dropdown content/subcontent, Command and CommandDialog use `glass-surface`.
  Legacy `.dropdown`/`.command` names alias the same rule. Dark glass uses 96%/94%
  charcoal stops and 16px blur; nested CommandDialog content avoids double painting.
- Shared popup selection uses the neutral accent token without overriding
  destructive foregrounds. Portal, focus, filtering and positioning code is unchanged.
- Active glass remains on the shared `data-active="true"` selectors. No position
  or Shortcut-specific CSS restriction was found. Existing routing assigns a
  matching Shortcut sole ownership and suppresses its main-navigation duplicate;
  the first Recent entry often owns the active route. This logic is unchanged.
- Seven server-rendered regression cases cover Home, first/another Shortcut,
  Reporting, Operations, Organization and nested items, each with exactly one
  active shared button and one `aria-current="page"`. All 14 targeted tests pass.
- Typecheck and CSS compilation pass. Targeted lint has no errors and one existing
  unused `SearchIcon` warning. No browser is available, so visual reproduction of
  the reported first-Shortcut-only effect, popup opacity and light/dark rendering
  remain unverified. No unsupported claim of a routing fix is made.

## Audit and cleanup

The pre-edit audit searched TypeScript, TSX, JavaScript/JSX, CSS, HTML and related
project files for custom properties, class/utility names, animation names, theme
selectors and stylesheet imports. It indexed 305 style identifiers across 1,999
files. References in archived styles were distinguished from application imports;
short names such as `command` and `color` were not treated as proof of live class
usage. Potentially dynamic/library-generated classes were conservatively retained.

- Removed the first `.pill-hover` rule: every property was overridden by the last
  rule. The final gradient, shadow, blur and `.icon-badge` styles are preserved.
  Consumers include `ContextSidebar.tsx` and `AssemblySwitcher.tsx`.
- Removed repeated `--primary` and `--primary-foreground` declarations within the
  same `.dark` rule, retaining the final declarations. Light and dark scopes still
  each declare these tokens because nested theme scopes can resolve differently.
- Removed earlier root sidebar aliases superseded by the final root aliases.
  The final aliases remain **after** `.dark`; do not merge them into the first
  root block. At equal specificity, order determines the root sidebar appearance.
  Dark descendant overrides are retained. Adjacent dark shell blocks are merged.
- Removed commented-out imports, token experiments, crosshatch and nested dark
  utility experiments. No potentially live component class names were removed.
- Canonical `--assembly-theme-50` through `--assembly-theme-950` shade formulas
  now live only in `assembly-theme.css` within the active stylesheet graph.
  `@theme inline` aliases reuse these variables for Tailwind generation.
- Existing `bg-theme-*`, `text-theme-*` and `border-theme-*` colors are **not**
  equivalent to canonical assembly shades: they use different percentages and
  sRGB instead of OKLCH. Their historical values are centralized in
  `--color-legacy-theme-*` inline tokens and reused through `@apply`. Keeping the
  original custom utility names also avoids activating previously unsupported
  opacity variants or changing the custom ring/divide semantics. Directly adding
  public `--color-theme-*` tokens generated additional live classes in the
  comparison and was therefore avoided.

`applyChurchTheme()` still writes the root assembly 600/accent/foreground tokens.
`getAssemblyThemeColor()` still prioritizes `avatar_fallback_color`. No component
APIs, Motion components or theme-switching logic were changed.

## Suspicious styles intentionally retained

- Global 180ms background/border/text transitions: no established runtime evidence
  of a regression. They do not target the height/opacity animated by the Motion
  collapsible. Browser checks are still needed before changing this behavior.
- `html[data-theme="dark"]` glass tokens versus `.dark`: the app's theme provider
  uses the class attribute. Enabling these glass tokens for `.dark` would change
  current behavior, so the selector mismatch is documented rather than changed.
- `--border-subtle: var(--neutral-700)` in dark mode: no definition of
  `--neutral-700` was found in the active styles. Replacing it with
  `--color-neutral-700` would change borders, including sidebar connectors.
- `--base-graident-to`: misspelled, with no consumer found. It does not override
  `--base-gradient-to`; correcting it would change the current dark gradient
  endpoint. The historical declaration is retained for this no-redesign refactor.
- Theme-layer chart defaults remain distinct from unlayered semantic chart
  overrides; source order alone does not describe their cascade.
- Accordion open/close uses height-only animation and ease-out; down/up also
  changes opacity and uses a different easing. Collapsibles use a different Radix
  height variable. They are not interchangeable duplicates. `tw-animate-css` and
  `tailwindcss-animate` remain installed/imported with their original behavior.
- `no-scrollbar` and `scrollbar-hidden` have matching output but both have live
  consumers, including command menus and report tables. Both APIs are retained with a shared implementation. The equivalent `border-md`
  and `border-sm` utilities likewise share their 1px definition.
- `app/globals.css`, `old-css.css`, `secondary.css`, `design-system.css` and the
  pre-existing `backup.css` are not imported by the current application entry
  points. They were left untouched, including existing user changes.

## Verification (2026-09-17)

- TypeScript: `pnpm exec tsc --noEmit --incremental false` passed before the
  production build regenerated Next.js route validators. See the build failure
  below; a fully clean typecheck cannot be claimed for those regenerated types.
- Tailwind/PostCSS compilation passed before and after the refactor. The existing
  `backup.css` matches the pre-crash baseline compilation size (563,656 bytes).
  A normalized comparison of selector/at-rule/declaration paths found all 6,440
  original final declaration values unchanged and no added declaration paths
  when both entries were compiled against the same final source tree.
  This verifies generated values, including effect rules and keyframes, but is
  not a substitute for computed-style or screenshot comparisons.
- Seven existing assembly color, sidebar contrast and shell tests passed.
- `pnpm lint`: one error and 266 warnings outside the CSS changes. The error is
  synchronous setState in an effect at `src/hooks/use-controlled-state.tsx:21`.
- `pnpm build`: webpack compiled successfully in 2.5 minutes, then Next.js type
  validation failed because the existing activities page exports `DashboardPreview`
  (`app/(authenticated)/(shell)/(workspace)/engagement/activities/page.tsx`).
  This is outside the CSS refactor. The production build did not complete.
- Browser runtime reported no available browsers. Live light/dark rendering,
  switching between assemblies, hover/active states, glass, chart rendering and
  accordion/collapsible interaction remain unverified in a browser.
