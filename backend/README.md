# SmartShop Backend

Node.js, Express, MySQL, Stripe (Test Mode), JWT. All code lives in this `backend` folder.

## Setup

1. **Install**
   ```bash
   cd backend
   npm install
   ```

2. **MySQL** – Create DB and tables:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. **Environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`: MySQL credentials, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (see `docs/STRIPE_WEBHOOK.md`).

4. **Run**
   ```bash
   npm start
   ```
   API: `http://localhost:5000/api`

## Create admin user

From project root (SmartShop folder):
```bash
cd backend
node scripts/createAdmin.js
```
Default: `admin@smartshop.com` / `Admin@123` (set `ADMIN_EMAIL`, `ADMIN_PASSWORD` in `.env` to override).

## API

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/products` (pagination, categoryId, minPrice, maxPrice), `GET /api/products/:id`
- `GET/POST/PUT/DELETE /api/cart`, `/api/cart/items` (JWT)
- `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id` (JWT)
- `GET/POST/PUT/DELETE /api/admin/*` (admin JWT)
- `POST /api/webhooks/stripe` (Stripe webhook, raw body)

Use `Authorization: Bearer <token>` for protected routes.
