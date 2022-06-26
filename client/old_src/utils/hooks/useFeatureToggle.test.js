import DataStore from "utils/store";
import { renderHook } from "@testing-library/react-hooks";
import { mockApiData } from "utils/TestUtils";
import useFeatureToggle from "./useFeatureToggle";

describe("useFeatureToggle with cache", () => {
  beforeEach(() => {
    DataStore.flush();
  });
  it(">> it can set the data into the store and return true after the API call on success", async () => {
    const urlRequest = "url-endpoint";
    const dataKey = "some-key";
    mockApiData([
      {
        url: `/api/atb-rebank-api-feature-toggle/isEnabled/${urlRequest}`,
        results: {
          status: true
        }
      }
    ]);
    const { result, waitForNextUpdate } = renderHook(() =>
      useFeatureToggle(urlRequest, dataKey, 30000)
    );
    let res = DataStore.get(dataKey);
    expect(res).toEqual(null);
    await waitForNextUpdate();
    const [render] = result.current;
    expect(render).toEqual(true);
    res = DataStore.get(dataKey);
    expect(res.value).toEqual({ status: true });
  });

  it(">> it can set false if the api fails", async () => {
    const urlRequest = "url-endpoint";
    const dataKey = "some-key";

    mockApiData([
      {
        url: `/api/atb-rebank-api-feature-toggle/isEnabled/${urlRequest}`,
        results: [],
        status: 500,
        method: "get",
        error: "System Error"
      }
    ]);
    const { result } = renderHook(() =>
      useFeatureToggle(urlRequest, dataKey, 30000)
    );
    let res = DataStore.get(dataKey);
    expect(res).toEqual(null);
    const [render] = result.current;
    expect(render).toEqual(false);
    res = DataStore.get(dataKey);
    expect(res).toEqual(null);
  });
});
