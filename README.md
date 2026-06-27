# Moein Antik E-commerce

Custom luxury e-commerce platform for Moein Antik, built with Spring Boot, PostgreSQL, MinIO, Next.js, TypeScript, Tailwind, and shadcn-style components.

## Architecture

```text
e-commerce-moeinantik-/
  api/  Spring Boot backend
  web/  Next.js frontend
```

Backend uses the same feature-based architecture style as the BlogApp:

```text
common/
  config
  entity
  exception
  security
  util

feature/
  auth
  user
  media
  category
  attribute
  product
  cart
  order
  payment
  seo
  homepage
  page
  setting
```

Frontend uses a Next.js version of the same modular idea, with routes kept thin and feature modules owning page behavior:

```text
web/src/
  app/          Route entries only. Keep page/layout files thin.
  features/     Page or domain features: data hooks + section components.
  components/   Shared UI, layout, product, auth, and admin components.
  services/     API request functions only.
  types/        API/domain TypeScript types only.
  config/       Static navigation/config values.
  context/      App-wide React providers.
  hooks/        Truly shared hooks.
  lib/          Utilities, constants, API client, asset config.
```

Frontend coupling rules:

- `app/**/page.tsx` should mostly import and render a feature client component.
- `features/<name>/use*.ts` owns fetching, URL-derived state, and derived data for that feature.
- `features/<name>/components/*` owns feature-specific visual sections.
- `components/ui/*` must stay generic and reusable; it should not import feature services or domain-specific data.
- `services/*` must not know about React state or layout. It only talks to the backend API.
- Runtime URLs belong in `web/src/config/runtime.ts`; do not hardcode backend or media origins in components.
- Shared storefront pieces such as `ProductCard` and `ProductImage` live in `components/product`; page-specific grids and filters live in `features/catalog`.

Current storefront feature split:

```text
web/src/features/home/
  HomePageClient.tsx
  useHomepageData.ts
  components/
    CategoryRail.tsx
    CollectionBanner.tsx
    HeroSection.tsx
    ProductShowcase.tsx
    RoomIdeas.tsx
    TrustStrip.tsx

web/src/features/catalog/
  CatalogPageClient.tsx
  useCatalogData.ts
  types.ts
  components/
    CatalogFilters.tsx
    CatalogHero.tsx
    CatalogToolbar.tsx
    ProductGrid.tsx

web/src/features/product-detail/
  ProductDetailPageClient.tsx

web/src/features/account/
  AccountPageClient.tsx

web/src/features/auth/
  LoginPageClient.tsx
  RegisterPageClient.tsx

web/src/features/admin/
  orders/
    AdminOrdersPageClient.tsx
  products/
    AdminProductsPageClient.tsx
```

## Local Services

Start PostgreSQL and MinIO:

```bash
docker compose up
```

PostgreSQL:

```text
localhost:5432
database: moein_antik_shop
username: postgres
password: postgres
```

MinIO:

```text
API: http://localhost:9000
Console: http://localhost:9001
username: minioadmin
password: minioadmin
bucket: shop-media
```

The API creates the `shop-media` bucket automatically on first upload. For direct browser access to uploaded files, make sure the bucket/prefix has a public read policy in MinIO.

## Media API

Phase 3 adds a MinIO-backed media library for product and content images.

Admin endpoints, protected by `ADMIN` or `SUPERADMIN` role:

```text
POST /api/admin/media
GET /api/admin/media
DELETE /api/admin/media/{id}
```

Upload uses `multipart/form-data`:

```text
file: image/jpeg, image/png, image/webp, or image/gif
altText: optional
```

Public metadata endpoint:

```text
GET /api/media/{id}
```

## Catalog Taxonomy API

Phase 4 adds the category tree and reusable product attributes.

Category admin endpoints, protected by `ADMIN` or `SUPERADMIN` role:

```text
POST /api/admin/categories
GET /api/admin/categories
GET /api/admin/categories/{id}
PUT /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
```

Public category endpoints:

```text
GET /api/categories
GET /api/categories/{slug}
```

Attribute admin endpoints, protected by `ADMIN` or `SUPERADMIN` role:

```text
POST /api/admin/attributes
GET /api/admin/attributes
GET /api/admin/attributes/{id}
PUT /api/admin/attributes/{id}
DELETE /api/admin/attributes/{id}
POST /api/admin/attributes/{attributeId}/values
PUT /api/admin/attributes/{attributeId}/values/{valueId}
DELETE /api/admin/attributes/{attributeId}/values/{valueId}
```

