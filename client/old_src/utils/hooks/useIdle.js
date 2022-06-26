import { useEffect, useState, useRef } from "react";
import useIsMounted from "utils/hooks/useIsMounted";
import debounce from "../debounce";

const TIMEOUT = 30000;
const DEBOUNCE_TIME = 2000;
const MOUSE_MOVE = "mousemove";
const KEY_DOWN = "keydown";
const SCROLL = "scroll";

const useIdle = (timeout = TIMEOUT) => {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutId = useRef(null);

  const isMounted = useIsMounted();

  useEffect(() => {
    timeoutId.current = null;
    const setTimer = () => {
      timeoutId.current = setTimeout(() => {
        if (isMounted()) {
          setIsIdle(true);
        }
      }, timeout);
    };
    const resetTimeout = () => {
      clearTimeout(timeoutId.current);
      setIsIdle(false);
      setTimer();
    };
    window.addEventListener(MOUSE_MOVE, debounce(DEBOUNCE_TIME, resetTimeout));
    window.addEventListener(KEY_DOWN, debounce(DEBOUNCE_TIME, resetTimeout));
    window.addEventListener(SCROLL, debounce(DEBOUNCE_TIME, resetTimeout));
    setTimer();
    return () => {
      window.removeEventListener(MOUSE_MOVE, resetTimeout);
      window.removeEventListener(KEY_DOWN, resetTimeout);
      window.removeEventListener(SCROLL, resetTimeout);
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    };
  }, [isMounted, timeout]);
  return [isIdle, timeoutId, isMounted];
};

export default useIdle;
