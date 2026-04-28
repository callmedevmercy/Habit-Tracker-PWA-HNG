# Habit Tracker PWA

## Project Overview
The Habit Tracker PWA is a mobile-first Progressive Web Application designed for tracking daily habits. Built exclusively as a frontend-focused Stage 3 technical task, the app allows users to create accounts, manage a habit checklist, and track consecutive daily streaks—all securely stored within the local browser using `localStorage`.

## Setup Instructions
1. Ensure you have Node.js and `npm` installed.
2. Clone or download this repository.
3. Install the dependencies by running:
   ```bash
   npm install
   ```
4. Install Playwright browsers (for E2E tests):
   ```bash
   npx playwright install
   ```

## Run Instructions
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

To create an optimized production build:
```bash
npm run build
npm run start
```

## Test Instructions
The project uses Vitest for Unit and Integration tests, and Playwright for End-to-End tests.

- **Run all tests (Unit, Integration, E2E)**:
  ```bash
  npm run test
  ```
- **Run Unit tests with coverage**:
  ```bash
  npm run test:unit
  ```
- **Run Integration tests**:
  ```bash
  npm run test:integration
  ```
- **Run End-to-End tests**:
  ```bash
  npm run test:e2e
  ```

## Local Persistence Structure
The application uses the browser's `localStorage` for deterministic state persistence, meaning it requires no backend but fully behaves like a complete product.

Required storage keys used:
- `habit-tracker-users`: Stores a JSON array of registered users containing `id`, `email`, `password`, and `createdAt`.
- `habit-tracker-session`: Stores the currently active session object with `userId` and `email`, or `null` if logged out.
- `habit-tracker-habits`: Stores a JSON array of habit objects. Each habit tracks its metadata and `completions` array (which holds unique ISO strings in YYYY-MM-DD format for each completed day).

## PWA Support Implementation
The Progressive Web App support is implemented via a native approach to fulfill the basic offline and installability requirements:
1. **Manifest**: A `public/manifest.json` provides the PWA configuration, including the name, colors, icons (192x192 and 512x512), and `standalone` display mode.
2. **Service Worker**: A custom service worker (`public/sw.js`) caches the application shell upon installation. For any fetch event, it attempts to return the cached response, falls back to the network, and dynamically caches the shell. If the network is entirely offline, it returns the cached `/` route, preventing a hard crash.
3. **Registration**: The `layout.tsx` file includes a client-side script that registers the service worker natively on the window `load` event.

## Trade-offs or Limitations
- **Local Storage Limitations**: Data is tightly coupled to the user's specific browser and device, meaning it cannot be synchronized or recovered on another device.
- **Security**: For the scope of this Stage 3 task, passwords are saved in plain text within `localStorage`. In a real-world scenario, a secure backend with hashed passwords and secure HttpOnly cookies should be used.
- **Service Worker Caching**: The current service worker uses a basic read-through cache model for the app shell. Depending on Next.js App Router's client-side fetching mechanism, deeper nested offline navigation might require more complex workbox caching strategies.

## Required Tests Mapping

| Test File | Behavior Verified |
|-----------|------------------|
| `tests/unit/slug.test.ts` | Validates `getHabitSlug` logic: ensuring basic lowercase-hyphenation, collapsing spaces, and stripping non-alphanumeric characters. |
| `tests/unit/validators.test.ts` | Validates `validateHabitName` logic: rejecting empty or oversized names, and correctly trimming valid names. |
| `tests/unit/streaks.test.ts` | Validates `calculateCurrentStreak` logic: checking behavior for empty completions, missed current day, consecutive calendar days tracking, and ignoring duplicates. |
| `tests/unit/habits.test.ts` | Validates `toggleHabitCompletion` logic: adding missing dates, removing existing ones, ensuring immutable state updates, and avoiding duplicate entries. |
| `tests/integration/auth-flow.test.tsx` | Verifies the login/signup integration with React state and storage logic: creating user sessions, rejecting duplicate signups, testing successful logins, and rejecting invalid credentials. |
| `tests/integration/habit-form.test.tsx` | Verifies the UI behavior of the dashboard & habit components: checking empty name validation, adding habits to the UI, editing fields immutably, testing explicit deletion logic, and visual streak updates on completion toggle. |
| `tests/e2e/app.spec.ts` | End-to-end verification via browser testing: Splash screen redirects, router protection, full signup/login flow to dashboard routing, habit creation, completion/streak persistence, page reload state retention, logout redirection, and checking the offline cached PWA shell logic. |
