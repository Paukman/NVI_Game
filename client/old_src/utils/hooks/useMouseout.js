import { useState, useRef, useEffect } from "react";
import useIsMounted from "utils/hooks/useIsMounted";

const useMouseout = (mouseRef, delay = 1000) => {
  const [mouseOut, setMouseout] = useState(null);
  const isMounted = useIsMounted();
  const timeoutId = useRef(null);

  useEffect(() => {
    const node = mouseRef.current;

    const handleMouseOut = () => {
      timeoutId.current = setTimeout(() => {
        if (isMounted()) {
          setMouseout(true);
        }
      }, delay);
    };
    const handleMouseOver = () => {
      if (isMounted()) {
        setMouseout(false);
      }
      clearTimeout(timeoutId.current);
    };
    if (node) {
      node.addEventListener("mouseout", handleMouseOut);
      node.addEventListener("mouseover", handleMouseOver);
    }
    return () => {
      node.removeEventListener("mouseover", handleMouseOver);
      node.removeEventListener("mouseout", handleMouseOut);
    };
  }, [mouseRef, delay, isMounted]);

  return [mouseOut, delay, timeoutId];
};

export default useMouseout;
