# Learning Cave Fresh Frontend

Fresh Next.js frontend built from the Learning-Cave-V57 demo design and the current Express/MongoDB backend structure.

## Stack

- Next.js 16 App Router
- React 19
- JavaScript only
- Existing V57 CSS/design assets retained for visual parity
- Backend API: `https://server.v1.learningcave.com.bd/api/v1`
- HttpOnly cookie authentication; no JWT is stored in localStorage

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=https://server.v1.learningcave.com.bd/api/v1
NEXT_PUBLIC_SITE_URL=https://learningcave.com.bd
```

## Dynamic course routes

```text
/courses
/courses/[category]
/courses/[category]/recorded
/courses/[category]/live
/courses/[category]/recorded/[slug]
/courses/[category]/live/[slug]
```

The category page is loaded from the backend Category collection. The type page is inferred from published Product records. Product cards point to their canonical detail route.

## Included in this first fresh build

- V57-style header, drawer, search overlay, theme toggle, footer and floating contact controls
- Backend-driven home products/categories
- Dynamic category -> recorded/live -> product course flow
- Recorded course detail with curriculum/instructor/FAQ
- E-book, digital product and bundle public listing/detail pages
- Login and Student/Instructor registration
- Backend Cart, Checkout, SSLCommerz initiation and manual payment flow
- Backend Wishlist
- Student dashboard
- Recorded-course learner page + lesson playback + progress update
- Student live course, ebook, digital product and bundle access screens
- Notifications
- Profile view-only
- Admin dashboard shell ready for real admin CRUD screens
- Static Tips/FAQ/policy foundation

## Backend gaps found while mapping the frontend

1. **Public live-course batch discovery**
   - Add-to-cart for a live course requires `batchId`.
   - Current public API exposes generic Product data, while `/live-courses/me/:productId` is only for enrolled students.
   - A public endpoint such as `GET /api/v1/live-courses/:slug` returning available batches is needed before public live-course checkout can be fully connected.

2. **Quiz discovery inside purchased course curriculum**
   - Student quiz endpoints work when a `quizId` is already known.
   - Current enrollment/course curriculum response does not expose module quiz IDs.
   - Expose module quizzes in `GET /enrollments/me/:courseId` or add a module-quiz list endpoint before the learner UI can automatically render quizzes.

3. **Order history**
   - Checkout works, but there is currently no student `GET /orders/me` / `GET /orders/me/:id` route in the checked server route file.
   - Add these before building the final My Orders UI.

4. **Profile update/password change**
   - Profile is intentionally view-only until update/password endpoints exist.

5. **Homepage merchandising controls**
   - Featured/most-loved sections currently derive from published products/rating data.
   - If admin-controlled featured flags/order are needed, add fields such as `featured` / `homepageOrder` to Product or Settings later.

## Important production backend env

The Express server should allow the frontend domain with credentials, for example:

```env
CLIENT_URL=https://learningcave.com.bd,https://www.learningcave.com.bd,http://localhost:3000
COOKIE_SECURE=true
NODE_ENV=production
```

## Frontend primary pass 2

- Homepage content is English-first while keeping the V57 visual structure.
- Homepage categories and products remain fully backend-driven.
- Most-loved section now filters to actual course products.
- Wishlist state is loaded once globally for signed-in users and shared across product cards.
- Product cards no longer nest a button inside a link.
- Header cart badge now updates immediately after add/remove actions.

## v3 primary frontend pass

This pass focuses on the primary learner experience without changing the noted backend gaps:

- improved dynamic Course → Category → Type → Product browsing
- richer recorded course detail page with backend reviews, curriculum stats and V57-style tabs/sidebar
- account/dashboard navigation and purchase library cards
- per-course progress summaries on dashboard and My Courses
- redesigned lesson player with curriculum sidebar, previous/next navigation, last-lesson memory and progress actions

Pending backend gaps remain unchanged: public live batch listing, learner curriculum quiz IDs, and student order history endpoints.

## v5 frontend pass

Primary commerce/account polish added:
- backend coupon validation preview on checkout (`POST /coupons/validate`)
- checkout total/discount summary, billing and payment method UI
- manual payment pending screen with order/payment references
- wishlist product cards with add-to-cart support (live course routes to detail because public batch listing is still a backend gap)
- student/instructor registration role cards and client password-match validation
- polished login, read-only profile, payment success/fail/cancel states
- wishlist count in authenticated header

Known backend gaps remain intentionally deferred:
1. public live-course batch listing API
2. learner curriculum response with module quiz IDs
3. student order-history endpoints (`GET /orders/me`, `GET /orders/me/:id`)

## v6 admin pass

The admin UI was mapped against the latest `sakil601/learning-Cave-Server` default branch before implementation.

Implemented admin frontend routes:

- `/admin` overview
- `/admin/categories` create/edit/delete categories
- `/admin/products` create/edit/soft-delete generic products
- `/admin/courses` create/list/status actions for recorded courses
- `/admin/courses/[id]` module + lesson management
- `/admin/live-courses` live-course configuration creation
- `/admin/live-courses/[id]` batch + live session management
- `/admin/ebooks` PDF upload + ebook configuration
- `/admin/digital-products` asset upload + digital product files
- `/admin/bundles` bundle product selection/configuration
- `/admin/coupons` coupon CRUD

### Backend gaps intentionally not invented by the frontend

Existing earlier gaps:

1. No public live-course batch listing endpoint for public purchase selection.
2. Learner curriculum does not expose module quiz IDs.
3. No student order-history GET endpoints.

Admin gaps discovered while checking the latest server repo:

4. No admin users/instructors listing endpoint. The backend only exposes `PATCH /admin/instructors/:id/status`, so course/live-course creation currently needs an instructor ObjectId entered manually.
5. No admin payments listing endpoint. Verify/reject actions exist, but there is no API to fetch pending payments for an admin table.
6. No admin live-course list or lookup-by-product endpoint. `GET /admin/live-courses/:liveCourseId` requires the LiveCourse ID. The frontend keeps recently created IDs only in the current browser and lets an admin open a known ID.

These gaps should be fixed server-side later rather than working around them with fake frontend data.

## v7 admin academic-management pass

The recorded-course admin screen now includes module-level resource management and True/False quiz management wired to the current server APIs.

Current server limitation: there is no endpoint that returns the quiz for a module (for example `GET /admin/modules/:moduleId/quiz`) and `getManagedCourse` does not include quiz IDs. The frontend stores a newly-created quiz ID locally for convenience and also allows an admin to paste an existing Quiz ID. A server-side module-to-quiz lookup endpoint should be added later so quiz state can always reload automatically on any device/browser. The current server also has no quiz update/delete or question update/delete endpoints, so v7 only exposes the operations the server actually supports.
