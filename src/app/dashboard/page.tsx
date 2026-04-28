'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { getSession, clearSession } from '@/lib/auth';
import { STORAGE_KEYS, ROUTES } from '@/lib/constants';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import { Habit } from '@/types/habit';
import HabitList from '@/components/habits/HabitList';
import HabitForm from '@/components/habits/HabitForm';
import { toggleHabitCompletion } from '@/lib/habits';

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();

  const loadHabits = useCallback(() => {
    const session = getSession();
    if (session) {
      setUserId(session.userId);
      const allHabits = getStorageItem<Habit[]>(STORAGE_KEYS.HABITS) || [];
      setHabits(allHabits.filter(h => h.userId === session.userId));
    }
  }, []);

  useEffect(() => {
    loadHabits();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.HABITS || e.key === STORAGE_KEYS.SESSION) {
        loadHabits();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadHabits]);

  const saveHabitsToStorage = useCallback((newHabits: Habit[]) => {
    setHabits(newHabits);
    const allHabits = getStorageItem<Habit[]>(STORAGE_KEYS.HABITS) || [];
    const otherHabits = allHabits.filter(h => h.userId !== userId);
    setStorageItem(STORAGE_KEYS.HABITS, [...otherHabits, ...newHabits]);
  }, [userId]);

  const handleSaveHabit = useCallback((habitData: Partial<Habit>) => {
    if (editingHabit) {
      const updatedHabits = habits.map(h => 
        h.id === editingHabit.id 
          ? { ...h, name: habitData.name!, description: habitData.description || '', frequency: habitData.frequency! }
          : h
      );
      saveHabitsToStorage(updatedHabits);
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        userId,
        name: habitData.name!,
        description: habitData.description || '',
        frequency: habitData.frequency as 'daily',
        createdAt: new Date().toISOString(),
        completions: [],
      };
      saveHabitsToStorage([...habits, newHabit]);
    }
    setIsFormOpen(false);
    setEditingHabit(undefined);
  }, [editingHabit, habits, saveHabitsToStorage, userId]);

  const handleDeleteHabit = useCallback((habitId: string) => {
    const updatedHabits = habits.filter(h => h.id !== habitId);
    saveHabitsToStorage(updatedHabits);
  }, [habits, saveHabitsToStorage]);

  const handleToggleComplete = useCallback((habit: Habit, date: string) => {
    const updatedHabit = toggleHabitCompletion(habit, date);
    const updatedHabits = habits.map(h => h.id === habit.id ? updatedHabit : h);
    saveHabitsToStorage(updatedHabits);
  }, [habits, saveHabitsToStorage]);

  const handleLogout = useCallback(() => {
    clearSession();
    router.replace(ROUTES.LOGIN);
  }, [router]);

  return (
    <ProtectedRoute>
      <div data-testid="dashboard-page" className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4 sm:gap-0">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand">My Habits</h1>
            <button
              onClick={handleLogout}
              data-testid="auth-logout-button"
              className="w-full sm:w-auto px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-brand/20 text-brand rounded-lg font-medium hover:bg-white shadow-sm transition"
              aria-label="Log out"
            >
              Logout
            </button>
          </div>

          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              data-testid="create-habit-button"
              className="w-full sm:w-auto mb-8 px-6 py-3 bg-brand text-background rounded-lg font-medium shadow-md hover:bg-brand-light transition"
              aria-expanded={isFormOpen}
            >
              Create Habit
            </button>
          )}

          {isFormOpen && (
            <HabitForm
              initialHabit={editingHabit}
              onSave={handleSaveHabit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingHabit(undefined);
              }}
            />
          )}

          <HabitList
            habits={habits}
            onEdit={(h) => {
              setEditingHabit(h);
              setIsFormOpen(true);
            }}
            onDelete={handleDeleteHabit}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
