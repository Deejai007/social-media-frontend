# Copilot Instructions - Treiwo Social Media Frontend

## Project Overview

This is a React 18 + TypeScript social media frontend built with **Vite**, **Redux Toolkit** (with Redux Persist), **TailwindCSS**, and **React Router v6**. The app communicates with a backend API via axios with JWT authentication and cookie-based sessions.

## Architecture Patterns

### Redux State Structure

State is organized into three main slices (see [src/redux/reducers/index.ts](src/redux/reducers/index.ts)):

- **user**: Authentication state (login/profile data) - persisted to localStorage
- **post**: Post feed and individual post data
- **follow**: Follow relationships and follow requests

**LOGOUT handling**: When `LOGOUT` action is dispatched, all Redux state is cleared (see [src/redux/reducers/index.ts](src/redux/reducers/index.ts#L15)).

### API Configuration

[src/utils/axiosconfig.ts](src/utils/axiosconfig.ts) creates axios instance with:

- `baseURL` from `VITE_SERVER_URL` environment variable
- `withCredentials: true` for JWT cookies in every request
- Automatic Content-Type application/json

When adding new API calls, import and use `axiosApi` rather than creating new axios instances.

### Page Layout Structure

[src/components/App.tsx](src/components/App.tsx) defines an `IncludeNav` layout that wraps authenticated routes with [TopNav](src/components/TopNav.tsx) and [SideNav](src/components/SideNav.tsx). Protected routes use [ProtectedRoute](src/components/ProtectedRoute.tsx) component for access control.

### Component File Organization

- **components/**: Reusable UI components (navigation, modals like FollowListModel, PopOvers)
- **pages/**: Full page components (Home, Profile, Chat, etc.) - some organized in subdirectories (Chat/, Create/, Follow/, ForgotPassword/, Login/)
- **redux/**: Actions, reducers (combine all with combineReducers), store setup, and TypeScript types

## Critical Development Workflows

### Build & Development Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173 default)
npm run build        # TypeScript check + Vite production build
npm run serve        # Preview production build locally
npm run test         # Run Vitest tests (includes test.tsx files)
npm run test:ui      # Run Vitest with UI dashboard
npm run lint         # ESLint check (no warnings allowed: --max-warnings=0)
npm run typecheck    # TypeScript-only type checking
```

### TypeScript Configuration

- **baseUrl** set to `./src` in [tsconfig.json](tsconfig.json) - import from `components/`, `pages/`, `redux/`, `utils/` without relative paths
- **strict mode** enabled - all types must be explicit
- JSX set to "react-jsx" (automatic runtime)
- Test files automatically included via `vitest/globals` types

### Testing Setup

Tests use **Vitest** + **React Testing Library** (see [vite.config.ts](vite.config.ts#L7)):

- Test files must match pattern `**/test.{ts,tsx}`
- Environment: `happy-dom` (lightweight DOM)
- Setup file: `.vitest/setup` (create if extending with custom matchers)

## Project-Specific Conventions

### Environment Variables

Only `VITE_SERVER_URL` is required (backend API endpoint). Define in `.env.local`:

```
VITE_SERVER_URL=http://localhost:8967
```

### Authentication Flow

1. User logs in/registers → JWT stored as HTTP-only cookie
2. All axios requests include credentials automatically
3. On LOGOUT action → Redux state cleared, session ends
4. [ProtectedRoute](src/components/ProtectedRoute.tsx) checks auth state before rendering

### Image Storage

Uses **Cloudinary** for image uploads (configured in relevant action creators, e.g., [src/redux/actions/PostActions.ts](src/redux/actions/PostActions.ts)).

### Styling Convention

- **TailwindCSS 3** only - no custom CSS files unless absolutely necessary
- ESLint includes `eslint-plugin-tailwindcss` for class validation
- Global styles imported in [src/index.tsx](src/index.tsx) (`tailwindcss/tailwind.css`)

### Toast Notifications

[react-toastify](https://frostdeveloper.com/blog/react-toastify/) is configured in [src/index.tsx](src/index.tsx) and already exported in components. Use for feedback (success, errors, info).

## Common Workflows

### Adding a New Page

1. Create component in `src/pages/PageName.tsx`
2. Add route in [src/components/App.tsx](src/components/App.tsx) Routes
3. If authenticated, nest inside ProtectedRoute wrapper with IncludeNav layout
4. Import Redux hooks: `useAppDispatch`, `useAppSelector` from store types

### Creating Redux Actions

- Place async thunks in `src/redux/actions/*.ts`
- Follow pattern: define types in corresponding `src/redux/types/*.ts`
- Dispatch actions in components via `useAppDispatch` hook
- Map state via `useAppSelector` with typed selectors

### Adding API Endpoints

1. Import `axiosApi` from [src/utils/axiosconfig.ts](src/utils/axiosconfig.ts)
2. Create thunk action in `src/redux/actions/`
3. Handle responses in reducer; store error state for UI feedback
4. Cookie-based auth happens automatically (no manual header setup needed)

## Key Files to Review

- **[src/redux/store/store.ts](src/redux/store/store.ts)**: Redux Persist + Redux Thunk middleware config
- **[src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)**: Auth guard implementation
- **[src/pages/Login/Login.tsx](src/pages/Login/Login.tsx)**: Authentication flow example
- **[vite.config.ts](vite.config.ts)**: Vite + SWC React plugin + tsconfig-paths
