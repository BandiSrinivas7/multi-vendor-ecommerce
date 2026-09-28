# Bazaarly — Multi-Vendor E-Commerce Platform

A Spring Boot marketplace backend (Java 21) with a new React frontend built on top of it.
The backend was provided as an API-only project with no UI; this repo adds a complete
storefront in `frontend/` and a small number of backend fixes that the frontend
surfaced as blocking bugs (details below).

```
backend/        Spring Boot API (Java 21, PostgreSQL, Redis, Kafka)
frontend/       React + Vite + Tailwind storefront — see frontend/README.md
infrastructure/ docker-compose.yml (Postgres, Redis, Kafka, backend)
docs/           API.md, ROADMAP.md (unchanged from the original backend)
```

## Run it

```bash
cp .env.example .env                                          # first time only
docker compose -f infrastructure/docker-compose.yml up -d --build

cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The frontend talks to the backend at `localhost:8080`
through Vite's dev proxy — no environment variables or CORS setup needed for local dev.

Swagger UI for the raw API is still at http://localhost:8080/swagger-ui.html.

## First walkthrough

1. **Register as a seller** at `/register`, choosing "Sell".
2. You'll land on `/seller` with a "pending approval" notice. Approve yourself
   in Postgres (this backend has no admin-approval endpoint, so this is the
   intended local-dev path, not a workaround):
   ```sql
   UPDATE seller_profiles SET status = 'APPROVED'
   WHERE user_id = (SELECT id FROM users WHERE email = 'your@email.com');
   ```
3. Refresh `/seller` — the pending notice is gone. List a product, set its stock,
   activate it.
4. Open an incognito window (or log out), register as a customer, and buy it:
   browse `/products`, add to cart, check out, complete the mock payment.

## Backend fixes made while building the frontend

The frontend surfaced three real issues in the backend as delivered. All three are
fixed in `backend/`:

1. **No CORS configuration.** `SecurityConfig` never called `.cors(...)` or defined a
   `CorsConfigurationSource`, so any browser-based frontend on a different origin
   would be blocked outright. Added a proper CORS config, origin(s) configurable via
   `CORS_ALLOWED_ORIGINS` (defaults to `http://localhost:5173`). *(Not actually
   exercised in local dev, since the Vite proxy makes requests same-origin — but
   necessary for a production deployment or any other frontend origin.)*

2. **`GET /cart`, `POST /cart/items`, and `GET /orders` would throw
   `LazyInitializationException` on every call.** These endpoints return raw JPA
   entities (`Cart`, `Order`) containing `LAZY` associations (`Cart.user`,
   `Order.user`, `Product.seller`, `Product.category`) from plain, non-transactional
   controller methods, while `spring.jpa.open-in-view` was set to `false`. That
   combination means Jackson hits an uninitialized proxy — with no Hibernate session
   left open — while serializing the response. This isn't a hypothetical: it
   reproduces on a plain `GET /cart` with an empty cart, because `Cart.user` alone
   is enough to trigger it. Fixed by re-enabling `open-in-view` (see the comment in
   `application.yml` for the actual root-cause and the better long-term fix — returning
   DTOs from those two controllers the way `ProductController` already does).

3. **`permitAll()` on `/api/v1/products/**` was method-agnostic**, so an anonymous
   request could reach `POST /api/v1/products/{id}/reviews` and `POST
   /api/v1/categories`. Since those controllers assume an authenticated user and call
   `.orElseThrow()` on the lookup, an anonymous call didn't get rejected with a clean
   401 — it fell through to a generic 500. Scoped the public matchers to `GET` only;
   POST endpoints now correctly require authentication.

4. **Added `GET /api/v1/seller/products`.** There was no way for a seller to list
   their own products (draft or active) after creating them — only create,
   update-stock, and activate existed. Without it, the seller dashboard would have
   nothing to show after the first product was created. It returns the same shape as
   the public product view plus `availableQuantity`.

## Known limitations (API-driven, not frontend bugs)

These are constraints of the current API surface, worked around as gracefully as
possible in the UI rather than hidden. Full detail in `frontend/README.md`:

- Cart quantity can only be incremented or removed entirely — no "set to N".
- Category filtering on the product list is client-side (`GET /products` has no
  category filter parameter), so it only filters the currently loaded page.
- Reviews carry no author name or timestamp — the `Review` entity doesn't expose them.
- Seller approval is a manual SQL step (see above) — there's no approval endpoint.
- There's no `GET /me`; the frontend decodes the JWT client-side to know who's signed in.

## Everything below is from the original backend README

### Included

- Java 21 / Spring Boot
- PostgreSQL + Flyway
- JPA/Hibernate
- JWT authentication + BCrypt
- Customer / Seller / Admin roles
- Seller profiles, categories, product catalog + search + pagination
- Inventory with pessimistic locking, cart, transactional checkout
- Mock payment with idempotent success behavior, reviews
- Redis + Kafka infrastructure, Actuator, OpenAPI/Swagger UI, Docker Compose

### Production hardening still required before a real public deployment

HTTPS/TLS termination, a secret manager, refresh-token rotation and revocation,
payment-provider signature verification, an outbox pattern for Kafka events, real
Redis caching/rate limiting, Kafka consumers and a DLQ, a Testcontainers integration
suite, CI/CD security scanning, Prometheus/Grafana, object storage for product images,
an address/shipping service, email/SMS notifications, backup/restore strategy,
WAF/load balancer, distributed tracing, and load testing.

This is a complete, runnable MVP plus a strong foundation — not a pretense that mock
payment or local Kafka is a production deployment.
