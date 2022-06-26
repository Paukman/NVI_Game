/**
 * @deprecated use useResponsive hook instead
 */
export const isXXL = screen => {
  return (
    screen.lg && screen.md && screen.sm && screen.xl && !screen.xs && screen.xxl
  );
};

/**
 * @deprecated use useResponsive hook instead
 */
export const isXL = screen => {
  return (
    !screen.xs &&
    screen.sm &&
    screen.md &&
    screen.lg &&
    screen.xl &&
    !screen.xxl
  );
};

/**
 * @deprecated use useResponsive hook instead
 */
export const isLG = screen => {
  return (
    screen.lg &&
    screen.md &&
    screen.sm &&
    !screen.xl &&
    !screen.xs &&
    !screen.xxl
  );
};

/**
 * @deprecated use useResponsive hook instead
 */
export const isMD = screen => {
  return (
    !screen.lg &&
    screen.md &&
    screen.sm &&
    !screen.xl &&
    !screen.xs &&
    !screen.xxl
  );
};

/**
 * @deprecated use useResponsive hook instead
 */
export const isSM = screen => {
  return (
    !screen.lg &&
    !screen.md &&
    screen.sm &&
    !screen.xl &&
    !screen.xs &&
    !screen.xxl
  );
};

/**
 * @deprecated use useResponsive hook instead
 */
export const isXS = screen => {
  return (
    !screen.lg &&
    !screen.md &&
    !screen.sm &&
    !screen.xl &&
    screen.xs &&
    !screen.xxl
  );
};