Public attribute endpoint:

```text
GET /api/attributes
```

## Product Catalog API

Phase 5 adds products with variants, gallery images, and attribute assignments.

Product admin endpoints, protected by `ADMIN` or `SUPERADMIN` role:

```text
POST /api/admin/products
GET /api/admin/products
GET /api/admin/products/{id}
PUT /api/admin/products/{id}
DELETE /api/admin/products/{id}
```

Public product endpoints:

```text
GET /api/products
GET /api/products?category={categorySlug}
GET /api/products/{slug}
```

Product requests can include nested `variants`, `galleryImages`, and `attributes`. Gallery images reference uploaded media asset IDs from Phase 3, and attributes reference definitions from Phase 4.

## Public Storefront

Phase 6 adds the first public shopping surfaces in Next.js:

```text
/products
/products/{slug}
```

The storefront reads the public product and category APIs, supports category filtering and text search, and shows product gallery images, variants, prices, and attributes.

## Cart API

Phase 7 adds a user cart connected to product variants. Cart endpoints require an authenticated user token:

```text
GET /api/cart
POST /api/cart/items
PUT /api/cart/items/{itemId}
DELETE /api/cart/items/{itemId}
DELETE /api/cart
```

The frontend includes:

```text
/cart
```

Product detail pages can add the first active variant to the cart. Checkout remains a later phase.

## Checkout And Orders API

Phase 8 adds checkout from the authenticated cart and customer order history:

```text
POST /api/checkout
GET /api/orders
GET /api/orders/{id}
GET /api/admin/orders
```

Checkout creates a `PENDING_PAYMENT` order, stores item price/name snapshots, decrements stock, and clears the cart. Payment gateway integration remains Phase 9.

The frontend includes:

```text
/checkout
/orders
```

## ZarinPal Payment API

Phase 9 adds ZarinPal payment initiation and callback verification.

Authenticated endpoint:

```text
POST /api/payments/zarinpal/orders/{orderId}/start
```

Public callback endpoint used by ZarinPal:

```text
GET /api/payments/zarinpal/callback?Authority={authority}&Status={status}
```

The backend requests a ZarinPal authority, redirects the customer to `StartPay`, verifies the callback, marks successful orders as `PROCESSING`, and stores the ZarinPal reference ID. Configure merchant and callback values under `payment.zarinpal` in `application.yml` before live testing.

The frontend includes:

```text
/payment/result
```

## Admin Orders

Phase 10 adds the first operational admin order surface:

```text
GET /api/admin/orders
GET /api/admin/orders/{id}
PUT /api/admin/orders/{id}/status
```

The frontend admin route is:

```text
/admin/orders
```

Admins can search orders, inspect customer/shipping/item details, and update order status through the fulfillment workflow.

## SEO, Pages, Homepage Sections

Phase 11 adds content pages, homepage sections, and a public homepage payload:

```text
GET /api/homepage
GET /api/pages/{slug}
POST /api/admin/pages
GET /api/admin/pages
PUT /api/admin/pages/{id}
DELETE /api/admin/pages/{id}
POST /api/admin/homepage/sections
GET /api/admin/homepage/sections
PUT /api/admin/homepage/sections/{id}
DELETE /api/admin/homepage/sections/{id}
```

The frontend includes dynamic content pages at:

```text
/pages/{slug}
```

The homepage reads featured products, categories, and active homepage sections from the API.

## Wishlist

Phase 12 adds authenticated wishlist support:

```text
GET /api/wishlist
POST /api/wishlist
DELETE /api/wishlist/{productId}
```

The frontend includes:

```text
/wishlist
```

Product detail pages can save active products to the wishlist.

## Current Project Stage

The project is in the **functional MVP + storefront polish stage**. The backend has the main commerce foundation, and the frontend now has a usable public storefront shell, responsive navigation, homepage, product listing, and product detail flow. It is not production-ready yet because the admin system, customer dashboard, checkout polish, deployment setup, and security hardening still need work.

What is already implemented:

- JWT email/password auth, user profile, roles, and protected routes
- MinIO media upload and public media metadata
- Categories, product attributes, products, variants, galleries, and product SEO fields
- Public homepage, product listing, product detail, content pages, cart, checkout, orders, payment result, and wishlist pages
- Cart, checkout, order creation, order history, admin order status management
- ZarinPal payment start and callback verification
- Content pages and homepage sections APIs
- Pagination on major list endpoints: products, orders, media, content pages
- N+1 mitigation for product, order, and cart collections with batched loading
- Backend unit/mock/integration test coverage for the main feature modules
- Responsive storefront shell with shared header, footer, mobile menu, and role-aware admin navigation
- Dynamic category navigation in the desktop and mobile menus using the public category API
- Polished homepage hero, featured products section, category discovery section, and empty states
- Polished product listing page with search, category filters, product count, and empty/error states
- Polished product detail page with gallery, purchase panel, wishlist action, attributes, and description sections
- Local CORS configuration for Next.js development ports `3000` through `3004`

What is still lacking:

- Full customer dashboard: profile edit UI, address book, order details, returns/cancellation, preferences
- Full admin dashboard: product CRUD UI, category CRUD UI, attribute CRUD UI, media library UI, pages UI, homepage section UI, user management
- Cart, checkout, orders, payment result, auth, and account UI polish
- Remaining storefront responsive QA, Persian-first copy pass, loading states, empty states, and error states
- Product search/filter/sort UX with real pagination controls on the frontend
- OTP login/register flow and optional OAuth2 social login decision
- Inventory operations: stock history, low-stock alerts, reservation/rollback rules, admin stock tools
- Shipping methods, shipping prices, delivery tracking, and admin fulfillment notes
- Discount/coupon system
- Reviews/ratings or customer questions, if wanted
- Notifications: email/SMS for OTP, order status, payment result
- Production hardening: rate limiting, audit logs, security headers, CORS tightening, refresh tokens or session strategy, backup strategy
- Deployment pipeline, environment separation, monitoring, logs, and production MinIO/PostgreSQL configuration
- Frontend component tests and end-to-end browser tests

## Future Task: Controlled CMS For Storefront Editing

Add a small admin CMS so the store owner can edit important storefront content after the application is deployed, without changing code or redeploying for every banner/photo/copy update.

Preferred direction:

- Build a **controlled content editor**, not a full Elementor clone.
- Admin route example: `/admin/homepage`
- Editable areas should include hero banner image, hero title/subtitle, CTA text/link, collection banners, featured product sections, category rail/order, room ideas images, footer/contact copy, and SEO title/description fields.
- Use approved block types such as `Hero`, `CategoryRail`, `ProductShowcase`, `CollectionBanner`, `TrustStrip`, and `RoomIdeas`.
- Allow admins to edit block content, choose/upload images from the media library, enable/disable blocks, and reorder blocks.
- Keep layout and styling controlled by the design system so the public site stays premium, responsive, and consistent.

Avoid building a full drag-and-drop Elementor-style builder at first. A fully flexible builder would be expensive to build, easier to break, harder to make responsive, and more likely to produce inconsistent pages. The safer first version is a block-based CMS where the admin controls content and order, while the app controls layout, spacing, typography, and responsive behavior.

Performance guidance:

- The CMS should not slow down the public storefront if implemented correctly.
- Public pages should read saved content from the backend API/database and render normal React components.
- Avoid shipping admin/editor scripts to public storefront pages.
- Store optimized image URLs and require correct image sizes/aspect ratios for hero and banner areas.
- Cache public homepage/content payloads when deployed, for example short API caching or revalidation after admin save.
- Consider adding preview/draft/publish states later, so admins can review changes before they go live.

## Future Task: Admin Dashboard Analytics

Build the admin dashboard as a practical Persian RTL operations surface, inspired by modern commerce dashboards but styled for Moein Antik. The goal is not decorative charts; the goal is helping the store owner quickly understand sales, stock, product health, and content performance.

Dashboard components to implement clearly:

- KPI cards: total sales, paid orders, total orders, active products, low-stock products, category count, featured products, and average order value.
- Revenue analytics chart: daily/weekly revenue and order count. The first version can use existing order data; the production version should use backend aggregate endpoints.
- Monthly target component: sales target, current revenue, progress percentage, and warning state when the shop is behind target.
- Top categories chart: best categories by revenue, order items, or product count. Start with product count until order-item category aggregation is available.
- Conversion funnel: product views, add-to-cart, checkout started, payment completed, and abandoned carts.
- Traffic sources: direct, organic search, social media, referral, email/campaigns, and paid ads if used later.
- Recent orders: latest orders with customer, city, status, payment state, and total.
- Inventory alerts: low stock, out of stock, draft products without images, active products without price, and products missing SEO fields.
- Content and SEO alerts: blog posts in draft, pages missing meta title/description, homepage blocks disabled, and images without alt text.

