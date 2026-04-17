# RentRate Project Explanation (For Judges and Beginners)

This document is organized in 3 parts exactly as requested:

- Part 1: Project explanation for judges
- Part 2: Core logic from web dashboard and code explanation for judges
- Part 3: Full beginner-friendly explanation from project idea to code flow

---

## Part 1: Project Explanation for Judge

## 1) What is this project?

**RentRate** is a trust-first rental marketplace web app where:

- Owners can list rental properties.
- Tenants can browse and compare properties.
- Both sides can build reputation using ratings, reviews, and trust score.
- Users can message each other directly.

The product goal is to reduce rental risk by making user behavior and reliability visible.

## 2) Problem this project solves

Traditional rental platforms often focus only on property photos/price, but not trust history.
RentRate adds social proof and accountability using:

- Multi-criteria reviews (behavior, communication, maintenance, etc.)
- Trust score
- Role-based profiles (owner/tenant)
- Owner rating shown directly in property cards

## 3) Tech stack and architecture

### Frontend

- React 18 + TypeScript
- Vite (build and dev server)
- React Router (page navigation)
- Tailwind CSS + shadcn/ui components
- Lucide icons
- Framer Motion animations

### Backend and data

- Supabase (Auth + Postgres + Row Level Security)
- SQL migrations define schema, policies, triggers

### Data mode strategy

The app supports **two data modes**:

1. Supabase mode (real backend)
2. Mock mode (demo fallback using local data + localStorage)

This is useful in judging/demo situations because the app can still run and show features even when backend setup is incomplete.

## 4) Main modules

- Auth system with role support (`owner` / `tenant`)
- Listings and property browsing
- Property details page with owner summary and recent reviews
- Dashboard for logged-in users (overview, listings management, reviews, messages entry)
- Messaging screen (conversation style UI)
- Review-driven reputation updates

## 5) Route map (high-level)

Public routes:

- `/` Home page
- `/listings` Property browsing
- `/property/:id` Property details
- `/about`, `/contact`
- `/login`, `/register`

Protected routes (require login):

- `/dashboard`
- `/messages`
- `/review/:userId`

## 6) Security and correctness highlights

- Protected routes use auth guard and redirect unauthenticated users to login.
- Supabase Row Level Security policies restrict inserts/updates/deletes to valid owners/users.
- Messaging policy allows users to read only their own conversations.
- Review trigger auto-updates profile reputation stats.

## 7) What judges should evaluate quickly

- Is trust score update automatic? (Yes, SQL trigger on reviews)
- Is unauthorized data access blocked? (Yes, RLS policies)
- Can owner manage own listings from dashboard? (Yes)
- Is there a stable fallback for demo mode? (Yes, mock auth/data)
- Is the UI complete across key user journeys? (Home -> Listings -> Details -> Dashboard -> Messages)

---

## Part 2: Core Logic from Web Dashboard + Code Explanation for Judge

This section explains the most important logic centered on dashboard behavior.

## 1) Dashboard responsibilities

Dashboard is a role-aware control center for authenticated users. It handles:

- Overview metrics (properties count, avg rating, total reviews, message count)
- Listing creation (owner-only)
- Listing deletion (owner-only)
- Reviews panel
- Message panel shortcut

## 2) Core dashboard state model

Important state groups in dashboard logic:

- UI state: active tab, loading state, submit/delete status
- Data state: `myProperties`, `myReviews`, `messageCount`
- Form state: listing creation form fields

This keeps display logic and mutation logic separated enough for predictable re-renders.

## 3) Data loading flow (`loadDashboardData`)

When dashboard mounts:

1. Check authenticated user
2. If mock mode enabled:
   - Build owner listings from mock base + localStorage additions
   - Load owner reviews from mock data
   - Count related messages from mock data
3. Else (Supabase mode):
   - Query `properties` by `owner_id = current user`
   - Query `reviews` by `reviewed_user_id = current user`
   - Query message count from `messages` table
   - Resolve reviewer profile info in a second query for name/role mapping
4. Map backend rows to UI-specific card models

This approach keeps page rendering independent from raw DB schema.

## 4) Listing creation flow (`handleCreateListing`)

Validation and role gate:

- If not logged in: stop
- If logged in but not owner: show destructive toast and stop

On submit:

- Parse amenities from comma-separated input into array
- Mock mode:
  - Build local listing with generated id
  - Store in localStorage
- Supabase mode:
  - Insert into `properties`
  - Numeric conversion for price/bed/bath/area
  - Optional image handling (`image` and `images` array)

Finally:

- Reset form
- Show success toast
- Reload dashboard data to reflect latest state

## 5) Listing deletion flow (`handleDeleteListing`)

- Confirmation dialog to prevent accidental delete
- Mock mode: remove from localStorage
- Supabase mode: delete only where `id` matches AND `owner_id` = current user
- Reload data and show toast

The `owner_id` condition is an important ownership safety check at query level.

## 6) Why dashboard design is judge-friendly

- Supports both real and mock environments
- Has clear owner-only mutation boundaries
- Uses typed view models (`PropertyCardData`, `ReviewCardData`)
- Combines DB data with profile enrichment for readable UI
- Gives clear user feedback with toast notifications

## 7) Related code paths judges should inspect

