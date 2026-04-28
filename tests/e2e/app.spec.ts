import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/login', { timeout: 5000 });
    await expect(page.url()).toContain('/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@test.com' }));
    });
    await page.goto('/');
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page.url()).toContain('/dashboard');
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login', { timeout: 5000 });
    await expect(page.url()).toContain('/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('newuser@test.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([{ id: '1', email: 'user1@test.com', password: 'password123', createdAt: '2023-01-01' }, { id: '2', email: 'user2@test.com', password: 'password123', createdAt: '2023-01-01' }]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'h1', userId: '1', name: 'User 1 Habit', description: '', frequency: 'daily', createdAt: '2023-01-01', completions: [] },
        { id: 'h2', userId: '2', name: 'User 2 Habit', description: '', frequency: 'daily', createdAt: '2023-01-01', completions: [] }
      ]));
    });
    
    await page.getByTestId('auth-login-email').fill('user1@test.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();
    
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('habit-card-user-1-habit')).toBeVisible();
    await expect(page.getByTestId('habit-card-user-2-habit')).not.toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@test.com' }));
    });
    await page.goto('/dashboard');
    
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Morning Jog');
    await page.getByTestId('habit-save-button').click();
    
    await expect(page.getByTestId('habit-card-morning-jog')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@test.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'h1', userId: '1', name: 'Drink Water', description: '', frequency: 'daily', createdAt: '2023-01-01', completions: [] }
      ]));
    });
    await page.goto('/dashboard');
    
    await expect(page.getByTestId('habit-streak-drink-water')).toHaveText('0');
    await page.getByTestId('habit-complete-drink-water').click();
    await expect(page.getByTestId('habit-streak-drink-water')).toHaveText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@test.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'h1', userId: '1', name: 'Persisted Habit', description: '', frequency: 'daily', createdAt: '2023-01-01', completions: [] }
      ]));
    });
    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-card-persisted-habit')).toBeVisible();
    
    await page.reload();
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-persisted-habit')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@test.com' }));
    });
    await page.goto('/dashboard');
    
    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('**/login');
    await expect(page.url()).toContain('/login');
    
    const session = await page.evaluate(() => localStorage.getItem('habit-tracker-session'));
    expect(session).toBeNull();
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    await page.goto('/');
    // Wait for the service worker to register
    await page.waitForTimeout(2000); 
    
    await context.setOffline(true);
    
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    
    await context.setOffline(false);
  });
});
