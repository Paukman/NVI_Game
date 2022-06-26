import { renderHook } from "@testing-library/react-hooks";
import { windowMatchMediaMock } from "utils/TestUtils";
import useGetSnackbarTop, {
  SNACKBAR_TOP_DEFAULT_VIEW
} from "./useGetSnackbarTop";

describe("Testing useGetSnackbarTop", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> Should set proper top distance", async () => {
    const { result } = renderHook(() => useGetSnackbarTop());
    // AT: could not figure a way how to mock small screen size,
    // only testing default size (1024)
    expect(result.current.snackbarTop).toEqual(SNACKBAR_TOP_DEFAULT_VIEW);
  });
});
