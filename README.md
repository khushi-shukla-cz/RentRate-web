# RentRate

RentRate is a Vite + React + TypeScript app for rental trust and transparency.

## Local Development

1. Install dependencies:
	- `npm install`
2. Create env file:
	- Copy `.env.example` to `.env.local`
3. Start dev server:
	- `npm run dev`

## Vercel Deployment

This repository is deployment-ready for Vercel with `vercel.json` configured for:
- Vite build output (`dist`)
- SPA rewrite routing (`/* -> /index.html`)
- baseline security headers

### Steps

1. Push the repository to GitHub.
2. In Vercel, import the project.
3. Keep defaults (Framework: Vite, Build Command: `npm run build`, Output: `dist`).
4. Add environment variables in Vercel Project Settings -> Environment Variables:
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_PUBLISHABLE_KEY`
	- Optional: `VITE_USE_MOCK_AUTH` (`true` or `false`)
5. Deploy.

### Important

- Do not add secrets like `service_role` keys to frontend env variables.
- If you use a fresh Supabase project, run your SQL migrations before testing production features.
