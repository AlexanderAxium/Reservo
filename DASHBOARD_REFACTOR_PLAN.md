# Dashboard Refactor Plan

Comprehensive per-file audit of the `/dashboard` routes and supporting components, with issues and required changes grouped by priority.

---

## Priority 1 -- Replace native HTML elements with shadcn/ui

Every native `<select>`, `<input>`, `<label>`, `<table>`, and `window.confirm()` must be replaced with shadcn equivalents.

### Native `<select>` → shadcn `Select`

| # | File | Line(s) | Description |
|---|------|---------|-------------|
| 1 | `src/app/(dashboard)/dashboard/payments/page.tsx` | 162 | Status filter dropdown |
| 2 | `src/app/(dashboard)/dashboard/reservations/page.tsx` | 202 | Status filter dropdown |
| 3 | `src/app/(dashboard)/dashboard/fields/page.tsx` | 170-185 | Sport filter dropdown |
| 4 | `src/app/(dashboard)/dashboard/fields/page.tsx` | 194-213 | Availability filter dropdown |
| 5 | `src/components/fields/ReservationCalendar.tsx` | 219 | Status filter dropdown |
| 6 | `src/app/(client)/my/reservations/page.tsx` | 152 | Status filter dropdown |

### Native `<input>` → shadcn `Input` or `Checkbox`

| # | File | Line(s) | Description |
|---|------|---------|-------------|
| 7 | `src/app/(dashboard)/dashboard/fields/page.tsx` | 151-160 | Search text input |
| 8 | `src/components/fields/ReservationCalendar.tsx` | 211-217 | Search text input |
| 9 | `src/app/(dashboard)/dashboard/fields/new/page.tsx` | 282 | Checkbox input → shadcn `Checkbox` |
| 10 | `src/app/(dashboard)/dashboard/fields/[id]/edit/page.tsx` | 342 | Checkbox input → shadcn `Checkbox` |

> **Note:** `src/components/fields/ImageUpload.tsx` line 143 uses a hidden `<input type="file">` triggered by a Button. This is acceptable and does not need replacement.

### Native `<label>` → shadcn `Label`

| # | File | Line(s) | Description |
|---|------|---------|-------------|
| 11 | `src/app/(dashboard)/dashboard/fields/page.tsx` | 145, 164, 188 | Filter bar labels (3 instances) |
| 12 | `src/app/(dashboard)/dashboard/fields/new/page.tsx` | 464 | Feature checkbox label |
| 13 | `src/app/(dashboard)/dashboard/fields/[id]/edit/page.tsx` | 526 | Feature checkbox label |
| 14 | `src/app/(dashboard)/dashboard/reservations/calendar/page.tsx` | 73 | Field select label |
| 15 | `src/components/fields/ScheduleModal.tsx` | 137, 159, 177 | Form field labels (3 instances) |

### Native `<table>` → shadcn `Table`

| # | File | Line(s) | Description |
|---|------|---------|-------------|
| 16 | `src/app/(dashboard)/dashboard/roles/[id]/page.tsx` | 251 | Permission assignment grid |

### Native `confirm()` → shadcn `AlertDialog`

| # | File | Line(s) | Description |
|---|------|---------|-------------|
| 17 | `src/app/(dashboard)/dashboard/staff/[id]/page.tsx` | 89 | Role removal confirmation |
| 18 | `src/app/(dashboard)/dashboard/features/page.tsx` | 162 | Feature deletion confirmation |
| 19 | `src/app/(dashboard)/dashboard/sport-centers/page.tsx` | 139 | Sport center deletion confirmation |
| 20 | `src/app/(dashboard)/dashboard/payments/[id]/page.tsx` | 55 | Payment verification confirmation |
| 21 | `src/app/(dashboard)/dashboard/payments/[id]/page.tsx` | 61 | Refund processing confirmation |
| 22 | `src/app/(dashboard)/dashboard/fields/[id]/schedule/page.tsx` | 122 | Schedule deletion confirmation |

**Total Priority 1 items: 22**

---

## Priority 2 -- Fix broken/non-functional elements

| # | File | Line(s) | Issue | Fix |
|---|------|---------|-------|-----|
| 23 | `src/components/dashboard/FeedbackDialog.tsx` | 71 | `onSubmit` only logs to console | Either integrate a real API endpoint (e.g. tRPC `feedback.submit`) or mark the dialog as "Coming soon" with a disabled submit button |

---

## Priority 3 -- Typography and spacing consistency

### Page title inconsistency

All page titles must use `text-2xl font-bold`. The following files use `text-2xl font-semibold text-foreground` instead:

