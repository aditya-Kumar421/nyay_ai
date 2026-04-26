# Nyay AI

Lightweight React frontend for matching petitioners with lawyers using AI-driven recommendations.

## Description

Nyay AI is a single-page React application that helps petitioners describe legal issues, get ranked lawyer recommendations, and contact or message lawyers. The app provides role-based views for petitioners and lawyers, basic account flows (register/login), case management, and an AI-powered recommendation endpoint integration.

## Tech stack

- Frontend: React 18 (Vite)
- Routing: react-router-dom v6
- HTTP client: axios
- Styling: plain CSS with a design token-based `src/styles/global.css`
- Build/tooling: Vite

## Setup guide

Prerequisites:

- Node.js 18+ and npm

Local setup:

1. Install dependencies

```bash
npm install
```

2. Set API base URL (optional):

- Edit `src/api/axios.js` to point `baseURL` to your backend, or set a `VITE_API_URL` environment variable and update the file to use `import.meta.env.VITE_API_URL`.

3. Run the dev server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

Notes:

- The frontend expects backend routes such as `/login`, `/signup`, `/recommend-lawyers`, `/search-lawyers`, `/my-cases`, `/add-case`, `/my-profile`, and `/send-message`.
- The app currently uses localStorage to store a `nyay_user` object for simple role-based routing.

## Architecture / Flow

- User flows:
	- Register / Login: POST to `/signup` or `/login`, store returned user in as `nyay_user`.
	- Petitioner dashboard: submit case details (description, budget, location) to `/recommend-lawyers` to get ranked lawyer recommendations. Searches are also saved to the petitioner's profile via `/add-case` (best-effort).
	- Search Lawyers: filter-based search calling `/search-lawyers` with query params for specialization, location, experience, fees, and rating.
	- Lawyer profile: accessible at `/my-profile?user_id=<id>`, shows lawyer details and phone (if provided) and allows sending a message via `/send-message` with `sender_id` as a query param.

- UI structure:
	- `src/App.jsx` — routing and `ProtectedRoute` wrapper.
	- `src/main.jsx` — app entry.
	- `src/api/axios.js` — centralized axios instance.
	- `src/pages/` — page components (Landing, Login, Register, PetitionerDashboard, SearchLawyers, MyCases, LawyerDashboard, MyProfile).
	- `src/components/` — smaller UI components (Navbar, FormInput, LawyerCard, ResultList, CaseForm, PetitionerNav).

## Next steps / recommendations

- Add form validation and better error handling for API responses.
- Add ESLint + Prettier and basic tests.
- Consider replacing localStorage auth with secure cookies for tokens.

---
