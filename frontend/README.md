# Bazaarly — frontend

A React + Vite + Tailwind CSS storefront for the multi-vendor marketplace backend in `../backend`.

## Run it

```bash
npm install
npm run dev
```

Opens on http://localhost:5173. In dev, Vite proxies every `/api/*` request straight
to `http://localhost:8080` (see `vite.config.js`), so the backend just needs to be
running — no environment variables required, no CORS involved.

Start the backend first (from the repo root) — the compose file builds and runs
Postgres, Redis, Kafka, *and* the Spring Boot app itself, so you don't need a
local JDK or Maven install:

```bash
cp .env.example .env    # first time only
docker compose -f infrastructure/docker-compose.yml up -d --build
```

(If you'd rather run the backend outside Docker with `mvn spring-boot:run`, see
the backend README — you'll still need Postgres/Redis/Kafka up via compose.)

## Project layout

```
src/
  api/          One file per backend resource (auth, products, cart, orders, seller…)
  context/      AuthContext, CartContext, ToastContext
  components/   Shared UI: Navbar, ProductCard, Badge, RatingStars, form fields…
  pages/        One component per route
  utils/        JWT decoding, currency/status formatting
```

## Talking to a non-default backend

Only needed if you're not using the dev proxy (e.g. building for production, or
pointing at a deployed backend):

```bash
cp .env.example .env
# edit VITE_API_BASE_URL in .env
```

If you do this, the backend must allow your frontend's origin via
`CORS_ALLOWED_ORIGINS` (see the backend README).

## What the UI intentionally does *not* do, and why

These all trace back to gaps in the current backend API, listed here so they don't
look like frontend bugs:

- **Cart quantity only goes up via a stepper, never down to an arbitrary number.**
  The API can add to a line's quantity or delete it outright — there's no
  "set exact quantity" endpoint.
- **Category filters on the product list only filter what's already loaded**,
  not the whole catalog. `GET /products` doesn't accept a category filter, so this
  filters client-side on the current page.
- **Reviews show no author name or date.** The `Review` entity doesn't expose
  those fields to the API.
- **Seller approval has no button anywhere in the UI.** There's no endpoint for it —
  it's a manual SQL update against the `seller_profiles` table (see the root README).

## Design notes

The visual language is deliberately a "marketplace of many stalls" rather than a
single-brand storefront: each category gets one of four accent colors (marigold,
teal, berry, plum), consistently derived from its name, and cart/order views borrow
a receipt-like layout (dashed dividers, monospace prices) to lean into the
multi-seller, itemized-transaction feel.
