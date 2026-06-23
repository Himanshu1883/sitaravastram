# Sitara Vastram API

Express + MongoDB + GridFS backend for the Sitara Vastram storefront.

## Setup

1. Copy `server/.env.example` to `server/.env`
2. Set `MONGODB_URI` to your Railway MongoDB connection string
3. Install and seed:

```bash
cd server
npm install
npm run seed        # first time
npm run seed:force  # reset database
```

4. Start the API:

```bash
npm run dev   # development
npm run build && npm start   # production
```

## Railway deployment

1. Create a **MongoDB** service on Railway
2. Create a **Node** service pointing to the `server/` directory
3. Set environment variables:
   - `MONGODB_URI` — from MongoDB service
   - `JWT_SECRET` — random secret string
   - `CLIENT_URL` — your frontend URL
   - `NODE_ENV=production`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Run seed once locally against production URI: `MONGODB_URI=... npm run seed`

## Frontend

Set in project root `.env`:

```
VITE_API_URL=https://your-api.railway.app
```

For local dev, Vite proxies `/api` to `http://localhost:5000` — leave `VITE_API_URL` empty or set to `http://localhost:5000`.

## API overview

| Route | Description |
|-------|-------------|
| `GET /api/health` | Health check |
| `GET /api/homepage` | Hero, categories, fabrics, occasions, etc. |
| `GET /api/products` | Product catalog with filters |
| `GET /api/products/:slug` | Single product |
| `GET /api/media/:fileId` | GridFS media stream |
| `POST /api/auth/otp/send` | Send mock OTP |
| `POST /api/auth/otp/verify` | Verify OTP (demo: `123456`) |
| `POST /api/admin/auth/login` | Admin login |
| `POST /api/admin/media` | Upload image/video to GridFS |

Default admin: `admin@sitaravastram.com` / `sitara2026`
