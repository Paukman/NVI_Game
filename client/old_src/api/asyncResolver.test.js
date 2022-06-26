import { manualApiFetch } from "api";
import { mockApiData } from "utils/TestUtils";
import DataStore from "utils/store";
import {
  asyncResolver,
  MISSING_ARGUMENTS_ERROR,
  NO_KEYS_ERROR
} from "./asyncResolver";

const delay = time => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
};
const error = new Error("Error");
const errorFunc = async () => {
  return new Promise(async (_, reject) => {
    await delay(1000);
    reject(error);
  });
};

describe("async resolver", () => {
  it("can resolve with params", async () => {
    const mockFunc = jest.fn();
    await asyncResolver([
      {
        fn: mockFunc,
        args: [1, 2, 3],
        key: "mockFunc"
      }
    ]);
    expect(mockFunc).toBeCalledWith([1, 2, 3]);
  });
  it("can return error if throws", async () => {
    const result = await asyncResolver([
      {
        fn: errorFunc,
        args: [1, 2, 3],
        key: "errorFunc"
      }
    ]);
    expect(result.errorFunc).toEqual({ error, result: null });
  });
  it("can return multiple results", async () => {
    const one = async param => {
      return new Promise(async resolve => {
        await delay(100);
        resolve(param);
      });
    };
    const result = await asyncResolver([
      {
        fn: errorFunc,
        args: [1, 2, 3],
        key: "errorFunc"
      },
      {
        fn: one,
        args: "param",
        key: "one"
      }
    ]);
    expect(result.errorFunc).toEqual({ error, result: null });
    expect(result.one).toEqual({ error: null, result: "param" });
  });
  it("mixed async, sync and errors", async () => {
    const one = async param => {
      return new Promise(async resolve => {
        await delay(100);
        resolve(param);
      });
    };
    const syncFn = syncParam => syncParam;
    const result = await asyncResolver([
      {
        fn: syncFn,
        args: "sync",
        key: "syncFn"
      },
      {
        fn: errorFunc,
        args: [1, 2, 3],
        key: "errorFunc"
      },
      {
        fn: one,
        args: "param",
        key: "one"
      }
    ]);
    expect(result.errorFunc).toEqual({ error, result: null });
    expect(result.one).toEqual({ error: null, result: "param" });
    expect(result.syncFn).toEqual({ error: null, result: "sync" });
  });
  it("throws on sync function", async () => {
    const syncError = new Error("Some Error");
    const syncFn = () => {
      throw syncError;
    };
    const result = await asyncResolver([
      {
        fn: syncFn,
        args: "sync",
        key: "syncFn"
      }
    ]);

    expect(result.syncFn).toEqual({ error: syncError, result: null });
  });
  it("works with no args", async () => {
    const noArgs = () => "no-args";
    const result = await asyncResolver([
      {
        fn: noArgs,
        key: "noArgs"
      }
    ]);
    expect(result.noArgs).toEqual({ error: null, result: "no-args" });
  });
  it("throws if no fn is provided", async () => {
    try {
      await asyncResolver({});
    } catch (E) {
      expect(E).toEqual(MISSING_ARGUMENTS_ERROR);
    }
  });
  it("throws if fn is not a function", async () => {
    try {
      await asyncResolver([{ fn: {} }]);
    } catch (E) {
      expect(E).toEqual(NO_KEYS_ERROR);
    }
  });
});

describe("fetching data", () => {
  it("resolving data and handles api response errors", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: "url_one",
        results: "one"
      },
      {
        url: "url_two",
        results: "two"
      },
      {
        url: "url_three",
        error: "some_error"
      }
    ]);

    const loadDataOne = async url => {
      const result = await manualApiFetch(url, "key_one");
      await delay(100);
      return result;
    };

    const loadDataTwo = async url => {
      const result = await manualApiFetch(url, "key_two");
      await delay(100);
      return result;
    };

    const loadDataThree = async url => {
      const result = await manualApiFetch(url, "key_three");
      await delay(100);
      return result;
    };

    const data = await asyncResolver([
      {
        fn: loadDataOne,
        args: "url_one",
        key: "loadDataOne"
      },
      {
        fn: loadDataTwo,
        args: "url_two",
        key: "loadDataTwo"
      },
      {
        fn: loadDataThree,
        args: "url_three",
        key: "loadDataThree"
      }
    ]);
    expect(data.loadDataOne.result.value).toEqual("one");
    expect(data.loadDataOne.error).toBeNull();
    expect(data.loadDataTwo.result.value).toEqual("two");
    expect(data.loadDataTwo.error).toBeNull();
    expect(data.loadDataThree.result).toBeNull();
    expect(data.loadDataThree.error).toEqual("some_error");
  });
  it("can catch error on response back", async () => {
    const loadDataOne = async () => {
      return new Promise(async (_, reject) => {
        await delay(100);

        reject(Error("some_error"));
        return null;
      });
    };
    const loadDataTwo = async () => {
      return new Promise(async resolve => {
        await delay(100);
        resolve("data");
        return null;
      });
    };
    const data = await asyncResolver([
      {
        fn: loadDataOne,
        key: "loadDataOne"
      },
      {
        fn: loadDataTwo,
        key: "loadDataTwo"
      }
    ]);
    expect(data.loadDataOne.result).toBeNull();
    expect(data.loadDataOne.error).toEqual(Error("some_error"));
    expect(data.loadDataTwo.result).toEqual("data");
    expect(data.loadDataTwo.error).toBeNull();
  });
});
