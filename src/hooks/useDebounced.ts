import { useState, useEffect } from 'react';

const useDebounced = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handleDebouncedValue = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handleDebouncedValue);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounced;
