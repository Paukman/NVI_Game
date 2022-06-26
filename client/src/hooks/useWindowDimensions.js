import { useState, useEffect } from 'react';

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const useWindowDimensions = (eventTimeout) => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  let timeout;
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setWindowDimensions(getWindowDimensions());
      }, eventTimeout || 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};
