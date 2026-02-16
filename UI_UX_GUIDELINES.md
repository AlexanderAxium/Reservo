# Reservo -- UI/UX Guidelines

Global design system reference for all Reservo pages (public, client, dashboard, auth).

---

## 1. Font

**Family:** Quicksand (Google Fonts), weights 300--700.

Loaded via `<link>` tags in `src/app/layout.tsx`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
```

Applied globally through CSS variables in `src/app/globals.css`:

```css
--font-family-sans: "Quicksand", sans-serif;
--font-family-heading: "Quicksand", sans-serif;
```

---

## 2. Typography Scale

All typography uses Tailwind utility classes. Never use arbitrary pixel values for font sizes.

### Headings (used in landing / marketing pages)

| Class            | Size                          | Weight    | Use case                |
|------------------|-------------------------------|-----------|-------------------------|
| `.text-heading-1` | `text-3xl sm:text-4xl md:text-5xl` | inherit   | Hero titles             |
| `.text-heading-2` | `text-2xl sm:text-3xl md:text-4xl` | inherit   | Section titles          |
| `.text-heading-3` | `text-xl sm:text-2xl`         | inherit   | Sub-section titles      |

### Dashboard / App Typography

| Pattern                        | Classes                           | Use case                          |
|--------------------------------|-----------------------------------|-----------------------------------|
| Page title                     | `text-2xl font-bold`              | Top of every page                 |
| Page description               | `text-muted-foreground`           | Below page title                  |
| Section heading                | `text-lg font-semibold`           | Card titles, section dividers     |
| Card title (inside CardTitle)  | `text-base font-semibold`         | Override default CardTitle size   |
| Body text                      | `text-base` (default)             | General content                   |
| Body small                     | `text-sm`                         | Table cells, secondary info       |
| Muted text                     | `text-sm text-muted-foreground`   | Descriptions, hints, timestamps   |
| Extra small                    | `text-xs text-muted-foreground`   | Badges sublabels, footnotes       |
| Label                          | `text-sm font-medium`             | Form field labels                 |

### Font Weights

| Weight       | Class           | Use case                    |
|--------------|-----------------|-----------------------------|
| Regular 400  | (default)       | Body text                   |
| Medium 500   | `font-medium`   | Labels, table headers       |
| Semibold 600 | `font-semibold` | Card titles, section heads  |
| Bold 700     | `font-bold`     | Page titles, KPI values     |

---

## 3. Color Tokens

All colors are CSS variables defined in `src/app/globals.css` under `@theme`. Use Tailwind semantic classes (`bg-primary`, `text-muted-foreground`, etc.) -- never hardcode hex values in components.

### Light Mode

| Token                    | Value                    | Tailwind Class              |
|--------------------------|--------------------------|-----------------------------|
| Background               | `#f8fafb`                | `bg-background`             |
| Foreground               | `hsl(240 10% 23.9%)`    | `text-foreground`           |
| Primary                  | `#060C20`                | `bg-primary` / `text-primary` |
| Primary foreground       | `hsl(0 0% 98%)`         | `text-primary-foreground`   |
| Secondary                | `#0072CF`                | `bg-secondary`              |
| Secondary foreground     | `hsl(0 0% 98%)`         | `text-secondary-foreground` |
| Accent                   | `#7ECFC3`                | `bg-accent`                 |
| Destructive              | `hsl(0 84.2% 60.2%)`    | `bg-destructive`            |
| Muted                    | `hsl(240 4.8% 95.9%)`   | `bg-muted`                  |
| Muted foreground         | `hsl(240 3.8% 46.1%)`   | `text-muted-foreground`     |
| Card                     | `hsl(0 0% 100%)`        | `bg-card`                   |
| Border                   | `hsl(140 15.9% 92%)`    | `border-border`             |
| Input                    | `hsl(240 5.9% 90%)`     | `border-input`              |
| Ring (focus)             | `#0072CF`                | `ring-ring`                 |

