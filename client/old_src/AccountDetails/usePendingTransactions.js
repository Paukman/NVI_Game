import api, { accountsBaseUrl, queryKeys } from "api";
import { useCallback } from "react";
import { useQuery } from "react-query";

const getUrl = (type, accountId) => {
  const urlMap = {
    creditcard: `${accountsBaseUrl}/${type}s/${accountId}/transactions?status=Pending`,
    deposit: `${accountsBaseUrl}/${type}s/${accountId}/pendingTransactions`
  };
  return urlMap[type] || "";
};

const mapPendingDepositTransactions = transactions =>
  transactions.map(({ debitOrCredit, paymentOrderId, ...rest }, index) => ({
    accountingEffectType: debitOrCredit,
    transactionId: paymentOrderId,
    transactionStatus: "Pending",
    key: index.toString(),
    ...rest
  }));

const ENABLED_ACCOUNT_TYPES = ["creditcard", "deposit"];

const usePendingTransactions = ({ type, accountId }) => {
  const getPendingTransactions = async () => {
    const url = getUrl(type, accountId);
    if (!url) return undefined;

    const { data } = await api.get(url);
    return data;
  };

  const { data: transactions, isError, isLoading } = useQuery(
    [queryKeys.PENDING_TRANSACTIONS, type, accountId],
    getPendingTransactions,
    {
      enabled: ENABLED_ACCOUNT_TYPES.includes(type),
      select: useCallback(
        data =>
          type === "deposit"
            ? mapPendingDepositTransactions(data)
            : data.transactions,
        [mapPendingDepositTransactions, type]
      )
    }
  );

  return {
    transactions: transactions || [],
    isError,
    isLoading
  };
};

export default usePendingTransactions;
