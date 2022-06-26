import { isEqual, isObject } from "lodash";

const BANK_ACCOUNT_KEYS = ["accountId", "routingId", "country"];

const isBankAccount = bankAccount =>
  isObject(bankAccount) && BANK_ACCOUNT_KEYS.every(key => key in bankAccount);

export const findByBankAccount = (bankAccount, accounts = []) => {
  if (!isBankAccount(bankAccount) || !Array.isArray(accounts)) {
    return undefined;
  }
  return accounts.find(account => isEqual(account.bankAccount, bankAccount));
};