### Dark Mode

Dark mode is toggled via the `.dark` class on `<html>`. All semantic Tailwind classes automatically switch. Key overrides:

| Token          | Dark Value                |
|----------------|---------------------------|
| Background     | `hsl(220, 15%, 6%)`      |
| Primary        | `hsl(210, 50%, 58%)`     |
| Secondary      | `hsl(187, 60%, 57%)`     |
| Card           | `hsl(220, 15%, 10%)`     |
| Muted          | `hsl(220, 12%, 14%)`     |
| Border         | `hsl(220, 12%, 12%)`     |

### Semantic Color Usage

| Purpose              | Light                                          | Classes                                                                 |
|----------------------|------------------------------------------------|-------------------------------------------------------------------------|
| Success              | Green tones                                    | `bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400` |
| Warning              | Yellow tones                                   | `bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400` |
| Info                 | Blue tones                                     | `bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`     |
| Danger / Error       | Red tones                                      | `bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`         |
| Muted / Neutral      | Purple tones                                   | `bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400` |

---

## 4. Spacing

### Page Layout

| Element             | Classes            | Notes                                    |
|---------------------|--------------------|------------------------------------------|
| Page container      | `p-6 space-y-6`    | All dashboard pages                      |
| Page header         | `flex items-center justify-between` | Title left, actions right  |
| Max-width container | `max-w-3xl mx-auto`| Settings / form-only pages               |
| Section gap         | `space-y-6`        | Between major sections                   |
| Card internal gap   | `space-y-4`        | Between elements inside CardContent      |

### Grid Layouts

| Pattern              | Classes                                          | Use case           |
|----------------------|--------------------------------------------------|--------------------|
| KPI cards            | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4` | Dashboard overview |
| Two-column form      | `grid grid-cols-1 md:grid-cols-2 gap-4`          | Detail pages       |
| Three-column cards   | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` | Permission cards |
| Filter bar           | `grid grid-cols-1 md:grid-cols-3 gap-4`          | List page filters  |

### Gaps

| Context              | Value    |
|----------------------|----------|
| Between cards        | `gap-4`  |
| Between form fields  | `space-y-4` |
| Between sections     | `space-y-6` |
| Between inline items | `gap-2`  |
| Badge clusters       | `gap-1.5` |

---

## 5. Border Radius

Global token: `--radius: 0.6rem`

Tailwind mapping:
- `rounded-md` for inputs, selects, buttons (default)
- `rounded-lg` for cards, dialogs, sheets
- `rounded-full` for avatars, circular buttons

---

## 6. Component Standards

**Rule: Always use shadcn/ui components from `src/components/ui/`. Never use native HTML form elements.**

### Button

Import: `import { Button } from "@/components/ui/button"`

| Variant       | Use case                          |
|---------------|-----------------------------------|
| `default`     | Primary actions (Save, Create)    |
| `outline`     | Secondary actions (Edit, Cancel)  |
| `ghost`       | Tertiary / icon-only actions      |
| `destructive` | Dangerous actions (Delete)        |
| `link`        | Inline text links                 |
| `secondary`   | Alternative emphasis              |

| Size      | Height | Use case                        |
|-----------|--------|---------------------------------|
| `default` | `h-9`  | Standard buttons                |
| `sm`      | `h-8`  | Compact / table actions         |
| `lg`      | `h-10` | Prominent CTAs                  |
| `icon`    | `size-9`| Icon-only buttons              |

Pattern for button with icon:

```tsx
<Button>
  <Plus className="h-4 w-4 mr-2" />
  Create Item
</Button>
```

Pattern for link-styled button:

```tsx
<Link href="/path">
  <Button variant="outline" size="sm">
    <ArrowLeft className="h-4 w-4 mr-2" />
    Back
  </Button>
</Link>
```

### Input

