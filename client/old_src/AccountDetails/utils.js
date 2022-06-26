export const remapTransactions = (type, transactions) => {
  if (transactions === undefined) {
    return null;
  }
  if (transactions.length === 0) {
    return transactions;
  }

  if (type !== "creditcard") {
    return transactions.map(
      ({
        debitOrCredit,
        paymentOrderId,
        paymentOrderStatus,
        postingDate,
        ...rest
      }) => ({
        accountingEffectType: debitOrCredit,
        transactionDate: postingDate,
        transactionId: paymentOrderId,
        transactionStatus: paymentOrderStatus,
        ...rest
      })
    );
  }
  return transactions.map(({ postedDate, ...rest }) => ({
    ...rest,
    transactionDate: postedDate
  }));
};
