import { renderHook, act } from "@testing-library/react-hooks";
import * as Jotai from "jotai";
import useNavTracking from "./useNavTracking";
import * as Utils from "./utils";

describe("Testing useNavTracking hook", () => {
  it(">> should process updateSecondaryNavPath properly", async () => {
    const setNavLocation = jest.fn();
    jest.spyOn(Jotai, "useAtom").mockReturnValue([null, setNavLocation]);
    const getSecondaryMenuTag = jest.spyOn(Utils, "getSecondaryMenuTag");

    let hook;
    await act(async () => {
      hook = renderHook(() => useNavTracking());
    });

    const { result } = hook;
    act(() => result.current.updateSecondaryNavPath("more", "more"));
    expect(setNavLocation).toBeCalledWith(null);
    act(() =>
      result.current.updateSecondaryNavPath("Manage contacts", "Some url")
    );
    expect(setNavLocation).toBeCalledWith("Manage contacts");
    expect(getSecondaryMenuTag).toHaveBeenNthCalledWith(1, "more", "more");
    expect(getSecondaryMenuTag).toHaveBeenNthCalledWith(
      2,
      "Manage contacts",
      "Some url"
    );
  });

  it(">> should process updatePrimaryNavPath properly", async () => {
    const setPrevLocation = jest.fn();
    jest.spyOn(Jotai, "useAtom").mockReturnValue([null, setPrevLocation]);
    const startTrackingNewLocation = jest.spyOn(
      Utils,
      "startTrackingNewLocation"
    );

    let hook;
    await act(async () => {
      hook = renderHook(() => useNavTracking());
    });

    const { result } = hook;
    act(() => result.current.updatePrimaryNavPath("more"));
    expect(setPrevLocation).toBeCalledTimes(1); // inside startTrackingNewLocation
    expect(startTrackingNewLocation).toHaveBeenCalledWith({
      locationPathname: "more",
      prevLocation: null,
      setPrevLocation
    });
  });
});
