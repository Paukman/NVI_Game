import { etransfersBaseUrl } from "api";
import { mockApiData, createQueryWrapper } from "utils/TestUtils";

import { renderHook, act } from "@testing-library/react-hooks";
import {
  recipientsPassing,
  recipientsFailing
} from "InteracETransfer/InteracETransfer.testdata";
import { useRecipients } from "api/hooks";

describe("Testing Recipients fetch", () => {
  it(">> should return enabled Interac Profile details", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsPassing
      }
    ]);

    let hook;
    const wrapper = createQueryWrapper();
    await act(async () => {
      hook = renderHook(() => useRecipients(), {
        wrapper
      });
    });

    const { result } = hook;

    expect(result.current.data).toHaveLength(1);
  });
  it(">> should return disabled Interac Profile details", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsFailing
      }
    ]);

    let hook;
    const wrapper = createQueryWrapper();
    await act(async () => {
      hook = renderHook(() => useRecipients(), {
        wrapper
      });
    });

    const { result } = hook;

    expect(result.current.data).toHaveLength(0);
  });
});
