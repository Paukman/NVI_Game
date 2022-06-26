import { useState } from "react";

const useDetailsTransition = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const selectTransaction = txn => {
    setSelectedTransaction(txn);
  };

  const unselectTransaction = () => {
    if (!selectedTransaction) return;
    setSelectedTransaction(null);
  };

  return {
    selectedTransaction,
    selectTransaction,
    unselectTransaction
  };
};

export default useDetailsTransition;
