import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], '2023-01-01')).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak(['2023-01-01'], '2023-01-02')).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    expect(calculateCurrentStreak(['2023-01-01', '2023-01-02', '2023-01-03'], '2023-01-03')).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    expect(calculateCurrentStreak(['2023-01-01', '2023-01-01', '2023-01-02'], '2023-01-02')).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    expect(calculateCurrentStreak(['2023-01-01', '2023-01-03'], '2023-01-03')).toBe(1);
  });
});
