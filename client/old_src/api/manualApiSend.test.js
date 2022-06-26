import DataStore from "utils/store";
import { mockApiData } from "utils/TestUtils";
import mockApi from "api";
import { manualApiSend } from "./manualApiSend";

describe("Testing manualApiSend", () => {
  it(">> should delete the keys on post ", async () => {
    DataStore.flush();
    DataStore.put("test", "123");
    const urlRequest = "url-endpoint";
    mockApiData([
      {
        url: urlRequest
      }
    ]);
    expect(DataStore.get("test").value).toEqual("123");
    await manualApiSend({
      url: urlRequest,
      data: {},
      config: {},
      keys: ["test"]
    });
    expect(DataStore.get("test")).toEqual(null);
  });
  it(">> should not delete keys if nothing is passed", async () => {
    DataStore.flush();
    DataStore.put("test", "123");
    const urlRequest = "url-endpoint";
    mockApiData([
      {
        url: urlRequest
      }
    ]);
    expect(DataStore.get("test").value).toEqual("123");
    await manualApiSend({ url: urlRequest });
    expect(DataStore.get("test").value).toEqual("123");
  });
  it(">> should delete a single key", async () => {
    DataStore.flush();
    DataStore.put("test", "123");
    const urlRequest = "url-endpoint";
    mockApiData([
      {
        url: urlRequest
      }
    ]);
    expect(DataStore.get("test").value).toEqual("123");
    await manualApiSend({ url: urlRequest, keys: "test" });
    expect(DataStore.get("test")).toEqual(null);
  });
  it(">> should not delete if undefined is passed ", async () => {
    DataStore.flush();
    DataStore.put("test", "123");
    const urlRequest = "url-endpoint";
    mockApiData([
      {
        url: urlRequest
      }
    ]);
    expect(DataStore.get("test").value).toEqual("123");
    await manualApiSend({ url: urlRequest, keys: undefined });
    expect(DataStore.get("test").value).toEqual("123");
  });
  it(">> should not delete if null is passed ", async () => {
    DataStore.flush();
    DataStore.put("test", "123");
    const urlRequest = "url-endpoint";
    mockApiData([
      {
        url: urlRequest
      }
    ]);
    expect(DataStore.get("test").value).toEqual("123");
    await manualApiSend({ url: urlRequest, keys: null });
    expect(DataStore.get("test").value).toEqual("123");
  });
  it(">> calls the api POST ", async () => {
    DataStore.flush();
    const urlRequest = "url-endpoint";
    mockApiData([
      {
        url: urlRequest,
        results: [{ returnedData: "123" }],
        status: 200,
        method: "POST"
      }
    ]);
    const result = await manualApiSend({ url: urlRequest });
    expect(result.data).toMatchObject([{ returnedData: "123" }]);
    expect(mockApi.post).toHaveBeenCalled();
  });
  it(">> calls the api PUT ", async () => {
    DataStore.flush();
    const urlRequest = "url-endpoint";
    mockApiData([
      {
        url: urlRequest,
        results: [{ returnedData: "123" }],
        status: 200,
        method: "PUT"
      }
    ]);
    const result = await manualApiSend({ verb: "PUT", url: urlRequest });
    expect(result.data).toMatchObject([{ returnedData: "123" }]);
    expect(mockApi.put).toHaveBeenCalled();
  });
  it(">> calls the api PATCH ", async () => {
    DataStore.flush();
    const urlRequest = "url-endpoint";
    mockApiData([
      {
        url: urlRequest,
        results: [{ returnedData: "123" }],
        status: 200,
        method: "PATCH"
      }
    ]);
    const result = await manualApiSend({ verb: "PATCH", url: urlRequest });
    expect(result.data).toMatchObject([{ returnedData: "123" }]);
    expect(mockApi.patch).toHaveBeenCalled();
  });
  it(">> calls the api DELETE ", async () => {
    DataStore.flush();
    const urlRequest = "url-endpoint";
    mockApiData([
      {
        url: urlRequest,
        results: [{ returnedData: "123" }],
        status: 200,
        method: "DELETE"
      }
    ]);
    const result = await manualApiSend({ verb: "DELETE", url: urlRequest });
    expect(result.data).toMatchObject([{ returnedData: "123" }]);
    expect(mockApi.delete).toHaveBeenCalled();
  });
  it(">> calls the api DELETEWITHDATA ", async () => {
    DataStore.flush();
    const urlRequest = "url-endpoint";
    mockApiData([
      {
        url: urlRequest,
        results: [{ returnedData: "123" }],
        status: 200,
        data: { test: "test124" },
        method: "DELETE"
      }
    ]);
    await manualApiSend({
      verb: "DELETEWITHDATA",
      data: { test: "test124" },
      url: urlRequest
    });
    expect(mockApi.deleteWithData).toHaveBeenCalled();
  });
  it(">> calls the api some unknown verb ", async () => {
    DataStore.flush();
    const urlRequest = "url-endpoint";
    mockApiData([
      {
        url: urlRequest,
        results: [{ returnedData: "123" }],
        status: 200,
        method: "POST"
      }
    ]);
    const result = await manualApiSend({ verb: "BAD", url: urlRequest });
    expect(result.data).toMatchObject([{ returnedData: "123" }]);
    expect(mockApi.delete).toHaveBeenCalled();
  });
  it(">> test fail", async () => {
    DataStore.flush();
    const urlRequest = "123";
    const error = { response: { status: 500, data: { code: "ETRN0002" } } };
    mockApiData([
      {
        url: urlRequest,
        results: [],
        method: "POST",
        error
      }
    ]);
    try {
      await manualApiSend({ verb: "POST", url: urlRequest });
    } catch (e) {
      expect(error).toMatchObject(error);
    }
  });
  it(">> required url arg", async () => {
    DataStore.flush();
    const urlRequest = "123";
    mockApiData([
      {
        url: urlRequest,
        results: [],
        method: "POST",
        error: "ServerError"
      }
    ]);
    await expect(manualApiSend({})).rejects.toThrow("URL is required argument");
  });
});
