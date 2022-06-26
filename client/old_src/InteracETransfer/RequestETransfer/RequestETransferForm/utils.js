import { formatCurrency } from "utils";

export const formatReviewPageData = (data, eTransferData) => {
  const from = eTransferData.depositAccounts.find(
    account => account.recipientId === data.from
  );
  const to = eTransferData.withdrawalAccounts.find(
    account => account.id === data.to
  );
  const accountBalance = formatCurrency(to.availableBalance.value);
  return {
    ...data,
    from: {
      name: `${from.aliasName} (${from.notificationPreference[0].notificationHandle})`,
      id: data.from
    },
    to: {
      name: `${to.name} (${to.number}) | ${accountBalance}`,
      id: data.to
    },
    amount: formatCurrency(data.amount),
    legalName: eTransferData.legalName
  };
};
