import { Session, User } from '../types/auth';
import { STORAGE_KEYS } from './constants';
import { getStorageItem, setStorageItem, removeStorageItem } from './storage';

export const getSession = (): Session | null => {
  return getStorageItem<Session>(STORAGE_KEYS.SESSION);
};

export const setSession = (session: Session): void => {
  setStorageItem(STORAGE_KEYS.SESSION, session);
};

export const clearSession = (): void => {
  removeStorageItem(STORAGE_KEYS.SESSION);
};

export const getUsers = (): User[] => {
  return getStorageItem<User[]>(STORAGE_KEYS.USERS) || [];
};

export const saveUsers = (users: User[]): void => {
  setStorageItem(STORAGE_KEYS.USERS, users);
};
