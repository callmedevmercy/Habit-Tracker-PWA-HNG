import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';

describe('toggleHabitCompletion', () => {
  const mockHabit: Habit = {
    id: '1',
    userId: 'u1',
    name: 'Read',
    description: '',
    frequency: 'daily',
    createdAt: '2023-01-01',
    completions: ['2023-01-01']
  };

  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, '2023-01-02');
    expect(result.completions).toContain('2023-01-02');
    expect(result.completions.length).toBe(2);
  });

  it('removes a completion date when the date already exists', () => {
    const result = toggleHabitCompletion(mockHabit, '2023-01-01');
    expect(result.completions).not.toContain('2023-01-01');
    expect(result.completions.length).toBe(0);
  });

  it('does not mutate the original habit object', () => {
    toggleHabitCompletion(mockHabit, '2023-01-02');
    expect(mockHabit.completions.length).toBe(1);
    expect(mockHabit.completions).not.toContain('2023-01-02');
  });

  it('does not return duplicate completion dates', () => {
    const duplicateHabit: Habit = { ...mockHabit, completions: ['2023-01-01', '2023-01-01'] };
    const result = toggleHabitCompletion(duplicateHabit, '2023-01-02');
    expect(result.completions).toEqual(['2023-01-01', '2023-01-02']);
  });
});
