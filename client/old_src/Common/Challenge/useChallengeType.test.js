import { act, renderHook } from "@testing-library/react-hooks";
import { mockApiData } from "utils/TestUtils";
import { mfaSecurityMessages } from "utils/MessageCatalog";

import useChallengeType, { challengesURL } from "./useChallengeType";

const rsaHeaders = { a: 1 };
describe("useChallengeType hook", () => {
  it(">> can fetch type on mount on success ", async () => {
    const currentChallengeType = "SMSAuthentication";
    mockApiData([
      {
        url: challengesURL,
        results: { currentChallengeType },
        method: "GET"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useChallengeType(rsaHeaders));
    });
    const { result } = hook;
    expect(result.current.challengeType).toEqual({
      error: null,
      type: currentChallengeType,
      loading: false
    });
  });
  it(">> fetch type throw server error ", async () => {
    mockApiData([
      {
        url: challengesURL,
        results: [],
        status: 500,
        method: "get",
        error: "ServerError"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useChallengeType(rsaHeaders));
    });
    const { result } = hook;
    expect(result.current.challengeType).toEqual({
      error: mfaSecurityMessages.MSG_RB_AUTH_042,
      loading: false,
      type: null
    });
  });
});
