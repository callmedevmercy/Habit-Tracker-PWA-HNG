# HNG Stage 3 Habit Tracker PWA

## Project Overview
This is a mobile-first Habit Tracker Progressive Web App (PWA) built exclusively as a frontend-focused Stage 3 technical task. The application allows users to sign up, log in, and manage daily habits by creating, editing, completing, and deleting them. 

Habit progress is tracked through a streak system, and all data is persisted locally using the browser's `localStorage`, ensuring that user data remains available even after page reloads. The app is also installable as a PWA and supports basic offline functionality through service worker caching.

## Features
- **User authentication:** Signup and Login (offline simulation).
- **Habit Management:** Create, edit, complete, and delete habits.
- **Dynamic Streaks:** Streak tracking based on daily consecutive completions, visually enhanced with fire emojis and pulsing animations.
- **Cross-Tab Synchronization:** Instantly syncs state across multiple browser tabs.
- **Local Data Persistence:** Full deterministic state persistence using `localStorage`.
- **PWA Installation:** Installable as a Progressive Web App (PWA) on mobile and desktop.
- **Offline Shell:** Service worker cache ensures the app loads even without an internet connection.
- **Accessibility (a11y):** Screen-reader friendly alerts, aria-labels, and polite live regions.
- **Responsive Design:** Mobile-first layout usable down to 320px screens.

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- LocalStorage
- Playwright (End-to-End Testing)
- Vitest (Unit & Integration Testing)
- v8 (Test Coverage)

## Project Structure
```text
habit-tracker-pwa
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── habits/
│   │   │   ├── HabitCard.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   └── HabitList.tsx
│   │   └── shared/
│   │       └── ProtectedRoute.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── constants.ts
│   │   ├── habits.ts
│   │   ├── slug.ts
│   │   ├── storage.ts
│   │   ├── streaks.ts
│   │   └── validators.ts
│   └── types/
│       ├── auth.ts
│       └── habit.ts
├── tests/
│   ├── e2e/
│   │   └── app.spec.ts
│   ├── integration/
│   │   ├── auth-flow.test.tsx
│   │   └── habit-form.test.tsx
│   ├── unit/
│   │   ├── habits.test.ts
│   │   ├── slug.test.ts
│   │   ├── streaks.test.ts
│   │   ├── storage.test.ts
│   │   └── validators.test.ts
│   └── setup.ts
```

## Setup Instructions
1. Make sure you have Node.js (v18 or later) installed.
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
This project includes unit, integration, and end-to-end (E2E) tests to ensure application reliability and correctness.

- **Run all tests**:
  ```bash
  npm run test
  ```
- **Unit tests** (Validates individual utility functions like slug generation and streaks):
  ```bash
  npm run test:unit
  ```
- **Integration tests** (Verifies how UI components and logic interact):
  ```bash
  npm run test:integration
  ```
- **End-to-End (E2E) Tests** (Simulates real user browser flows):
  ```bash
  npm run test:e2e
  ```

## Local Persistence Structure
The application uses the browser's `localStorage` for deterministic state persistence, meaning it requires no backend but fully behaves like a complete product.

### Storage Keys
- `habit-tracker-users`: Stores a JSON array of registered users containing `id`, `email`, `password`, and `createdAt`.
- `habit-tracker-session`: Stores the currently active session object with `userId` and `email`, or `null` if logged out.
- `habit-tracker-habits`: Stores a JSON array of habit objects. Each habit tracks its metadata and `completions` array (which holds unique ISO strings in YYYY-MM-DD format for each completed day).

### How It Works
- When a user signs up, their details are appended to `habit-tracker-users`.
- When a user logs in, a session token is set inside `habit-tracker-session`.
- When a habit is created, edited, completed, or deleted, `habit-tracker-habits` is surgically updated.
- All dashboard interactions utilize a `storage` event listener to instantly sync state across multiple browser tabs!

## PWA Implementation
The Progressive Web App support is implemented via a native approach to fulfill the basic offline and installability requirements:

1. **Manifest**: A `public/manifest.json` provides the PWA configuration, including the name, colors, icons (192x192 and 512x512), and `standalone` display mode.
2. **Service Worker**: A custom service worker (`public/sw.js`) caches the application shell upon installation. For any fetch event, it attempts to return the cached response, falls back to the network, and dynamically caches the shell. If the network is entirely offline, it returns the cached `/` route, preventing a hard crash.
3. **Registration**: The `layout.tsx` file includes a client-side script that registers the service worker natively on the window `load` event.

## Trade-offs and Limitations
- **Local Storage Limitations**: Data is tightly coupled to the user's specific browser and device, meaning it cannot be synchronized or recovered on another device.
- **Security**: For the scope of this Stage 3 task, passwords are saved in plain text within `localStorage`. In a real-world scenario, a secure backend with hashed passwords and secure HttpOnly cookies should be used.
- **Service Worker Caching**: The current service worker uses a basic read-through cache model for the app shell. Advanced background sync for dynamic data mutation was omitted to adhere strictly to project constraints.

## Required Test File Mapping

### Unit Tests
| Test File | Behavior Verified |
|-----------|------------------|
| `tests/unit/slug.test.ts` | Validates `getHabitSlug` logic: ensuring basic lowercase-hyphenation, collapsing spaces, and stripping non-alphanumeric characters. |
| `tests/unit/validators.test.ts` | Validates `validateHabitName` logic: rejecting empty or oversized names, and correctly trimming valid names. |
| `tests/unit/streaks.test.ts` | Validates `calculateCurrentStreak` logic using UTC math: checking behavior for empty completions, missed current day, consecutive calendar days tracking, and ignoring duplicates. |
| `tests/unit/habits.test.ts` | Validates `toggleHabitCompletion` logic: adding missing dates, removing existing ones, ensuring immutable state updates, and avoiding duplicate entries. |

### Integration Tests
| Test File | Behavior Verified |
|-----------|------------------|
| `tests/integration/auth-flow.test.tsx` | Verifies the login/signup integration with React state and storage logic: creating user sessions, rejecting duplicate signups, testing successful logins, and rejecting invalid credentials. |
| `tests/integration/habit-form.test.tsx` | Verifies the UI behavior of the dashboard & habit components: checking empty name validation, adding habits to the UI, editing fields immutably, testing explicit deletion logic via modal, and visual streak updates. |

### End-to-End (E2E) Tests
| Test File | Behavior Verified |
|-----------|------------------|
| `tests/e2e/app.spec.ts` | End-to-end verification via Playwright: Splash screen redirects, router protection, full signup/login flow to dashboard routing, habit creation, completion/streak persistence, page reload state retention, logout redirection, and checking the offline cached PWA shell logic. |

## Test Coverage Report
The project includes a robust level of automated test coverage across unit, integration, and end-to-end tests.

To generate the HTML coverage report:
```bash
npm run test:unit
```
This generates a detailed `coverage/` directory with a 98% line coverage rating across all internal logic layers. You can open `coverage/index.html` to visually verify exactly which lines were executed.
