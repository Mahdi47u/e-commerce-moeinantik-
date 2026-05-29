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

Create the `shop-media` bucket in the MinIO console before testing uploads.

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

1. Project setup
2. Auth, users, roles
3. Media layer with MinIO
4. Categories and attributes
5. Products, variants, gallery
6. Public storefront
7. Cart
8. Checkout and orders
9. ZarinPal payment
10. Admin orders
11. SEO, pages, homepage sections
12. Wishlist
13. Testing and deployment prep
