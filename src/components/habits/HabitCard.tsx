import React, { useState, memo, useCallback } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';

type Props = {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onToggleComplete: (habit: Habit, date: string) => void;
};

const HabitCard = memo(function HabitCard({ habit, onEdit, onDelete, onToggleComplete }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const currentStreak = calculateCurrentStreak(habit.completions, today);

  const handleDelete = useCallback(() => {
    if (showDeleteConfirm) {
      onDelete(habit.id);
    } else {
      setShowDeleteConfirm(true);
    }
  }, [showDeleteConfirm, onDelete, habit.id]);

  const handleEdit = useCallback(() => onEdit(habit), [onEdit, habit]);
  const handleToggle = useCallback(() => onToggleComplete(habit, today), [onToggleComplete, habit, today]);

  return (
    <div data-testid={`habit-card-${slug}`} className={`border rounded-xl p-6 mb-4 shadow-sm transition-all ${isCompletedToday ? 'bg-brand/10 border-brand/30' : 'bg-white/70 backdrop-blur-sm border-brand/10'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-2xl font-serif font-bold text-brand">{habit.name}</h3>
          {habit.description && <p className="text-brand/80 mt-1.5 leading-relaxed">{habit.description}</p>}
          <div className="mt-4 text-sm font-medium text-brand/70 uppercase tracking-wide flex items-center" aria-live="polite">
            Streak: <span data-testid={`habit-streak-${slug}`} className="font-bold text-brand text-lg ml-1 mr-1.5">{currentStreak}</span>
            {currentStreak > 0 && <span aria-hidden="true" className="text-lg animate-pulse">🔥</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
          <button
            onClick={handleToggle}
            data-testid={`habit-complete-${slug}`}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm ${isCompletedToday ? 'bg-brand text-background hover:bg-brand-light' : 'bg-white border border-brand/20 text-brand hover:bg-brand/5'}`}
            aria-label={isCompletedToday ? `Unmark ${habit.name} for today` : `Mark ${habit.name} complete for today`}
            aria-pressed={isCompletedToday}
          >
            {isCompletedToday ? 'Completed' : 'Complete'}
          </button>
          <button
            onClick={handleEdit}
            data-testid={`habit-edit-${slug}`}
            className="px-5 py-2 bg-white border border-brand/20 text-brand rounded-lg text-sm font-medium hover:bg-brand/5 transition shadow-sm"
            aria-label={`Edit ${habit.name}`}
          >
            Edit
          </button>
          {showDeleteConfirm ? (
            <button
              onClick={handleDelete}
              data-testid="confirm-delete-button"
              className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-sm"
              aria-label={`Confirm delete ${habit.name}`}
            >
              Confirm Delete
            </button>
          ) : (
            <button
              onClick={handleDelete}
              data-testid={`habit-delete-${slug}`}
              className="px-5 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition shadow-sm"
              aria-label={`Delete ${habit.name}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default HabitCard;
