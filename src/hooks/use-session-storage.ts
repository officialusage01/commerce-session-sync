
import { useState, useEffect } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get from session storage first, then use initial value as fallback
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from session storage:', error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that
  // persists the new value to sessionStorage
  const setValue = (value: T) => {
    try {
      // Allow value to be a function
      const valueToStore = 
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to session storage
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to session storage:', error);
    }
  };
  
  return [storedValue, setValue];
}
