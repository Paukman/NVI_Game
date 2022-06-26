import { useRef, useState, useEffect } from "react";
import useIsMounted from "utils/hooks/useIsMounted";
import throttle from "../throttle";

const useScroll = (delay = 1000) => {
  const isMounted = useIsMounted();
  const lastScrollTop = useRef(0);
  const bodyOffset = useRef(document.body.getBoundingClientRect());
  const [scrollY, setScrollY] = useState(bodyOffset.current.top);
  const [scrollX, setScrollX] = useState(bodyOffset.current.left);
  const [scrollDirection, setScrollDirection] = useState();

  useEffect(() => {
    const listener = () => {
      if (isMounted()) {
        bodyOffset.current = document.body.getBoundingClientRect();
        setScrollY(-bodyOffset.current.top);
        setScrollX(bodyOffset.current.left);
        setScrollDirection(
          lastScrollTop.current > -bodyOffset.current.top ? "down" : "up"
        );
        lastScrollTop.current = -bodyOffset.current.top;
      }
    };
    window.addEventListener("scroll", throttle(delay, listener));
    return () => {
      window.removeEventListener("scroll", listener);
      return window;
    };
  }, [delay, isMounted]);

  return [scrollY, scrollX, scrollDirection, lastScrollTop.current];
};

export default useScroll;
