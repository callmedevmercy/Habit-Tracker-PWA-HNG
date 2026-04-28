import { Habit } from '../types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const uniqueCompletions = new Set(habit.completions);
  
  if (uniqueCompletions.has(date)) {
    uniqueCompletions.delete(date);
  } else {
    uniqueCompletions.add(date);
  }
  
  return {
    ...habit,
    completions: Array.from(uniqueCompletions)
  };
}
