import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Web-compatible storage adapter
const webStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

// Export the appropriate storage based on platform
export const storage = Platform.OS === 'web' ? webStorage : AsyncStorage;
