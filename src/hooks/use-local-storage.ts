import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return initialValue;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(() => readValue());

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);

      if (typeof window === "undefined") {
        return;
      }

      window.localStorage.setItem(key, JSON.stringify(value));
    },
    [key],
  );

  const removeValue = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [initialValue, key]);

  return { value: storedValue, setValue, removeValue };
}