Import: `import { Input } from "@/components/ui/input"`

- Height: `h-9`
- Always pair with `Label`
- For search inputs, use a relative wrapper with a positioned icon:

```tsx
<div className="relative max-w-md">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input placeholder="Search..." value={search} onChange={...} className="pl-9" />
</div>
```

### Select

Import: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"`

**Never use native `<select>`.** Always use the shadcn Select:

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opt1">Option 1</SelectItem>
    <SelectItem value="opt2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

For filter selects that need an "All" option, use an empty string `""` as value:

```tsx
<SelectItem value="">All</SelectItem>
```

### Label

Import: `import { Label } from "@/components/ui/label"`

Always use with form inputs:

```tsx
<div>
  <Label htmlFor="fieldName">Field Name</Label>
  <Input id="fieldName" ... />
</div>
```

### Textarea

Import: `import { Textarea } from "@/components/ui/textarea"`

Use for multi-line text. Set `rows` prop for default height.

### Checkbox

Import: `import { Checkbox } from "@/components/ui/checkbox"`

Use for boolean toggles in forms and permission grids.

### Card

Import: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"`

Standard structure:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

CardHeader padding: `p-6`, CardContent padding: `p-6 pt-0`.

### Badge

Import: `import { Badge } from "@/components/ui/badge"`

| Variant       | Use case                       |
|---------------|--------------------------------|
| `default`     | Primary labels                 |
| `secondary`   | Roles, tags, categories        |
| `outline`     | System labels, count badges    |
| `destructive` | Error states, inactive status  |

For status badges with semantic colors, use `className` override:

```tsx
<Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
  Active
</Badge>
```

### Tabs

Import: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"`

Standard pattern:

```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1" className="gap-2">
      <Icon className="h-4 w-4" />
      Tab Label
    </TabsTrigger>
  </TabsList>
  <TabsContent value="tab1" className="space-y-4 mt-4">
    {/* Content */}
  </TabsContent>
</Tabs>
```

TabsList has `h-12` height with `rounded-lg` and muted background.

### Dialog

Import: `import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"`

Use for create/edit forms:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Item</DialogTitle>
      <DialogDescription>Fill in the details.</DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-2">{/* Form fields */}</div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={handleSubmit}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### AlertDialog

Import: `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"`

**Never use native `window.confirm()`.** Always use AlertDialog for destructive confirmations:

```tsx
<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete item?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Table

**Data tables (paginated lists):** Use `ScrollableTable` from `src/components/ui/scrollable-table.tsx`:

```tsx
import { ScrollableTable, type TableColumn, type TableAction } from "@/components/ui/scrollable-table";

const columns: TableColumn<Item>[] = [
  { key: "name", title: "Name", width: "200px", render: (_, record) => ... },
];

const actions: TableAction<Item>[] = [
  { label: "View", onClick: (record) => router.push(`/path/${record.id}`) },
];

<ScrollableTable
  data={data?.data || []}
  columns={columns}
  actions={actions}
  loading={isLoading}
  error={error?.message}
  pagination={data?.pagination}
  onPageChange={setPage}
  onPageSizeChange={setLimit}
  emptyMessage="No items found"
/>
```

**Simple grids (permission matrix, settings):** Use shadcn `Table` from `src/components/ui/table.tsx`:

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
```

### Skeleton

Import: `import { Skeleton } from "@/components/ui/skeleton"`

Match the skeleton layout to the actual content:

```tsx
// For a page with title + grid
<div className="p-6 space-y-6">
  <Skeleton className="h-8 w-48" />
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
  </div>
</div>
```

### Tooltip

Import: `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"`

Use for icon buttons or truncated text that needs explanation.

---

## 7. Icons

**Library:** lucide-react (exclusively). Never mix icon libraries.

