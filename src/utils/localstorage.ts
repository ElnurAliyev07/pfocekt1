// utils/localStorageUtils.ts

export const setItemLocalStorage = <T>(key: string, value: T): void => {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key} to localStorage`, error);
    }
  };
  
  export const getItemLocalStorage = <T>(key: string): T | null => {
    try {
      const jsonValue = localStorage.getItem(key);
      return jsonValue ? (JSON.parse(jsonValue) as T) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage`, error);
      return null;
    }
  };
  
  export const removeItemLocalStorage = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage`, error);
    }
  };
  
  export const clearStorageLocalStorage = (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  };
  