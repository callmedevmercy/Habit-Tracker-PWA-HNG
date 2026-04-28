import React, { useState, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';

type Props = {
  initialHabit?: Habit;
  onSave: (habitData: Partial<Habit>) => void;
  onCancel: () => void;
};

export default function HabitForm({ initialHabit, onSave, onCancel }: Props) {
  const [name, setName] = useState(initialHabit?.name || '');
  const [description, setDescription] = useState(initialHabit?.description || '');
  const [frequency, setFrequency] = useState<'daily'>('daily');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(initialHabit?.name || '');
    setDescription(initialHabit?.description || '');
  }, [initialHabit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error || 'Invalid name');
      return;
    }
    
    onSave({
      name: validation.value,
      description: description.trim(),
      frequency,
    });
  };

  return (
    <form onSubmit={handleSubmit} data-testid="habit-form" className="bg-white/80 backdrop-blur-sm border border-brand/10 p-7 rounded-xl shadow-md mb-8">
      <h2 className="text-3xl font-serif font-bold mb-6 text-brand">{initialHabit ? 'Edit Habit' : 'Create Habit'}</h2>
      {error && <div role="alert" aria-live="assertive" className="text-red-500 mb-5 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
      
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2 text-brand">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="habit-name-input"
          className="w-full border border-brand/20 rounded-lg p-3 text-brand bg-white/50 focus:bg-white focus:ring-2 focus:ring-brand/40 outline-none transition"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium mb-2 text-brand">Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          data-testid="habit-description-input"
          className="w-full border border-brand/20 rounded-lg p-3 text-brand bg-white/50 focus:bg-white focus:ring-2 focus:ring-brand/40 outline-none transition"
          rows={3}
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2 text-brand">Frequency</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as 'daily')}
          data-testid="habit-frequency-select"
          className="w-full border border-brand/20 rounded-lg p-3 text-brand bg-white/50 focus:bg-white focus:ring-2 focus:ring-brand/40 outline-none transition"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-brand/20 text-brand rounded-lg font-medium hover:bg-brand/5 transition">Cancel</button>
        <button type="submit" data-testid="habit-save-button" className="px-6 py-2.5 bg-brand text-background rounded-lg font-medium hover:bg-brand-light transition shadow-md">
          Save
        </button>
      </div>
    </form>
  );
}
