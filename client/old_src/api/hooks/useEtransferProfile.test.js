import { etransfersBaseUrl } from "api";
import { renderHook } from "@testing-library/react-hooks";

import { mockApiData, createQueryWrapper } from "utils/TestUtils";
import {
  interacProfilePassing,
  interacProfileFailing
} from "InteracETransfer/InteracETransfer.testdata";
import { useEtransferProfile } from "api/hooks";

jest.mock("antd");

describe("Testing Etransfer Profile fetch", () => {
  it(">> should return enabled Interac Profile details", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfilePassing
      }
    ]);

    let hook;
    const wrapper = createQueryWrapper();
    await act(async () => {
      hook = renderHook(() => useEtransferProfile(), {
        wrapper
      });
    });

    const { result } = hook;

    expect(result.current.data.enabled).toEqual(true);
  });
  it(">> should return disabled Interac Profile details", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfileFailing
      }
    ]);
    let hook;
    const wrapper = createQueryWrapper();
    await act(async () => {
      hook = renderHook(() => useEtransferProfile(), {
        wrapper
      });
    });

    const { result } = hook;

    expect(result.current.data.enabled).toBeFalsy();
  });
});
