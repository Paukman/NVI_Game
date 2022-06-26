import { useState, useEffect } from "react";
import useIsMounted from "utils/hooks/useIsMounted";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const isMounted = useIsMounted();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (isMounted()) {
        setDebouncedValue(value);
      }
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, isMounted]);

  return { debouncedValue, value };
};

export default useDebounce;
