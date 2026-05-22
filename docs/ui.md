# UI Coding Standards

## Component Library

**Only shadcn/ui components are permitted in this project.**

- Every UI element must be built using shadcn/ui components from `src/components/ui/`.
- **No custom components may be created.** Do not build bespoke buttons, inputs, cards, modals, or any other UI primitives from scratch.
- If a shadcn/ui component does not yet exist in the project, install it via the CLI (`npx shadcn@latest add <component>`) rather than writing one by hand.
- Do not wrap shadcn/ui components in custom wrapper components.

## Date Formatting

All dates must be formatted using [date-fns](https://date-fns.org/).

Dates are displayed using ordinal day, abbreviated month, and full year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
22nd May 2026
```

Use `format` with the `do MMM yyyy` format string:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // "1st Sep 2025"
```

Never use `Date.prototype.toLocaleDateString`, `Intl.DateTimeFormat`, or any other date formatting utility.
