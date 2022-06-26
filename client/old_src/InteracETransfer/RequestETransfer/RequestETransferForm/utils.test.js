import { formatReviewPageData } from "./utils";

const eTransferData = {
  withdrawalAccounts: [
    {
      name: "Test Account",
      number: "7679",
      id: 123456,
      type: "deposit",
      subType: "deposit",
      status: "30",
      customerId: "123456",
      availableBalance: {
        currency: "CAD",
        value: 1000
      }
    },
    {
      name: "Test Account 2",
      number: "7680",
      id: 234567,
      type: "deposit",
      subType: "deposit",
      status: "30",
      customerId: "123456",
      availableBalance: {
        currency: "CAD",
        value: 1000
      }
    }
  ],
  depositAccounts: [
    {
      aliasName: "Test To Account",
      recipientId: 456789,
      notificationPreference: [
        {
          notificationHandle: "fake@email.com"
        }
      ]
    }
  ],
  legalName: "James Herbert Bond"
};

const data = {
  from: 456789, // The account from which the money is requested.
  to: 123456, // The account to deposit requested money into.
  amount: 10
};

describe("Testing formatReview data", () => {
  it(">> Should render body", () => {
    const formattedData = formatReviewPageData(data, eTransferData);

    expect(formattedData).toEqual({
      from: { name: "Test To Account (fake@email.com)", id: 456789 },
      to: { name: "Test Account (7679) | $1,000.00", id: 123456 },
      amount: "$10.00",
      legalName: "James Herbert Bond"
    });
  });
});
