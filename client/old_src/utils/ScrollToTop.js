import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// TODO this hook needs a unit test
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
