export const transformData = (id, fulfillRequest, formData, data) => {
  const account = formData.withdrawalAccounts.find(acc => acc.id === data.from);
  return {
    eTransferType: "Fulfill Money Request eTransfer",
    moneyRequestReferenceNumber: id,
    fromAccount: { id: account.id, name: account.name },
    recipient: {
      aliasName: fulfillRequest.registrantName.aliasName
    },
    amount: {
      value: fulfillRequest.amount / 100,
      currency: fulfillRequest.amountCurrency
    },
    memo: data.message
  };
};
