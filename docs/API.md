# API Map

## Public
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- GET `/api/v1/products`
- GET `/api/v1/products/{id}`
- GET `/api/v1/categories`
- POST `/api/v1/categories` (SELLER/ADMIN)
- GET `/api/v1/products/{productId}/reviews`
- GET `/api/v1/health`

## Authenticated
- POST `/api/v1/seller/profile`
- POST `/api/v1/seller/products`
- POST `/api/v1/cart/items`
- GET `/api/v1/cart`
- DELETE `/api/v1/cart/items/{id}`
- POST `/api/v1/orders`
- GET `/api/v1/orders`
- POST `/api/v1/payments/{orderId}/mock-success`
- POST `/api/v1/products/{productId}/reviews`

## Design rules
- DTO validation at API boundaries
- service/domain transactions around money and inventory operations
- database constraints are the final integrity layer
- authenticated identity comes from JWT, never from request user IDs
