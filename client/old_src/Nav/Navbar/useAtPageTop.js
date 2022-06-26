import { useState, useEffect } from "react";

const useAtPageTop = ref => {
  const [atPageTop, setAtPageTop] = useState(true);

  useEffect(() => {
    // 120px prevents firing callback at very small screen widths. We only care about Y axis changes.
    const observerOptions = {
      threshold: [1],
      rootMargin: "38px 120px 0px 0px"
    };

    const observer = new IntersectionObserver(entries => {
      const [{ intersectionRatio, isIntersecting }] = entries;
      if (intersectionRatio) {
        setAtPageTop(isIntersecting);
      }
    }, observerOptions);

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return { atPageTop };
};

export default useAtPageTop;
