---
design_system:
  name: Moein Antik Design System
  version: 1.0.0
  register: product
  direction: Luxury showroom commerce
  language: fa-IR
  directionality: rtl
tokens:
  color:
    background: "oklch(0.955 0.018 82)"
    surface: "oklch(0.982 0.008 82)"
    surface_muted: "oklch(0.91 0.024 78)"
    ink: "oklch(0.19 0.012 64)"
    muted_ink: "oklch(0.48 0.014 64)"
    bronze: "oklch(0.59 0.078 72)"
    bronze_deep: "oklch(0.48 0.078 67)"
    olive: "oklch(0.33 0.045 125)"
    border: "oklch(0.84 0.022 78)"
    success: "oklch(0.43 0.075 145)"
    warning: "oklch(0.62 0.115 75)"
    danger: "oklch(0.52 0.11 28)"
    info: "oklch(0.48 0.07 235)"
  typography:
    family: "Vazirmatn, Tahoma, Arial, system-ui, sans-serif"
    body: "1rem"
    small: "0.875rem"
    caption: "0.75rem"
    product_heading: "1.5rem"
    display_min: "2.5rem"
    display_max: "3.75rem"
  radius:
    sm: "0.5rem"
    md: "0.625rem"
    lg: "0.75rem"
  shadow:
    soft: "0 18px 45px -28px rgba(33, 30, 26, 0.35)"
    focus: "0 0 0 3px color-mix(in oklch, var(--moein-bronze) 22%, transparent)"
components:
  primitives:
    - Button
    - Field
    - StatusBadge
    - StatePanel
    - SectionHeading
    - MetricCard
---

# Overview

Moein Antik should feel like a high-end home showroom that is ready to sell, not a silent museum and not a generic marketplace. The design system balances three ideas: product desire, trust before payment, and approachable luxury.

The public storefront can be more spacious and image-led. It should make sculptures, paintings, dinnerware, candlesticks, clocks, tables, vases, mirrors, and TV tables feel curated and worth buying. The customer and admin surfaces use the same colors, typography, and controls, but they stay practical: tables, filters, forms, statuses, and clear states matter more than decoration.

The system uses a restrained luxury palette: near-ivory surfaces, deep charcoal text, polished champagne bronze for primary actions, and deep olive as the calm secondary signal. Bronze should feel rare and valuable. If every element is bronze, nothing feels premium.

# Style

## Brand Feeling

Use these words as the daily check:

- Luxury
- Trustworthy
- Elevated
- Buyable
- Welcoming

Wrong directions:

- Cheap marketplace
- Discount-shop catalog
- Dark luxury drama
- Overly exclusive gallery
- Generic gift-shop branding
- Template-like card grids

## Color Roles

Use color by meaning, not decoration.

- Near-ivory is the main page background. It keeps the brand bright and accessible.
- Surface is for cards, forms, panels, dropdowns, and admin shells.
- Deep charcoal is the main text color. Body text must stay readable.
- Polished champagne bronze is for primary CTAs, prices, active navigation, focus rings, and premium highlights.
- Deep olive is for calm secondary emphasis, trust notes, availability, and selected filters when bronze would be too loud.
- Semantic colors are reserved for status: success, warning, danger, and info.

Do not use gradient text, glass panels, bronze everywhere, or colored side-stripe borders. Do not put low-contrast gray text on colored backgrounds.

## Typography

Use one family: Vazirmatn first, then Tahoma, Arial, and system fallback. One family is enough because this is a product system with commerce workflows.

Storefront headings can be larger and more emotional, but admin/customer UI should stay fixed and predictable. Persian body copy needs generous line height. Product descriptions, error messages, and empty states should be readable at mobile sizes.

Type roles:

- Display: homepage hero and major campaign moments only.
- Page title: product listing, detail, account, and admin pages.
- Section title: grouped content such as featured products or order details.
- Body: product descriptions, help text, checkout copy.
- Label: forms, filters, table headers, badges.
- Caption: metadata, SKU, dates, support notes.

## Layout Rhythm

Storefront pages should alternate between generous product imagery and tight purchase-support details. The product photo, product name, price, and primary action should be visible without hunting.

Admin pages should use predictable grids:

- Header with title, description, actions.
- Optional metric row.
- Filter/search toolbar.
- Main table or list.
- Detail panel when useful.

