import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('handles invalid JSON gracefully', () => {
    localStorage.setItem('bad-key', '{invalid-json');
    const result = getStorageItem('bad-key');
    expect(result).toBeNull();
  });

  it('returns null if item does not exist', () => {
    const result = getStorageItem('missing-key');
    expect(result).toBeNull();
  });

  it('sets and removes items correctly', () => {
    setStorageItem('test-key', { foo: 'bar' });
    expect(getStorageItem('test-key')).toEqual({ foo: 'bar' });
    
    removeStorageItem('test-key');
    expect(getStorageItem('test-key')).toBeNull();
  });
});
