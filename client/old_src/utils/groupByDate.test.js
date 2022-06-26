import { groupByDate } from "./groupByDate";

describe("groupByDate returns grouped object", () => {
  const array = [
    {
      transactionId: null,
      transactionDate: "2019-10-22T06:00:00.000Z",
      netAmount: {
        currency: null,
        value: 0.5
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "CAT RIGHT TIME PAYMENTS CALGARY AB",
      key: "ef6898c9014d10de8b1880d98ed028b7"
    }
  ];

  it(">> Should create new object", () => {
    const newObject = groupByDate(array);
    expect(newObject).toEqual({
      "2019-10-22": [
        {
          transactionId: null,
          transactionDate: "2019-10-22T06:00:00.000Z",
          netAmount: {
            currency: null,
            value: 0.5
          },
          transactionStatus: "Pending",
          accountingEffectType: "Credit",
          description: "CAT RIGHT TIME PAYMENTS CALGARY AB",
          key: "ef6898c9014d10de8b1880d98ed028b7"
        }
      ]
    });
  });
});