Spacing should come from a small scale: 4, 8, 12, 16, 24, 32, 48, 64, and 96px. Related things sit close together; different tasks get more separation.

# Components

## Buttons

Use one primary button per decision area. Primary means "continue purchase", "add to cart", "save", or "confirm". Secondary means useful but less important. Ghost means low-emphasis navigation or small inline actions. Destructive is only for dangerous actions.

Every button needs default, hover, focus-visible, active, disabled, and loading states. Icon buttons need labels via `aria-label` or visible text nearby.

## Fields

Labels are always visible. Placeholder text is a hint, not a label. Errors appear below the field and connect with `aria-describedby`. Validate on blur or submit for normal forms. Do not shout at users while they are still typing.

## Status Badges

Badges explain state in admin and customer surfaces. They must not rely on color alone. The text label is the source of truth.

Recommended tones:

- Success: paid, active, completed, shipped.
- Warning: pending payment, low stock, draft.
- Danger: failed, cancelled, destructive.
- Info: processing, system note.
- Neutral: archived, unknown, inactive.

## State Panels

Empty, loading, error, success, and permission states should feel designed. A blank rectangle with "nothing here" lowers trust.

A strong state panel includes:

- Icon that matches the situation.
- Short title.
- Helpful explanation.
- One clear next action when possible.

## Product Cards

Product cards should sell with restraint:

- Large image first.
- Name and category next.
- Price visible and stable.
- Short description only when it helps.
- Hover can gently lift image scale, but should not move layout.

Do not put too much copy in cards. The card should invite the detail page, not replace it.

## Admin Tables And Lists

Rows should be easy to scan. Use tabular numbers for prices and counts. Keep destructive actions visually quieter than primary actions, but always reachable.

When tables become too narrow on mobile, switch to stacked row cards with the same labels. Do not squeeze columns until Persian text breaks.

# Patterns

## Storefront

Primary storefront flow:

1. Brand trust through clear header, logo, search, categories, wishlist, cart, and account.
2. Product desire through large images and calm spacing.
3. Purchase confidence through price, availability, shipping/payment notes, and clear CTA.
4. Recovery through helpful empty, loading, and error states.

Use the real Moein Antik logo as identity. In the header, prefer the clean horizontal logo without a tiny tagline. Use the circular mark for social avatars and compact placements.

## Customer Account

Customer pages should feel calmer than admin but less decorative than the storefront. Users are checking orders, addresses, profile, wishlist, and preferences. They need reassurance and clarity.

## Admin

Admin pages serve speed and accuracy. Use denser layouts, clear filters, and status badges. Keep the same bronze/olive identity, but do not turn admin into a showroom.

# Beginner Guide

## What Tokens Are

Tokens are named design decisions. Instead of remembering one exact bronze value everywhere, use `primary`, `ring`, or `luxury.bronze`. Tokens keep the project consistent when many pages and components grow.

Think of tokens as ingredients:

- Color tokens: what each color means.
- Type tokens: how big and strong text should be.
- Space tokens: how far things sit apart.
- Radius tokens: how rounded components are.
- Shadow tokens: how depth works.

## What Components Are

Components are reusable UI pieces. A good component solves the same problem everywhere: button, field, badge, product card, empty state, table row.

When you reuse components, your site starts to feel professional because the same actions look the same on every page.

## How To Judge A New Page

Ask these questions before shipping:

- Can a customer understand the primary action in 2 seconds?
- Does the page feel premium without making purchase feel difficult?
- Is bronze used for important actions, not decoration?
- Does Persian text wrap cleanly on mobile?
- Are loading, empty, error, and permission states designed?
- Can a keyboard user see focus and complete the task?
- Does this look like Moein Antik, or like a generic store template?

# Do's And Don'ts

Do make product imagery large and valuable.
Do keep purchase actions clear and close to price/availability.
Do reserve bronze for actions, price, focus, and premium emphasis.
Do keep admin pages readable and operational.
Do design empty/error/loading states before they appear in production.
Do use the real logo carefully and avoid tiny unreadable tagline usage in the header.

Don't make the site feel like a discount marketplace.
Don't make luxury feel unreachable for average buyers.
Don't overuse gold or bronze.
Don't use dark dramatic backgrounds as the default.
Don't use gradient text, glassmorphism, side-stripe borders, or generic card grids as decoration.
Don't hide labels inside placeholders.