| # | File | Line |
|---|------|------|
| 24 | `src/app/(dashboard)/dashboard/fields/page.tsx` | 123 |
| 25 | `src/app/(dashboard)/dashboard/fields/new/page.tsx` | 176 |
| 26 | `src/app/(dashboard)/dashboard/fields/[id]/edit/page.tsx` | 235 |
| 27 | `src/app/(dashboard)/dashboard/fields/[id]/schedule/page.tsx` | 166 |
| 28 | `src/app/(dashboard)/dashboard/reservations/[id]/page.tsx` | 28 |
| 29 | `src/app/(dashboard)/dashboard/reservations/new/page.tsx` | 48 |
| 30 | `src/app/(dashboard)/dashboard/reservations/calendar/page.tsx` | 63 |
| 31 | `src/app/(dashboard)/dashboard/roles/new/page.tsx` | 76 |
| 32 | `src/app/(dashboard)/dashboard/roles/[id]/page.tsx` | 181 |
| 33 | `src/app/(dashboard)/dashboard/roles/[id]/edit/page.tsx` | 127 |
| 34 | `src/app/(dashboard)/dashboard/staff/[id]/page.tsx` | 134 |
| 35 | `src/app/(dashboard)/dashboard/staff/new/page.tsx` | 69 |
| 36 | `src/app/(dashboard)/dashboard/clients/[id]/page.tsx` | 140 |
| 37 | `src/app/(dashboard)/dashboard/payments/[id]/page.tsx` | 95 |

**Fix:** Replace `text-2xl font-semibold text-foreground` with `text-2xl font-bold` in all 14 files.

### Hardcoded color classes

| # | File | Line | Current | Fix |
|---|------|------|---------|-----|
| 38 | `src/app/(dashboard)/dashboard/staff/page.tsx` | 666 | `bg-gray-100 text-gray-800` fallback | Use semantic classes (e.g. `bg-muted text-muted-foreground`) |

---

## Priority 4 -- Placeholder pages

| # | File | Issue | Fix |
|---|------|-------|-----|
| 39 | `src/app/(dashboard)/dashboard/settings/payment-methods/page.tsx` | Shows "Esta funcionalidad estará disponible próximamente" | Add proper "Coming soon" UI with icon, English text, and appropriate empty-state pattern per UI guidelines |
| 40 | `src/app/(dashboard)/dashboard/settings/notifications/page.tsx` | Shows "Esta funcionalidad estará disponible próximamente" | Same as above |

---

## Priority 5 -- Code quality and consistency

### Standardize tRPC imports

All files should use `import { trpc } from "@/hooks/useTRPC"`. The following still use the old path:

| # | File | Line |
|---|------|------|
| 41 | `src/app/(dashboard)/dashboard/fields/[id]/page.tsx` | 27 |
| 42 | `src/app/(dashboard)/dashboard/fields/new/page.tsx` | 31 |
| 43 | `src/app/(dashboard)/dashboard/fields/[id]/edit/page.tsx` | 31 |

**Fix:** Replace `import { trpc } from "@/utils/trpc"` with `import { trpc } from "@/hooks/useTRPC"`.

### Language consistency

Dashboard UI text should be in English. These files mix Spanish and English:

| # | File | Issue |
|---|------|-------|
| 44 | `src/app/(dashboard)/dashboard/staff/page.tsx` | Tab titles in English, other text in Spanish |
| 45 | `src/app/(dashboard)/dashboard/page.tsx` | KPI card labels in English, other elements may be in Spanish |

> **Decision needed:** Pick English for all dashboard UI text (code comments in Spanish are fine). Audit all files after making the switch.

---

## Implementation Order

Suggested execution order for the refactoring:

1. **Batch A -- Quick wins (items 24-37, 38, 41-43):** Typography fixes and import standardization. Simple find-and-replace, low risk.
2. **Batch B -- Native selects (items 1-6):** Replace all `<select>` with shadcn `Select`. Each is a self-contained change.
3. **Batch C -- Native inputs/labels (items 7-15):** Replace `<input>` and `<label>` with shadcn equivalents.
4. **Batch D -- Native confirm dialogs (items 17-22):** Replace `confirm()` with `AlertDialog`. Each requires adding state management and a dialog component.
5. **Batch E -- Native table (item 16):** Replace the permission grid `<table>` with shadcn `Table` components.
6. **Batch F -- Broken functionality (item 23):** Fix or properly stub the FeedbackDialog.
7. **Batch G -- Placeholder pages (items 39-40):** Apply empty-state pattern.
8. **Batch H -- Language audit (items 44-45):** Final pass to ensure all dashboard text is in English.

---

## What is NOT in scope

- No backend/tRPC router changes
- No Prisma schema changes
- No new features -- only fixing existing pages to follow the UI/UX guidelines
- No changes to public-facing pages or auth pages (those follow different patterns and are covered by the guidelines for future work)
