import mockAxios from "axios";
import api from "./Api";

jest.mock("axios");

describe("Api", () => {
  const url = "/api/someurl";
  const data = { some: "data" };
  const config = {};

  beforeAll(() => {
    // The below workaround lets us use mock("api/Api") as the default
    // we need to override back to original impl in order to test this module
    // doing it this way saves us having to mock("api/Api") in every test.
    const functions = [
      "get",
      "post",
      "patch",
      "delete",
      "head",
      "options",
      "request",
      "put",
      "getUri",
      "getConfig",
      "isAuthenticated",
      "setToken",
      "intercept401ApiResponse"
    ];
    const actualApi = require.requireActual("api/Api").default;
    functions.forEach(fun => {
      api[fun].mockImplementation(actualApi[fun]);
    });
  });

  it(">> should set Bearer on /api calls", () => {
    const token = "jwt-token";
    const setConfig = api.getConfig(token);
    const response = setConfig({ url: "/api", headers: {} });
    expect(response.headers).toHaveProperty("Authorization", `Bearer ${token}`);
  });

  it(">> should not set Bearer on non /api calls", () => {
    const token = "jwt-token";
    const setConfig = api.getConfig(token);
    const response = setConfig({ url: "/nonapiurl", headers: {} });
    expect(response.headers).not.toHaveProperty(
      "authorization",
      `Bearer ${token}`
    );
  });

  // set Token so api is authorized
  it(">> should setup axios intercetor with Token", () => {
    api.setToken("jwt-token-here");
    expect(mockAxios.interceptors.request.use).toHaveBeenCalled();
  });

  it(">> should call axios request", async () => {
    await api.request(config);
    expect(mockAxios.request).toHaveBeenCalledWith(config);
  });

  it(">>< should call axios get", async () => {
    await api.get(url, config);

    expect(mockAxios.get).toHaveBeenCalledWith(url, config);
  });

  it(">> should call axios delete", async () => {
    await api.delete(url, config);
    expect(mockAxios.delete).toHaveBeenCalledWith(url, config);
  });

  it(">> should call axios head", async () => {
    await api.head(url, config);
    expect(mockAxios.head).toHaveBeenCalledWith(url, config);
  });

  it(">> should call axios options", async () => {
    await api.options(url, config);
    expect(mockAxios.options).toHaveBeenCalledWith(url, config);
  });

  it(">> should call axios post", async () => {
    await api.post(url, data, config);
    expect(mockAxios.post).toHaveBeenCalledWith(url, data, config);
  });

  it(">> should call axios put", async () => {
    await api.put(url, data, config);
    expect(mockAxios.put).toHaveBeenCalledWith(url, data, config);
  });

  it(">> should call axios patch", async () => {
    await api.patch(url, data, config);
    expect(mockAxios.patch).toHaveBeenCalledWith(url, data, config);
  });

  it(">> should call axios getUri", async () => {
    await api.getUri(config);
    expect(mockAxios.getUri).toHaveBeenCalledWith(config);
  });

  it(">> should check authentication before axios call", async () => {
    const expectedValue = "Not Authenticated";
    api.isAuthenticated = jest.fn();
    api.isAuthenticated.mockReturnValue(Promise.reject(expectedValue));

    return expect(api.get("")).rejects.toEqual(expectedValue);
  });

  it(">> interceptor should redirect on 401 /api/* responses", async () => {
    delete window.location;
    window.location = new URL("http://site/some-page");

    try {
      await api.intercept401ApiResponse({
        response: { status: 401, config: { url: "/api/some-endpoint" } }
      });
    } catch (e) {
      expect(window.location).toEqual("http://site/expired");
    }
  });

  it(">> interceptor should ingore 401 on non api calls", async () => {
    delete window.location;
    window.location = new URL("http://site/some-page");

    try {
      await api.intercept401ApiResponse({
        response: { status: 401, config: { url: "/notanapi/some-endpoint" } }
      });
    } catch (e) {
      expect(window.location.href).toEqual("http://site/some-page");
    }
  });

  it(">> interceptor should ingore non 401 http errors", async () => {
    delete window.location;
    window.location = new URL("http://site/some-page");

    try {
      await api.intercept401ApiResponse({
        response: { status: 400, config: { url: "/api/some-endpoint" } }
      });
    } catch (e) {
      expect(window.location.href).toEqual("http://site/some-page");
    }
  });
});
