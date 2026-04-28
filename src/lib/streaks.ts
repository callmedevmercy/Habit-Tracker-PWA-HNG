export function calculateCurrentStreak(completions: string[], today?: string): number {
  if (!completions || completions.length === 0) return 0;
  
  const currentDateStr = today || new Date().toISOString().split('T')[0];
  
  const uniqueDates = Array.from(new Set(completions)).sort();
  
  if (!uniqueDates.includes(currentDateStr)) {
    return 0;
  }
  
  let streak = 0;
  let currentDate = new Date(currentDateStr);
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (uniqueDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}
