import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    let parsedValue;
    try {
      parsedValue = storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (e) {
      console.error(`Error parsing JSON for key "${key}":`, e);
      parsedValue = initialValue;
    }
    return parsedValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
