import { atom } from "jotai";

export const drawerVisibleAtom = atom(false);

export const failedTransactionsAtom = atom();

export const notificationTriggerAtom = atom(false);

export const unreadCountAtom = atom(get => {
  const txnList = get(failedTransactionsAtom);

  if (!txnList) return 0;

  return Object.values(txnList)
    .flat()
    .reduce((total, txn) => total + (!txn.isAcknowledged ? 1 : 0), 0);
});