Data source plan:

- Phase 1: dashboard UI reads existing admin orders/products/categories APIs and computes simple totals on the client.
- Phase 2: add backend aggregate endpoints such as `/api/admin/analytics/overview`, `/api/admin/analytics/revenue`, `/api/admin/analytics/categories`, and `/api/admin/analytics/inventory`.
- Phase 3: add event tracking for product views, search queries, add-to-cart, checkout start, payment success/failure, and campaign source.
- Phase 4: add exports and reports for sales, inventory, customer behavior, and SEO/content gaps.

Performance guidance:

- Do not query every raw record for heavy dashboards in production. Use pre-aggregated backend responses for charts and totals.
- Cache analytics responses for short periods, for example 30 to 120 seconds, because dashboard numbers do not need millisecond accuracy.
- Avoid large chart libraries until the dashboard truly needs them. CSS/SVG charts are enough for the first version.
- Lazy-load advanced analytics panels when they are below the fold.
- Keep admin analytics code out of public storefront bundles.
- Add database indexes before production analytics grows: order `createdAt`, order `status`, payment status, product status, category, stock quantity, and event timestamp/source.

## Run Backend

```bash
cd api
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui.html
```

## Run Frontend

Install dependencies:

```bash
cd web
npm install
```

Optional local environment file:

```bash
copy .env.example .env.local
```

Frontend runtime URLs:

```text
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_MEDIA_URL=http://localhost:9000
NEXT_PUBLIC_SHOP_MEDIA_URL=http://localhost:9000/shop-media
```

These values are centralized in `web/src/config/runtime.ts`. Use them through that module instead of hardcoding `localhost` URLs inside components or API helpers.

Start dev server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

If port `3000` is busy, run Next.js on another local port:

```bash
npm run dev -- -p 3004
```

The backend CORS config currently allows local Next.js development origins from `localhost:3000` through `localhost:3005`, plus the same `127.0.0.1` ports.

## Design Direction

Theme:

```text
Luxury Gallery Commerce
```

Public site:

- Warm ivory background
- Deep charcoal text
- Antique bronze primary color
- Deep olive accent
- Large product images
- RTL Persian-first layout
- Vazirmatn font

Admin:

- Clean operational UI
- Practical tables, forms, filters, and status badges
- Same tokens, less decoration

## Phase Plan

1. Project setup - done
2. Auth, users, roles - done
3. Media layer with MinIO - backend done
4. Categories and attributes - backend done
5. Products, variants, gallery - backend done
6. Public storefront - first frontend slice done
7. Cart - backend and first frontend slice done
8. Checkout and orders - backend and first frontend slice done
9. ZarinPal payment - backend and first frontend slice done
10. Admin orders - backend and first frontend slice done
11. SEO, pages, homepage sections - backend and first frontend slice done
12. Wishlist - backend and first frontend slice done
13. Quality foundation - backend tests, pagination, and N+1 fixes done
14. Storefront UI design polish - shell, navigation, homepage, products, and product detail in progress/done
15. Customer dashboard - account home, profile edit, addresses, order detail, preferences
16. Admin dashboard foundation - admin shell, navigation, reusable table/form patterns
17. Admin catalog management - products, variants, categories, attributes, media library
18. Admin content management - controlled CMS for homepage sections, content pages, media selection, SEO fields, and block ordering
19. Product discovery - category navigation and local search started; pagination controls and richer sort/filter still pending
20. Auth evolution - OTP by phone/email, then decide whether OAuth2 is worth adding
21. Fulfillment and shipping - shipping methods, tracking, stock operations, admin notes
22. Promotions - coupons, discounts, campaign rules
23. Notifications - SMS/email for OTP, order status, payment success/failure
24. Security hardening - rate limiting, audit logs, CORS, security headers, abuse protection
25. Testing expansion - frontend component tests and end-to-end checkout/admin flows
26. Deployment and observability - production configs, CI/CD, backups, logs, monitoring

Rate limiting is intentionally placed after the OTP/OAuth decision because the final auth flow changes which endpoints need strict limits and how identity-based limits should work.
