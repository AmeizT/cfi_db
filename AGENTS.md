# AGENTS.md

## Purpose

This repository is maintained by a small development team.

AI coding agents such as Codex should optimize for:

1. Maintainability
2. Readability
3. Consistency with the existing codebase
4. Small, safe changes
5. Ease of future manual editing

Working code is not enough.

Code should also be easy for the project owner to understand, debug, and modify without AI assistance.

---

# Core Rule

## Prefer boring, obvious code.

Do not introduce clever abstractions, indirection, or architectural complexity unless the task genuinely requires it.

A future developer should be able to open the obvious file and quickly determine:

- where the UI is rendered;
- where its styles are controlled;
- where state comes from;
- where permissions are checked;
- where API calls are made;
- and what needs to change to modify the feature.

If a simple implementation works, prefer it.

---

# Before Editing

Before making changes:

1. Inspect the existing implementation.
2. Identify the files responsible for the requested behavior.
3. Follow existing project patterns.
4. Determine the smallest safe change.
5. Check whether the requested behavior already exists elsewhere in the project.

Do not immediately create new files, hooks, utilities, abstractions, or components.

Reuse existing patterns whenever reasonable.

---

# Scope Discipline

Only modify code necessary for the requested task.

Do not:

- refactor unrelated code;
- rename unrelated variables;
- reorganize folders without being asked;
- replace working components unnecessarily;
- change formatting across unrelated files;
- rewrite an entire component to solve a small problem;
- change APIs while working on UI;
- change backend behavior while fixing frontend presentation unless required.

Small diffs are preferred.

---

# Architecture

Do not introduce a new architectural pattern when an existing one already solves the problem.

Before adding:

- a hook;
- context;
- provider;
- service;
- helper;
- utility;
- abstraction;
- wrapper component;
- configuration layer;
- state library;
- layout system;

first determine whether the existing project already has an appropriate solution.

If a new abstraction is genuinely needed, keep it simple and explain why it is necessary.

---

# React / Next.js

Prefer straightforward React components.

Keep related behavior close together when practical.

Avoid unnecessary component fragmentation.

Do not extract a component merely because a JSX section is several lines long.

Extract components when they:

- are reused;
- have meaningful independent behavior;
- significantly improve readability;
- or represent a clear UI concept.

Prefer:

```tsx
<header className="h-14 border-b">
```

over creating a configuration system solely to control a simple height.

Avoid excessive layers such as:

```text
Page
→ Layout
→ Wrapper
→ Shell
→ Container
→ Provider
→ Component
```

unless those layers serve genuine purposes.

---

# TypeScript

Use clear and explicit types.

Avoid overly advanced TypeScript unless it provides meaningful value.

Prefer understandable interfaces and types over complicated generics.

Do not create generic abstractions for functionality that is only used once.

Avoid `any` unless there is a clear reason.

Do not weaken existing type safety merely to make an error disappear.

---

# Tailwind CSS

Prefer Tailwind utilities directly on the relevant component when practical.

UI dimensions should be easy to locate.

For example:

```tsx
<nav className="h-14 px-4">
```

is preferable to hiding basic dimensions behind several layers of helpers.

Use existing design tokens and utilities when they already exist.

Avoid creating new CSS variables for one-off values.

Avoid arbitrary values unless necessary.

Prefer:

```tsx
h-14
```

over:

```tsx
h-[57px]
```

when a standard Tailwind value is appropriate.

---

# Styling

Follow the application's existing visual language.

Do not introduce new:

- fonts;
- color systems;
- shadows;
- border styles;
- spacing systems;
- animation libraries;
- component libraries;

without being explicitly asked.

Use the application's default font.

Maintain consistency with existing:

- border radius;
- spacing;
- typography;
- foreground/background tokens;
- responsive breakpoints;
- button styles.

---

# shadcn/ui

Reuse existing shadcn/ui components where appropriate.

Do not recreate standard components such as:

- Dialog
- DropdownMenu
- Command
- Sheet
- Popover
- Button
- Input
- Select
- Tooltip

if the project already uses the equivalent shadcn component.

Do not unnecessarily wrap shadcn components with additional abstractions.

---

# Responsive Design

Every UI change must consider mobile layouts.

Check for:

- horizontal overflow;
- clipped text;
- fixed widths;
- excessive padding;
- desktop-only interactions;
- overlapping fixed elements;
- long labels;
- table overflow;
- incorrect viewport assumptions.

Prefer responsive Tailwind utilities rather than JavaScript viewport checks when CSS can solve the problem.

---

# State

Keep state as local as practical.

Do not introduce global state for local UI behavior.

Before adding state, determine whether the value can be:

- derived from existing data;
- represented by the URL;
- handled by the server;
- or kept inside the component.

Avoid duplicated state.

---

# Data Fetching

Follow the project's existing data-fetching patterns.

Do not introduce another fetching strategy if the project already has one.

Reuse existing:

- query hooks;
- API clients;
- serializers;
- endpoint conventions;
- caching patterns;
- error handling.

Do not duplicate API request logic inside UI components when an established abstraction exists.

---

# URLs and Navigation

Use the application's current route structure.

Before adding or changing a URL:

1. Search for existing references.
2. Confirm whether old URLs still need redirects.
3. Update related navigation links where necessary.
4. Avoid deleting legacy routes unless explicitly requested.

---

# Permissions

Permissions must be enforced centrally whenever possible.

Frontend permission checks are primarily for presentation and UX.

Security-sensitive authorization must also be enforced by the backend.

Do not create scattered copies of role logic such as:

```tsx
user.role === "admin"
```

throughout the application if an existing permission or capability system exists.

Reuse the existing capability or permission policy.

---

# Django

Follow existing Django application boundaries.

Keep:

- models focused on domain data;
- serializers focused on API representation and validation;
- views/viewsets focused on request handling;
- services/helpers for genuinely reusable domain operations.

Avoid putting large amounts of unrelated business logic directly into views.

Do not move existing logic simply to satisfy stylistic preferences.

---

# Django Models

Be cautious when modifying existing models.

Before changing:

- field types;
- relationships;
- nullability;
- defaults;
- constraints;
- model names;

consider existing production data.

Do not rename or remove production model fields casually.

Generate appropriate migrations for schema changes.

Never alter historical migrations unless specifically required.

---

# Database Changes

Treat production data as valuable.

Before making schema changes:

1. Understand existing data.
2. Consider backwards compatibility.
3. Determine whether a data migration or backfill is required.
4. Avoid destructive operations where possible.
5. Keep migrations focused and reviewable.

---

# Django REST Framework

Reuse existing:

- serializers;
- permissions;
- pagination;
- filters;
- response structures;
- viewset conventions.

Do not create duplicate endpoints when an existing endpoint can reasonably support the requirement.

Keep backend authorization independent from frontend visibility.

---

# Error Handling

Do not silently swallow errors.

Avoid:

```ts
catch {
  // do nothing
}
```

unless intentionally justified.

Errors should either:

- be handled;
- be surfaced appropriately;
- or be logged where appropriate.

User-facing errors should be understandable and not expose sensitive implementation details.

---

# Comments

Comments should explain **why**, not restate obvious code.

Good:

```ts
// Keep the old route working because bookmarks and report links may still reference it.
```

Unnecessary:

```ts
// Set height to 56px
const height = 56
```

Avoid excessive comments generated merely to describe straightforward code.

---

# Naming

Prefer descriptive names.

Good:

```ts
canEditReport
activeAssembly
selectedZone
reportSubmissionStatus
```

Avoid vague names:

```ts
data
thing
value
temp
obj
handler2
```

unless the surrounding context makes their meaning obvious.

---

# File Organization

Do not create new files unnecessarily.

A feature should not require navigating through many files just to understand basic behavior.

Keep related files near each other according to existing project conventions.

Do not reorganize the repository without explicit instruction.

---

# Dependencies

Avoid adding new dependencies unless clearly necessary.

Before installing a package, check whether:

- the functionality already exists in the project;
- the browser/platform provides it;
- a small implementation is sufficient;
- an existing dependency already solves the problem.

If adding a dependency, explain why.

---

# Performance

Do not prematurely optimize.

Prefer readable code unless there is evidence of a performance problem.

Avoid adding:

- memoization;
- caching layers;
- virtualization;
- complex selectors;

without a meaningful reason.

Performance optimization should not significantly reduce maintainability unless necessary.

---

# Accessibility

Preserve or improve accessibility.

Interactive elements should use appropriate semantic elements.

Prefer:

```tsx
<button>
```

over clickable `<div>` elements.

Maintain:

- keyboard navigation;
- labels;
- focus states;
- ARIA attributes where needed;
- sufficient semantic structure.

---

# Existing Functionality

Do not break working behavior while making visual changes.

When the task is UI-only:

- preserve event handlers;
- preserve API calls;
- preserve permissions;
- preserve state behavior;
- preserve existing URLs unless requested;
- preserve validation.

UI refactors should not accidentally become functional rewrites.

---

# Debugging

When fixing a bug, identify the root cause before modifying code.

Do not apply random style or logic changes until the problem disappears.

Trace:

```text
symptom
→ component
→ state/data
→ controlling logic
→ root cause
```

Then apply the smallest appropriate fix.

---

# When Asked for a Small Change

For small tasks such as:

- changing navbar height;
- adjusting spacing;
- moving a button;
- changing a label;
- updating a link;
- modifying an icon;

do not refactor the surrounding component.

Find the controlling value and change it directly.

---

# Explain Important Changes

After completing a meaningful task, provide a concise summary containing:

## Files changed

List the files changed and why.

Example:

```text
components/layout/app-navbar.tsx
- Changed navbar height from h-16 to h-14.

components/layout/app-shell.tsx
- Updated top offset to match the navbar height.
```

## New abstractions

State whether any new:

- components;
- hooks;
- helpers;
- utilities;
- services;

were introduced.

If none:

```text
New abstractions: None.
```

## How to modify this later

For important UI or architectural changes, state where future changes should be made.

Example:

```text
To change the navbar height later:
components/layout/app-navbar.tsx → `h-14`

The app-shell offset uses the same value in:
components/layout/app-shell.tsx → `pt-14`
```

This section is important.

The project owner should not need to rediscover how the feature works.

---

# When the Existing Code Is Overcomplicated

If existing implementation is unusually difficult to maintain:

Do not automatically rewrite it.

First explain:

1. why it is difficult to maintain;
2. what abstraction is causing the complexity;
3. whether simplification is safe;
4. what files would be affected.

Only simplify it when doing so is within the task scope or when explicitly instructed.

---

# AI-Specific Rule

Do not optimize code for what an AI agent finds elegant.

Optimize for what a human maintainer can understand.

Before finalizing a solution, ask:

> Could the project owner reasonably understand where to change this six months from now?

If not, simplify the implementation.

---

# Preferred Change Strategy

Use this order:

```text
1. Understand
2. Locate
3. Reuse
4. Make the smallest change
5. Test
6. Explain
```

Not:

```text
1. Rewrite
2. Abstract
3. Refactor
4. Add helpers
5. Hope nothing broke
```

---

# Final Principle

The best implementation is not necessarily the shortest or most sophisticated.

For this project, the preferred implementation is one that is:

- clear;
- predictable;
- consistent;
- easy to debug;
- easy to modify;
- safe for production;
- and understandable without AI assistance.