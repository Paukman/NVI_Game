import { generateId } from "./generateId";

describe("Testing generateId", () => {
  it("> Should return 1", () => {
    const result = generateId();
    expect(result).toEqual(1);
  });
});
