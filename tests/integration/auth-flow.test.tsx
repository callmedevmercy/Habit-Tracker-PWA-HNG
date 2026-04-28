import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import { getSession, getUsers } from '@/lib/auth';
import { STORAGE_KEYS } from '@/lib/constants';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}));

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
  });

  it('submits the signup form and creates a session', () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    expect(getUsers().length).toBe(1);
    expect(getSession()).not.toBeNull();
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for duplicate signup email', () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([{ id: '1', email: 'test@test.com', password: 'password123', createdAt: '2023-01-01' }]));
    
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    expect(screen.getByText('User already exists')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('submits the login form and stores the active session', () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([{ id: '1', email: 'test@test.com', password: 'password123', createdAt: '2023-01-01' }]));
    
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    expect(getSession()).toEqual({ userId: '1', email: 'test@test.com' });
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for invalid login credentials', () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
