export const getAccountCurrencies = accountsArray => {
  const currencyTypes = {};

  if (!accountsArray || accountsArray.length === 0) {
    return currencyTypes;
  }

  accountsArray.forEach(account => {
    if (account.id && account.currency) {
      currencyTypes[account.id] = account.currency;
    }
  });

  return currencyTypes;
};
