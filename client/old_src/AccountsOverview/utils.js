export const mapToOverview = accounts => {
  if (!Array.isArray(accounts)) {
    return [];
  }
  return accounts.map(account => {
    const result = {
      type: account.type?.toLowerCase() || "",
      id: account.id,
      name: account.nickname || account.name || "",
      currentBalance: account.balance?.value || "",
      number: account.number || "",
      availableBalance: account.availableBalance?.value || "",
      currency: account.balance?.currency || "",
      bankAccount: account.bankAccount,
      quickActions: account.quickActions
    };
    if (account.creditCardNumber) {
      result.creditCardNumber = account.creditCardNumber;
    }
    if (account.associatedCreditCardNumbers) {
      result.associatedCreditCardNumbers = account.associatedCreditCardNumbers;
    }
    if (account.subTypeV1) {
      result.subType = account.subTypeV1.toLowerCase();
    }
    return result;
  });
};

export const mapTotals = totals => {
  if (!totals) {
    return {};
  }
  const ensureTotalHasValue = total => {
    if (total && Object.keys(total).length > 0) {
      return total;
    }
    return undefined;
  };

  return {
    depositTotals: ensureTotalHasValue(totals.deposit),
    investmentTotals: ensureTotalHasValue(totals.investment),
    loanTotals: ensureTotalHasValue(totals.loan),
    creditCardTotals: ensureTotalHasValue(totals.creditCard),
    prepaidCardTotals: ensureTotalHasValue(totals.prepaidCard)
  };
};
