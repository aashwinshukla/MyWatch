import { useState, useEffect } from 'react';

/**
 * Debounce a value - delays updating until user stops changing it
 * @param {any} value - The value to debounce (e.g. search input)
 * @param {number} delay - Delay in milliseconds (default 500ms)
 * @returns {any} - The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function - cancels the timer if value changes again
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue;
}
