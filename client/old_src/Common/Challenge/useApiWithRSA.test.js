import React from "react";
import { when, resetAllWhenMocks } from "jest-when";
import { renderHook } from "@testing-library/react-hooks";

import { mockApiData, renderHookWithComponent } from "utils/TestUtils";
import mockApi from "api";
import useApiWithRSA from "./useApiWithRSA";

// eslint-disable-next-line react/prop-types
jest.mock("./ChallengeForm", () => ({ onSuccess }) => (
  // eslint-disable-next-line react/button-has-type
  <button onClick={() => onSuccess("xyz-transaction-token")}>Submit</button>
));

describe("Test useApiWithRSA hook", () => {
  it(">> Should not challenge on post and result from call should be returned", async () => {
    mockApiData([
      {
        url: `test/url`,
        method: "POST",
        status: 201
      }
    ]);
    const { result } = renderHook(() => useApiWithRSA());
    const success = await result.current.post("test/url", {});

    expect(success).toEqual({ status: 201 });
  });
  it(">> Should challenge on post", async () => {
    resetAllWhenMocks();

    // mock out response when valid "transaction-token" passed
    const authorizedPayload = {
      data: "completed",
      status: 201
    };
    when(mockApi.post)
      .calledWith(
        "test/url",
        {},
        {
          headers: expect.objectContaining({
            "transaction-token": "xyz-transaction-token"
          })
        }
      )
      .mockResolvedValue(authorizedPayload);

    // mock out a challenge 230 response
    when(mockApi.post)
      .calledWith("test/url", {})
      .mockResolvedValue({
        data: {
          deviceTokenCookie: "cookie",
          sessionId: "sessionid",
          transactionId: "transactionid"
        },
        status: 230
      });

    // setup a Component to use the hook on
    const [hook, component] = renderHookWithComponent(() => useApiWithRSA());
    const { post } = hook;

    // Fire off a "post" call to the hook
    const apicall = post("test/url", {});

    // Expect user interaction to get the transaction-token
    const { findByText } = component;
    const test = await findByText("Submit");
    await act(async () => {
      fireEvent.click(test);
    });

    // Expect api to be called again with transaction token and return the
    const result = await apicall;
    expect(result).toBe(authorizedPayload);
  });
  it(">> Should not challenge on put and result from call should be returned", async () => {
    mockApiData([
      {
        url: `test/url`,
        method: "PUT",
        status: 201
      }
    ]);
    const { result } = renderHook(() => useApiWithRSA());
    const success = await result.current.put("test/url", {});

    expect(success).toEqual({ status: 201 });
  });
});
