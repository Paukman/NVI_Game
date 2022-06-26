import { filterCAD } from "./formUtils";

const testArray = [
  {
    name: "Test",
    balance: {
      currency: "CAD"
    }
  },
  {
    name: "Test USD",
    balance: {
      currency: "USD"
    }
  }
];
const emptyArray = [];

describe("Testing filterCAD", () => {
  it(">> should filter", () => {
    const filteredArray = filterCAD(testArray);

    expect(filteredArray).toEqual([
      {
        name: "Test",
        balance: {
          currency: "CAD"
        }
      }
    ]);
  });

  it(">> should render empty", () => {
    const emptyResult = filterCAD(emptyArray);

    expect(emptyResult).toEqual([]);
  });
});
