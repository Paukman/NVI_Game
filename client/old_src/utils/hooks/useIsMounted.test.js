import { renderHook } from "@testing-library/react-hooks";
import useIsMounted from "./useIsMounted";

describe("useIsMounted hook", () => {
  it(">> should return mounted and unmounted", async () => {
    const hook = renderHook(() => useIsMounted());
    expect(hook.result.current()).toEqual(true);
    hook.unmount();
    expect(hook.result.current()).toEqual(false);
  });
});
