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
6. Public storefront
7. Cart
8. Checkout and orders
9. ZarinPal payment
10. Admin orders
11. SEO, pages, homepage sections
12. Wishlist
13. Testing and deployment prep
