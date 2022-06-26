export const pendingHistory = [
  {
    id: "1",
    recipient: "Joe Dood",
    amount: "2.35",
    status: "Pending Direct Deposit",
    type: "transfer"
  }
];
export const postedHistory = {
  hasMore: true,
  pageFrom: "pagefromthisdate",
  transfers: [
    {
      id: "2",
      recipient: "Jane Dood",
      amount: "34.56",
      status: "Completed",
      type: "transfer"
    }
  ]
};

export const noHistory = [];
export const transferDetails = {
  eTransferId: "1",
  amount: { currency: "CAD", value: 4.92 },
  eTransferATBPaymentStatus: "Pending",
  eTransferStatus: "Transfer Available",
  expiryDate: "2020-10-21T00:00:00.000Z",
  fromAccount: { accountName: "Basic Account", accountNumber: "6679" },
  recipient: {
    aliasName: "Guy Incognito",
    notificationPreference: [
      {
        notificationHandleType: "Email",
        notificationHandle: "qwigibo@atb.com",
        isActive: true
      }
    ]
  },
  requestedExecutionDate: "2020-10-19T18:33:28.000Z"
};
