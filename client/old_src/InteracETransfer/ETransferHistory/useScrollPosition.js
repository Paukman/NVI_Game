import { useState, useLayoutEffect } from "react";

// Simple Hook to remember/restore a scroll position (not across page reloads)
const useScrollPosition = () => {
  const [scroll, setScroll] = useState(0);
  const [applyScroll, setApplyScroll] = useState(false);

  useLayoutEffect(() => {
    if (applyScroll) {
      window.scrollTo(0, scroll);
      setApplyScroll(false);
    }
  }, [applyScroll, scroll]);

  const rememberScrollPosition = () => {
    setScroll(window.scrollY);
  };

  const restoreScrollPosition = () => {
    setApplyScroll(true);
  };

  return [rememberScrollPosition, restoreScrollPosition];
};

export default useScrollPosition;
