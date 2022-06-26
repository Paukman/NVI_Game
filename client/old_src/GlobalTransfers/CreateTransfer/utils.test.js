import { getAccountCurrencies } from "./utils";

describe("Create Global Transfer utils", () => {
  describe("getAccountCurrencies", () => {
    it("should return an empty object if no data is passed in", () => {
      const currencies = getAccountCurrencies(null);
      expect(currencies).toEqual({});
    });

    it("should return an empty object if an empty array is passed in", () => {
      const currencies = getAccountCurrencies([]);
      expect(currencies).toEqual({});
    });

    it("should map account currencies into the hash map", () => {
      const accounts = [
        {
          id: "someId",
          currency: "CAD"
        },
        {
          id: "someOtherId",
          currency: "USD"
        }
      ];

      const currencies = getAccountCurrencies(accounts);
      expect(currencies.someId).toBe("CAD");
      expect(currencies.someOtherId).toBe("USD");
    });
  });
});
