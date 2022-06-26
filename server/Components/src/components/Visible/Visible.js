import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BREAKPOINTS } from '../../theme/breakpoints';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(
    () => {
      const mediaQuery = window.matchMedia(query);
      setMatches(mediaQuery.matches);
      const handler = (event) => setMatches(event.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    },
    [query], // Empty array ensures effect is only run on mount and unmount
  );
  return matches;
}

const Visible = (props) => {
  const { children, on } = props;

  const breakpoints = {
    xs: useMediaQuery(`(min-width: 0px) and (max-width: ${BREAKPOINTS.xs - 1}px)`),
    sm: useMediaQuery(`(min-width: ${BREAKPOINTS.xs}px) and (max-width: ${BREAKPOINTS.sm - 1}px)`),
    md: useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`),
    lg: useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`),
  };

  const show = on.some((breakpoint) => breakpoints[breakpoint]);

  return show ? <React.Fragment>{children}</React.Fragment> : null;
};

Visible.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  /** A single value or an array of values to hide this containers content */
  on: PropTypes.array.isRequired,
};
export default Visible;
