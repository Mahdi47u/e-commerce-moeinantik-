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

Frontend uses a Next.js version of the same modular idea:

```text
src/app
src/components
src/config
src/services
src/context
src/hooks
src/lib
src/types
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

The backend CORS config currently allows local Next.js development origins from `localhost:3000` through `localhost:3004`, plus the same `127.0.0.1` ports.

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
18. Admin content management - homepage sections, content pages, SEO fields
19. Product discovery - category navigation and local search started; pagination controls and richer sort/filter still pending
20. Auth evolution - OTP by phone/email, then decide whether OAuth2 is worth adding
21. Fulfillment and shipping - shipping methods, tracking, stock operations, admin notes
22. Promotions - coupons, discounts, campaign rules
23. Notifications - SMS/email for OTP, order status, payment success/failure
24. Security hardening - rate limiting, audit logs, CORS, security headers, abuse protection
25. Testing expansion - frontend component tests and end-to-end checkout/admin flows
26. Deployment and observability - production configs, CI/CD, backups, logs, monitoring

Rate limiting is intentionally placed after the OTP/OAuth decision because the final auth flow changes which endpoints need strict limits and how identity-based limits should work.