- Route protection and auth gate
- Auth context (mock + supabase dual mode)
- SQL policies/triggers
- Listings details and message fetch logic

These files represent core business logic and trust flow:

- `src/App.tsx`
- `src/contexts/AuthContext.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/Listings.tsx`
- `src/pages/PropertyDetails.tsx`
- `src/pages/Messages.tsx`
- `supabase/migrations/20260416080236_4f6071ed-4e55-457d-8e6c-e4d2b2ade356.sql`
- `supabase/migrations/20260416080254_228eeb0d-6753-4e88-ba13-c68b912b4b12.sql`

---

## Part 3: Detailed Beginner-Friendly Explanation (Project to Code)

If you are new, read this section as a complete guided tour.

## 1) Big picture in simple words

Think of RentRate as a rental app with memory and reputation.

- People do not only post houses.
- People also build trust history.
- Future users can make safer decisions because ratings/reviews are visible.

So the app combines:

- Marketplace behavior (listings)
- Social reputation (ratings/reviews)
- Communication (messages)

## 2) How frontend starts

Entry flow:

1. `src/main.tsx` mounts React app
2. `src/App.tsx` sets providers and routes:
   - React Query provider
   - Tooltip + Toaster providers
   - Router
   - AuthProvider
3. Pages are rendered by route

Protected pages pass through `ProtectedRoute`:

- If auth loading: wait
- If no user: redirect to `/login`
- Else: render page

## 3) Authentication concept

Auth context gives app-wide user/session/profile state.

In Supabase mode:

- Uses Supabase auth session
- Listens for auth state changes
- Fetches profile from DB table

In mock mode:

- Reads/writes users from localStorage
- Simulates session and profile objects
- Allows demo login/signup without backend

This dual mode is practical for hackathon demo and development speed.

## 4) Database design in simple mapping

Main tables:

- `profiles`: user identity + role + trust stats
- `properties`: rental listings linked to owner
- `reviews`: rating data that drives trust score
- `messages`: direct user-to-user chat records
- `user_roles`: optional admin/moderator role system

Key automation:

- On new auth user -> trigger creates profile
- On review insert/update -> trigger recalculates:
  - average rating
  - total reviews
  - trust score (`min(10, avg_rating * 2)`)

So trust score is not manually edited; it is computed from real reviews.

## 5) How listing browsing works

In `Listings` page:

- Fetch all properties from Supabase ordered by latest
- If fetch fails or empty, fallback to mock properties
- Fetch owner ratings from `profiles`
- Merge listing row + owner rating for card display
- Apply client-side filters:
  - search text
  - furnishing
  - property type

Result: user can quickly discover and filter listings.

## 6) How property details page works

In `PropertyDetails` page:

- Read route param `id`
- Load property row by id
- Build image gallery list (images array or fallback image)
- Load owner profile and latest owner reviews
- Show owner trust badge, rating, and recent comments
- If property not found in DB, fallback to mock dataset

This page combines three concepts:

- Listing information
- Owner credibility summary
- Social proof excerpts

## 7) How messaging works

In `Messages` page:

- Fetch all messages where current user is sender OR receiver
- Build conversation partner list from participant ids
- Load partner profile details (name/role/avatar)
- Show selected chat thread
- Send inserts a new row in `messages`

This enables direct owner-tenant communication inside the app.

## 8) How dashboard works step-by-step

Dashboard tabs:

- Overview: high-level numbers
- My Listings: create and manage listings
- Reviews: feedback about current user
- Messages: quick access to message center

Role behavior:

- Owner can create/delete listings
- Non-owner sees restriction message

Data behavior:

- All values are loaded once on mount and refreshed after create/delete actions

## 9) UI component strategy for beginners

Reusable components keep the app consistent:

- `Layout` wraps navbar/footer and page structure
- `PropertyCard` displays property summary
- `ReviewCard` displays review summary
- `TrustScoreBadge` visualizes trust score
- Shared UI components from `src/components/ui/*` (shadcn)

This is why code stays modular and easier to maintain.

## 10) Environment variables and setup idea

The app expects:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

And supports:

- `VITE_USE_MOCK_AUTH` (if not `false`, mock auth mode stays enabled)

So for first-time setup, you can run quickly in mock mode, then connect real backend later.

## 11) How to run the project

From root:

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run build
npm run test
npm run lint
```

## 12) Newbie reading order (recommended)

1. `src/App.tsx` (routing + providers)
2. `src/contexts/AuthContext.tsx` (auth foundation)
3. `src/pages/Index.tsx` (landing + featured listings)
4. `src/pages/Listings.tsx` (search/filter logic)
5. `src/pages/PropertyDetails.tsx` (detail + owner trust info)
6. `src/pages/Dashboard.tsx` (core business dashboard logic)
7. `src/pages/Messages.tsx` (chat flow)
8. Supabase migration SQL files (backend rules/triggers)

## 13) Final summary for beginners

This project is a full-stack trust-focused rental application where:

- Frontend is modern React + TypeScript
- Backend logic is enforced with Supabase policies and triggers
- Dashboard centralizes owner actions and personal metrics
- Ratings and trust score are first-class product features
- Mock mode makes demo and development resilient

If you understand these five ideas, you understand the core architecture of RentRate.
