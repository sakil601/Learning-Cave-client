# Learning Cave - Next.js 16

Converted from the supplied static V25 website.

## Stack
- Next.js 16 App Router
- JavaScript
- Tailwind CSS v4
- MongoDB + Mongoose
- Next.js Route Handlers for API
- JWT admin session in an httpOnly cookie
- Bangladesh payment gateway abstraction ready to connect

## Run
1. Install Node.js 20.9+.
2. Copy `.env.example` to `.env.local` and set values.
3. Install dependencies: `npm install`
4. Start MongoDB.
5. Optional first seed: `npm run seed`
6. Run: `npm run dev`
7. Open http://localhost:3000
8. Admin: http://localhost:3000/admin/login

## Admin
The current admin uses the existing `site-data.json` structure so all original content is preserved. The editor saves the complete content document to MongoDB. The next step for production is to split the editor into dedicated forms for each content type and add media upload/order management.

## Bangladesh payments
Payment is intentionally provider-agnostic. Set `PAYMENT_GATEWAY` and provider credentials in `.env.local`. The order API currently records payment method/account/transaction ID. A provider adapter can be added for SSLCommerz, aamarPay, shurjoPay, etc. after you choose the exact gateway and merchant credentials.
