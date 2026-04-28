'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, saveUsers, setSession } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const existingUser = users.find(u => u.email === normalizedEmail);

    if (existingUser) {
      setError('User already exists');
      return;
    }

    const newUser = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString()
    };

    saveUsers([...users, newUser]);
    setSession({ userId: newUser.id, email: newUser.email });
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <div role="alert" aria-live="assertive" className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1.5 text-brand" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="auth-signup-email"
          className="w-full border border-brand/20 rounded-lg p-2.5 text-brand bg-white/50 focus:bg-white focus:ring-2 focus:ring-brand/40 outline-none transition"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5 text-brand" htmlFor="password">Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="auth-signup-password"
            className="w-full border border-brand/20 rounded-lg p-2.5 pr-12 text-brand bg-white/50 focus:bg-white focus:ring-2 focus:ring-brand/40 outline-none transition"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand/50 hover:text-brand transition flex items-center justify-center p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        data-testid="auth-signup-submit"
        className="mt-2 bg-brand text-background py-3 rounded-lg font-medium hover:bg-brand-light transition shadow-md"
      >
        Sign Up
      </button>

      <p className="text-sm text-center text-brand/70 mt-2">
        Already have an account? <a href="/login" className="text-brand font-bold hover:underline">Log in</a>
      </p>
    </form>
  );
}
