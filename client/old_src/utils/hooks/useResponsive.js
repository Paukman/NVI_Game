import { Grid } from "antd";

const useResponsive = () => {
  const { xs, sm, md, lg, xl, xxl } = Grid.useBreakpoint();

  const isXS = xs && !sm && !md && !lg && !xl && !xxl;
  const isSM = !xs && sm && !md && !lg && !xl && !xxl;
  const isMD = !xs && sm && md && !lg && !xl && !xxl;
  const isLG = !xs && sm && md && lg && !xl && !xxl;
  const isXL = !xs && sm && md && lg && xl && !xxl;
  const isXXL = !xs && sm && md && lg && xl && xxl;

  const screenIsAtMost = maxSize => {
    switch (maxSize) {
      case "xs":
        return isXS;
      case "sm":
        return isXS || isSM;
      case "md":
        return isXS || isSM || isMD;
      case "lg":
        return isXS || isSM || isMD || isLG;
      case "xl":
        return isXS || isSM || isMD || isLG || isXL;
      case "xxl":
        return true;
      default:
        return false;
    }
  };

  const screenIsAtLeast = minSize => {
    switch (minSize) {
      case "xs":
        return true;
      case "sm":
        return isSM || isMD || isLG || isXL || isXXL;
      case "md":
        return isMD || isLG || isXL || isXXL;
      case "lg":
        return isLG || isXL || isXXL;
      case "xl":
        return isXL || isXXL;
      case "xxl":
        return isXXL;
      default:
        return false;
    }
  };

  return {
    isXS,
    isSM,
    isMD,
    isLG,
    isXL,
    isXXL,
    screenIsAtMost,
    screenIsAtLeast
  };
};

export default useResponsive;
