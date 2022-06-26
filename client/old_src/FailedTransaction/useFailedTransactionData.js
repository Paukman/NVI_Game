import { useState } from "react";
import { useAsyncEffect } from "use-async-effect";
import { useAtom } from "jotai";
import api, { failedTransactionsUrl } from "api";
import { mapFailedTransaction } from "./mapFailedTransaction";

import {
  failedTransactionsAtom,
  notificationTriggerAtom,
  unreadCountAtom
} from "./failedTransactionAtoms";

const useFailedTransactionData = () => {
  const [failedTransactions, setFailedTransactions] = useAtom(
    failedTransactionsAtom
  );
  const [, setNotificationTrigger] = useAtom(notificationTriggerAtom);
  const [unreadCount] = useAtom(unreadCountAtom);
  const [error, setError] = useState(null);

  const markTransactionAsRead = txn => {
    if (!txn.isAcknowledged) {
      api.post(`${failedTransactionsUrl}/acknowledgedTransactions`, {
        paymentOrderNumber: txn.id,
        paymentOrderDate: txn.failureDate
      });

      const updatedList = { ...failedTransactions };
      const dates = Object.keys(updatedList);
      dates.forEach(date =>
        updatedList[date].forEach(t => {
          if (txn.id === t.id) {
            t.isAcknowledged = true;
          }
        })
      );
      setFailedTransactions(updatedList);
    }
  };

  useAsyncEffect(async isMounted => {
    setError(null);
    try {
      const response = await api.get(
        `${failedTransactionsUrl}/failedTransactions`
      );

      // Handle `No Content` response
      if (response.status === 204) return;

      const displayTransactions = response.data.reduce((txnByDay, txn) => {
        txnByDay[txn.failureDate] = [
          ...(txnByDay[txn.failureDate] || []),
          mapFailedTransaction(txn)
        ];
        return txnByDay;
      }, {});

      if (!isMounted()) return;

      setFailedTransactions(displayTransactions);
      setNotificationTrigger(true);
    } catch (e) {
      setError(e);
    }
  }, []);

  return {
    failedTransactions,
    unreadCount,
    markTransactionAsRead,
    error
  };
};

export default useFailedTransactionData;
