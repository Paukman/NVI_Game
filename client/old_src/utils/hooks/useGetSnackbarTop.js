import { useEffect, useState } from "react";
import { Grid } from "antd";
import { isSM, isXS } from "StyleGuide/Components/utils";

const { useBreakpoint } = Grid;

export const SNACKBAR_TOP_MOBILE_VIEW = 128;
export const SNACKBAR_TOP_DEFAULT_VIEW = 165;

const useGetSnackbarTop = () => {
  const [snackbarTop, setSnackbarTop] = useState(0);
  const screens = useBreakpoint();

  useEffect(() => {
    if (isXS(screens) || isSM(screens)) {
      setSnackbarTop(SNACKBAR_TOP_MOBILE_VIEW);
    } else {
      setSnackbarTop(SNACKBAR_TOP_DEFAULT_VIEW);
    }
  }, [screens]);

  return { snackbarTop };
};

export default useGetSnackbarTop;