| Context         | Size class    | Example                    |
|-----------------|---------------|----------------------------|
| Inline (text)   | `h-4 w-4`    | Button icons, table cells  |
| Card header     | `h-5 w-5`    | Card title icons           |
| Page header     | `h-6 w-6`    | Page title icons           |
| Empty states    | `h-12 w-12`  | Large placeholder icons    |

Icons inside buttons should have `mr-2` margin.

---

## 8. Patterns

### Page Header

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-bold">Page Title</h1>
    <p className="text-muted-foreground">Page description</p>
  </div>
  <Button>
    <Plus className="h-4 w-4 mr-2" />
    Primary Action
  </Button>
</div>
```

### Back Navigation

```tsx
<div className="flex items-center gap-4">
  <Link href="/dashboard/parent">
    <Button variant="ghost" size="sm">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  </Link>
  <div className="flex-1">
    <h1 className="text-2xl font-semibold text-foreground">Detail Title</h1>
    <p className="text-sm text-muted-foreground mt-0.5">Subtitle</p>
  </div>
</div>
```

### Search + Filter Bar

```tsx
<div className="flex items-center justify-between">
  <div className="relative max-w-md flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input placeholder="Search..." value={search} onChange={...} className="pl-9" />
  </div>
  <div className="flex items-center gap-2">
    <Select value={filter} onValueChange={setFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All</SelectItem>
        <SelectItem value="active">Active</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
```

### Empty State

```tsx
<div className="text-center py-12">
  <Icon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
  <p className="text-muted-foreground">No items found</p>
  <Button variant="link" className="mt-2">Create one</Button>
</div>
```

### Loading State

Always use `Skeleton` components that match the expected layout. Never use spinner-only states.

### Permission Guard

```tsx
if (!hasPermission(PermissionAction.READ, PermissionResource.ITEM)) {
  return (
    <div className="p-6">
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          You don't have permission to access this section
        </p>
      </div>
    </div>
  );
}
```

---

## 9. Responsive Design

Mobile-first approach. Use Tailwind breakpoints:

| Breakpoint | Width   | Use case                              |
|------------|---------|---------------------------------------|
| (default)  | < 640px | Mobile: single column, stacked layout |
| `sm:`      | 640px   | Small tablets                         |
| `md:`      | 768px   | Tablets: 2-column grids               |
| `lg:`      | 1024px  | Desktop: full grid layouts (3-4 cols) |

Tables use `ScrollableTable` which handles horizontal overflow on mobile.

---

## 10. Dark Mode

- All pages must support dark mode via CSS variables
- Never hardcode color hex values in components (use `bg-background`, `text-foreground`, etc.)
- For semantic color badges, always include dark variants: `bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`
- Dark mode toggles via `ThemeProvider` with class strategy on `<html>`

---

## 11. Toast Notifications

Import: `import { toast } from "sonner"`

| Type    | Use case                   | Example                              |
|---------|----------------------------|--------------------------------------|
| Success | After successful mutations | `toast.success("Item created")`      |
| Error   | After failed mutations     | `toast.error(err.message \|\| "Error")` |
| Info    | General notifications      | `toast.info("Processing...")`        |

---

## 12. Form Validation

Use Zod schemas for validation. For tRPC mutations, validation happens server-side via the input schema. Client-side, validate before calling `mutate()`:

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!name.trim()) {
    toast.error("Name is required");
    return;
  }
  mutation.mutate({ name: name.trim() });
};
```

For complex forms, use `react-hook-form` with `@hookform/resolvers/zod` and the shadcn `Form` component.

---

## 13. tRPC Client Import

**Standard import:** `import { trpc } from "@/hooks/useTRPC"`

Use this consistently across all files. The alias `@/utils/trpc` also exists for backward compatibility but should be migrated.

---

## 14. Language / i18n

- Dashboard UI text: **English** (consistent across all dashboard pages)
- Public-facing text: Uses `next-intl` with translations in `src/locales/{en,es,pt}/`
- Code comments: Spanish is acceptable (legacy convention)
