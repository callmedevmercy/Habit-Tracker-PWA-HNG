import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import DashboardPage from '@/app/dashboard/page';
import { STORAGE_KEYS } from '@/lib/constants';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() })
}));

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ userId: '1', email: 'test@test.com' }));
  });

  it('shows a validation error when habit name is empty', () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByTestId('create-habit-button'));
    fireEvent.click(screen.getByTestId('habit-save-button'));
    
    expect(screen.getByText('Habit name is required')).toBeInTheDocument();
  });

  it('creates a new habit and renders it in the list', () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByTestId('create-habit-button'));
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'Drink Water' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));
    
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
  });

  it('edits an existing habit and preserves immutable fields', () => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([{
      id: 'h1', userId: '1', name: 'Read', description: '', frequency: 'daily', createdAt: '2023-01-01', completions: ['2023-01-01']
    }]));
    
    render(<DashboardPage />);
    fireEvent.click(screen.getByTestId('habit-edit-read'));
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'Read Books' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));
    
    expect(screen.getByTestId('habit-card-read-books')).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '[]');
    expect(stored[0].id).toBe('h1');
    expect(stored[0].createdAt).toBe('2023-01-01');
    expect(stored[0].completions).toContain('2023-01-01');
  });

  it('deletes a habit only after explicit confirmation', () => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([{
      id: 'h1', userId: '1', name: 'Read', description: '', frequency: 'daily', createdAt: '2023-01-01', completions: []
    }]));
    
    render(<DashboardPage />);
    expect(screen.getByTestId('habit-card-read')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('habit-delete-read'));
    expect(screen.getByTestId('habit-card-read')).toBeInTheDocument(); // still there
    
    fireEvent.click(screen.getByTestId('confirm-delete-button'));
    expect(screen.queryByTestId('habit-card-read')).not.toBeInTheDocument();
  });

  it('toggles completion and updates the streak display', () => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([{
      id: 'h1', userId: '1', name: 'Read', description: '', frequency: 'daily', createdAt: '2023-01-01', completions: []
    }]));
    
    render(<DashboardPage />);
    const streakElement = screen.getByTestId('habit-streak-read');
    expect(streakElement).toHaveTextContent('0');
    
    fireEvent.click(screen.getByTestId('habit-complete-read'));
    expect(streakElement).toHaveTextContent('1');
    
    fireEvent.click(screen.getByTestId('habit-complete-read'));
    expect(streakElement).toHaveTextContent('0');
  });
});
