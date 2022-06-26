import { formatCurrency } from "utils";

const getFormattedAccounts = accountsArray => {
  if (!accountsArray || accountsArray.length === 0) {
    return [];
  }

  return accountsArray.map(account => ({
    text: `${account.nickname ? account.nickname : account.name} (${
      account.number
    }) | ${formatCurrency(account.availableBalance.value)} ${account.currency}`,
    key: account.id,
    value: account.id
  }));
};

export { getFormattedAccounts };
