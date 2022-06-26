import DataStore from "utils/store";
import { mockApiData } from "utils/TestUtils";
import { manualApiFetch } from "./manualApiFetch";

describe("Testing manualApiFetch", () => {
  it(">> data is not in the cache ", async () => {
    DataStore.flush();
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
    const result = await manualApiFetch(urlRequest, dataKey);
    expect(result.value).toEqual([{ returnedData: "123" }]);
    const res = DataStore.get(dataKey);
    expect(res.value).toEqual([{ returnedData: "123" }]);
  });
  it(">> should fetch data from the cache", async () => {
    DataStore.flush();
    const urlRequest = "url-endpoint";
    const dataKey = "some-key";
    DataStore.put(dataKey, "321");
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

    const result = await manualApiFetch(urlRequest, dataKey);
    expect(result.value).toEqual("321");
  });
  it(">> test fail", async () => {
    DataStore.flush();
    const urlRequest = "url-endpoint";
    const dataKey = "some-key";
    const error = { response: { status: 500, data: { code: "ETRN0002" } } };
    mockApiData([
      {
        url: urlRequest,
        results: [
          {
            returnedData: "123"
          }
        ],
        error
      }
    ]);
    try {
      await manualApiFetch(urlRequest, dataKey);
    } catch (e) {
      expect(error).toMatchObject(error);
    }
    const res = DataStore.get(dataKey);
    expect(res).toEqual(null);
  });
  it(">> key is not provided", async () => {
    DataStore.flush();
    const urlRequest = "url-endpoint";
    const dataKey = "some-key";
    mockApiData([
      {
        url: urlRequest,
        results: [
          {
            returnedData: "123"
          }
        ],
        error: "some error"
      }
    ]);
    await expect(manualApiFetch()).rejects.toThrow(
      "Key is required argument and cannot be the same as the URL argument"
    );
    await expect(manualApiFetch("1", "1")).rejects.toThrow(
      "Key is required argument and cannot be the same as the URL argument"
    );
    const res = DataStore.get(dataKey);
    expect(res).toEqual(null);
  });
});
