import DataStore from "./DataStore";

const realDate = new Date();
describe("DataStore", () => {
  it(">> can set and reset the store", () => {
    DataStore.put("test", "test value");
    let res = DataStore.getAll();
    expect(res.test.value).toEqual("test value");
    DataStore.flush();
    res = DataStore.getAll();
    expect(res).toEqual({});
  });
  it(">> can set and delete a key", () => {
    DataStore.put("test", "test value");
    let res = DataStore.get("test");
    expect(res.value).toEqual("test value");
    DataStore.del("test");
    res = DataStore.get("test");
    expect(res).toEqual(null);
  });
  it(">> can update value for a key", () => {
    DataStore.put("test", "test value");
    let res = DataStore.get("test");
    expect(res.value).toEqual("test value");
    DataStore.put("test", "updated test value");
    res = DataStore.get("test");
    expect(res.value).toEqual("updated test value");
  });
});
describe("DataStore", () => {
  afterAll(() => {
    global.Date = jest.fn(() => realDate);
  });
  it(">> can expire the data", () => {
    const pastDate = new Date("2019-01-01T00:00:00.000Z");
    const futureDate = new Date("2019-01-03T00:00:00.000Z");
    global.Date = jest.fn(() => pastDate);
    DataStore.put("test", "test value");
    expect(DataStore.get("test").value).toEqual("test value");
    // expire the data
    global.Date = jest.fn(() => futureDate);
    const res = DataStore.get("test");
    expect(res).toEqual(null);
  });
});
