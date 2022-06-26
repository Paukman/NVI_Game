import { renderHook, act } from "@testing-library/react-hooks";
import { windowMatchMediaMock } from "utils/TestUtils";
import { Grid } from "antd";
import useResponsive from "./useResponsive";

const breakpointSizes = ["xs", "sm", "md", "lg", "xl", "xxl"];
const getBreakpointsValues = (...activeScreenSizes) =>
  breakpointSizes.reduce(
    (breakpoints, currentKey) => ({
      ...breakpoints,
      [currentKey]: activeScreenSizes.includes(currentKey)
    }),
    {}
  );

const useBreakpointValues = {
  xs: getBreakpointsValues("xs"),
  sm: getBreakpointsValues("sm"),
  md: getBreakpointsValues("sm", "md"),
  lg: getBreakpointsValues("sm", "md", "lg"),
  xl: getBreakpointsValues("sm", "md", "lg", "xl"),
  xxl: getBreakpointsValues("sm", "md", "lg", "xl", "xxl")
};

const getExpectedValues = screenSize => ({
  isXS: screenSize === "xs",
  isSM: screenSize === "sm",
  isMD: screenSize === "md",
  isLG: screenSize === "lg",
  isXL: screenSize === "xl",
  isXXL: screenSize === "xxl"
});

describe("useResponsive", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  describe("isScreenSize", () => {
    it(">> Should return isXS as true at xs screen sizes", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.xs);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current).toMatchObject(getExpectedValues("xs"));
    });

    it(">> Should return isSM as true at sm screen sizes", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.sm);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current).toMatchObject(getExpectedValues("sm"));
    });

    it(">> Should return isMD as true at md screen sizes", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.md);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current).toMatchObject(getExpectedValues("md"));
    });

    it(">> Should return isLG as true at lg screen sizes", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.lg);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current).toMatchObject(getExpectedValues("lg"));
    });

    it(">> Should return isXL as true at xl screen sizes", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.xl);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current).toMatchObject(getExpectedValues("xl"));
    });

    it(">> Should return isXXL as true at xxl screen sizes", async () => {
      let renderHookResult;
      jest
        .spyOn(Grid, "useBreakpoint")
        .mockReturnValue(useBreakpointValues.xxl);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current).toMatchObject(getExpectedValues("xxl"));
    });
  });

  describe("screenIsAtMost", () => {
    it(">> Should return true when current screen size is less than at most size", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.sm);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current.screenIsAtMost("md")).toEqual(true);
    });

    it(">> Should return true when current screen size is equal to at most size", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.md);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current.screenIsAtMost("md")).toEqual(true);
    });

    it(">> Should return false when current screen size is larger at most size", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.lg);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current.screenIsAtMost("md")).toEqual(false);
    });

    it(">> Should return false when at most size parameter is not a screen size", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.lg);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current.screenIsAtMost("dog")).toEqual(false);
    });
  });

  describe("screenIsAtLeast", () => {
    it(">> Should return true when current screen size is greater than at least size", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.lg);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current.screenIsAtLeast("md")).toEqual(true);
    });

    it(">> Should return true when current screen size is equal to at least size", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.md);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current.screenIsAtLeast("md")).toEqual(true);
    });

    it(">> Should return false when current screen size is less than at least size", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.sm);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current.screenIsAtLeast("md")).toEqual(false);
    });

    it(">> Should return false when at least size parameter is not a screen size", async () => {
      let renderHookResult;
      jest.spyOn(Grid, "useBreakpoint").mockReturnValue(useBreakpointValues.lg);
      await act(async () => {
        renderHookResult = renderHook(() => useResponsive());
      });
      const { result } = renderHookResult;
      expect(result.current.screenIsAtLeast("cat")).toEqual(false);
    });
  });
});
