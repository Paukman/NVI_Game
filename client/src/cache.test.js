describe("cache", () => {

  const key = 'some-key';
  const value = 'value';

  beforeEach(() => {
    cache.set(key, value);
  });
  afterEach(() => {
    cache.del(key);
  });
  it("can retrieve a value by key from the cache", () => {
    expect(cache.get(key)).toEqual(value)
  });
  it("returns undefined when fetching a key that doesn't exist", () => {
    expect(cache.get('null')).toEqual(undefined);
  });
  it("can delete a value by key from the cache", () => {
    cache.del(key)
    expect(cache.get(key)).toEqual(undefined)
  });
  it("returns 0 when deleting a key that doesn't exist", () => {
    expect(cache.del('null')).toEqual(0)
  });
  it("can check if key exists in cache", () => {
    expect(cache.has(key)).toEqual(true)
  });
  it("returns false if key does not exist in cache", () => {
    expect(cache.has('null')).toEqual(false)
  });
})