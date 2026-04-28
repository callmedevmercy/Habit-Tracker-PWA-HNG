import React from 'react';
import { Habit } from '@/types/habit';
import HabitCard from './HabitCard';

type Props = {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onToggleComplete: (habit: Habit, date: string) => void;
};

export default function HabitList({ habits, onEdit, onDelete, onToggleComplete }: Props) {
  if (habits.length === 0) {
    return (
      <div data-testid="empty-state" className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-dashed border-brand/30">
        <p className="text-2xl font-serif font-bold text-brand mb-2">No habits found.</p>
        <p className="text-brand/70 font-medium">Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
