# Learning Cave Fresh Frontend v9

This version connects the frontend gaps that were unlocked by the new backend APIs.

## Connected in v9

- Student order history and single-order detail
- Public live-course batch listing and batch selection before cart/checkout
- Learner curriculum module quiz detection and in-course True/False quiz UI
- Admin user directory with search/role/status filters and pagination
- Admin instructor directory with approve/reject/suspend actions
- Admin payment queue with filters, pagination, manual verify/reject actions
- Admin live-course list plus active instructor selector for configuration
- Automatic module-to-quiz lookup
- Admin quiz update/delete
- Admin question update/delete
- Removed old UI notices that said these backend APIs were missing

## Backend expected

Use the backend version that includes the tested gap APIs discussed in this project. Set `NEXT_PUBLIC_API_URL` in `.env.local`.
