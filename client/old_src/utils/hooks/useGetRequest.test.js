import DataStore from "utils/store";
import { renderHook } from "@testing-library/react-hooks";
import { mockApiData } from "utils/TestUtils";
import useGetRequest from "./useGetRequest";

describe("useGetRequest with cache", () => {
  it(">> it can set the fetched data in the store", async () => {
    const urlRequest = "url-endpoint";
    const dataKey = "some-key";
    mockApiData([
      {
        url: urlRequest,
        results: [
          {
            returnedData: "123"
          }
        ]
      }
    ]);
    const { result, waitForNextUpdate } = renderHook(
      ({ url, key, ttl }) => useGetRequest(url, key, ttl),
      {
        initialProps: { url: urlRequest, key: dataKey, ttl: 30000 }
      }
    );
    let res = DataStore.get(dataKey);
    expect(res).toEqual(null);
    await waitForNextUpdate();
    expect(result.current.response.loading).toEqual(false);
    expect(result.current.response.error).toEqual(null);
    expect(result.current.response.fromCache).toEqual(false);
    expect(result.current.response.data.value).toEqual([
      { returnedData: "123" }
    ]);
    res = DataStore.get(dataKey);
    expect(res.value).toEqual([{ returnedData: "123" }]);
  });
  it(">> it can read data from the store", async () => {
    const urlRequest = "url-endpoint";
    const dataKey = "some-key";
    DataStore.put(dataKey, "test-data");
    mockApiData([
      {
        url: urlRequest,
        results: [
          {
            returnedData: "123"
          }
        ]
      }
    ]);
    const { result } = renderHook(
      ({ url, key, ttl }) => useGetRequest(url, key, ttl),
      {
        initialProps: { url: urlRequest, key: dataKey, ttl: 30000 }
      }
    );
    const res = DataStore.get(dataKey);
    expect(res.value).toEqual("test-data");
    expect(result.current.response.fromCache).toEqual(true);
    expect(result.current.response.data.value).toEqual("test-data");
  });
  it(">> unmounted is flagged", async () => {
    const urlRequest = "url-endpoint";
    const dataKey = "444";
    mockApiData([
      {
        url: urlRequest,
        results: [
          {
            returnedData: "123"
          }
        ]
      }
    ]);
    const { unmount } = renderHook(({ url, key }) => useGetRequest(url, key), {
      initialProps: { url: urlRequest, key: dataKey }
    });
    unmount();
    const res = DataStore.get(dataKey);
    expect(res).toEqual(null);
  });
});
