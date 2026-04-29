import { useState } from "react";

const resolveInitialValue = (initialValue) =>
  initialValue instanceof Function ? initialValue() : initialValue;

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key);

    if (item) {
      return JSON.parse(item);
    }

    return resolveInitialValue(initialValue);
  });

  const setValue = (value) => {
    const nextValue = value instanceof Function ? value(storedValue) : value;

    setStoredValue(nextValue);
    window.localStorage.setItem(key, JSON.stringify(nextValue));
  };

  return [storedValue, setValue];
}
