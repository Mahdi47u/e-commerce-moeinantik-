# Development Rules

## Frontend Structure

Use this structure for new frontend work:

```text
web/src/
  app/          Next.js route entries only
  features/     page/workflow logic and feature-specific UI
  components/   shared reusable UI and domain components
  services/     API calls only
  types/        API/domain TypeScript types
  config/       static app configuration
  context/      app-wide React providers
  hooks/        truly shared hooks
  lib/          utilities, constants, API client, asset config
```

## Core Rules

- New big page or workflow goes in `web/src/features/<feature-name>`.
- Keep `web/src/app/**/page.tsx` mostly as a small wrapper.
- API calls stay in `web/src/services`.
- API/domain types stay in `web/src/types`.
- Runtime URL values stay in `web/src/config/runtime.ts`.
- Generic shared UI goes in `web/src/components/ui`.
- Shared domain UI goes in `web/src/components/<domain>`.
- Feature-only UI stays in `web/src/features/<feature-name>/components`.
- Feature-only hooks stay in `web/src/features/<feature-name>` or `web/src/features/<feature-name>/hooks` when the feature grows.
- Keep code feature-local until at least two places need it.

## Route Pattern

Route files should usually look like this:

```tsx
import CatalogPageClient from "@/features/catalog/CatalogPageClient";

export default function ProductsPage() {
  return <CatalogPageClient />;
}
```

Avoid putting large UI, fetching logic, filtering logic, or workflow state directly in `app/**/page.tsx`.

## Feature Pattern

A feature can grow like this:

```text
features/catalog/
  CatalogPageClient.tsx
  useCatalogData.ts
  types.ts
  components/
    CatalogHero.tsx
    CatalogFilters.tsx
    CatalogToolbar.tsx
    ProductGrid.tsx
```

Use:

- `*PageClient.tsx` for feature composition.
- `use*.ts` for feature data fetching and derived state.
- `components/*` for feature-specific visual sections.
- `types.ts` for feature-local helper types.

## Shared Component Rules

Use `components/ui` only for generic primitives, such as:

```text
Button
Field
StatusBadge
StatePanel
MetricCard
SectionHeading
```

Use domain folders for shared domain components:

```text
components/product/ProductCard.tsx
components/product/ProductImage.tsx
components/admin/AdminShell.tsx
components/layout/SiteHeader.tsx
```

Do not move a component to `components/*` just because it might be useful later. Move it only when another feature actually needs it.

## Service Rules

Service files must not know about React state or layout.

Good:

```ts
export function getProducts(categorySlug?: string) {
  return apiFetch<Product[]>(`/products${params}`);
}
```

Avoid:

```ts
// Do not put component state, router logic, or UI formatting here.
```

## Runtime Config Rules

Use `web/src/config/runtime.ts` for frontend environment-driven URLs:

```ts
import { API_BASE_URL, SHOP_MEDIA_BASE_URL } from "@/config/runtime";
```

Do not hardcode backend, MinIO, or media origins inside components, services, or asset files. Add new public frontend env values to `web/.env.example` when they are introduced.

## Styling Rules

- Prefer existing design tokens from `globals.css` and `tailwind.config.ts`.
- Use shared UI primitives before creating new button, field, badge, or state styles.
- Keep page-specific layout styles inside the feature component that owns the section.
- Do not create one-off global CSS unless the style is truly app-wide.

## Admin Folder Meaning

It is okay to have admin folders in three places when each has a clear purpose:

```text
app/admin        route entries only
features/admin   admin page/workflow implementation
components/admin shared admin UI building blocks
```

Example:

- `app/admin/products/page.tsx` renders the route.
- `features/admin/products/AdminProductsPageClient.tsx` owns the products admin screen.
- `components/admin/AdminShell.tsx` is shared by multiple admin screens.
