import { formatCurrency, formatDate, getLastDigits } from "utils";
import { failedTransactionMessages } from "utils/MessageCatalog";

const failureReasonType = {
  ACCOUNT_CLOSED: "Funding_Account_Closed",
  ACCOUNT_INACTIVE: "Funding_Account_Dormant",
  ACCOUNT_LOCKED: "Funding_Account_Locked",
  INSUFFICIENT_FUNDS: "Funding_Account_NSF"
};

const transactionType = {
  BILL_PAYMENT: "BillPayment",
  TRANSFER: "Transfer"
};

const failureReasonMap = {
  [failureReasonType.ACCOUNT_CLOSED]: "Account closed",
  [failureReasonType.ACCOUNT_INACTIVE]: "Account inactive",
  [failureReasonType.ACCOUNT_LOCKED]: "Account locked",
  [failureReasonType.INSUFFICIENT_FUNDS]: "Insufficient funds"
};

const getFailureReason = failureReason =>
  failureReasonMap[failureReason] ?? "Unknown";

const accountStatusMap = {
  [failureReasonType.ACCOUNT_CLOSED]: "closed",
  [failureReasonType.ACCOUNT_INACTIVE]: "inactive",
  [failureReasonType.ACCOUNT_LOCKED]: "locked"
};

const getAccountStatus = failureReason =>
  accountStatusMap[failureReason] ?? null;

const getDesc = ({ paymentType, failureReason }, { amount, toName }) => {
  const accountStatus = getAccountStatus(failureReason);

  if (paymentType === transactionType.TRANSFER) {
    if (accountStatus) {
      return failedTransactionMessages.MSG_RBFTA_004B(amount, accountStatus);
    }
    return failureReason === failureReasonType.INSUFFICIENT_FUNDS
      ? failedTransactionMessages.MSG_RBFTA_001(amount, "insufficient funds")
      : failedTransactionMessages.MSG_RBFTA_001B(amount);
  }

  if (paymentType === transactionType.BILL_PAYMENT) {
    if (accountStatus) {
      return failedTransactionMessages.MSG_RBFTA_004(
        amount,
        toName,
        accountStatus
      );
    }
    return failureReason === failureReasonType.INSUFFICIENT_FUNDS
      ? failedTransactionMessages.MSG_RBFTA_002(
          amount,
          toName,
          "insufficient funds"
        )
      : failedTransactionMessages.MSG_RBFTA_002B(amount, toName);
  }

  return "";
};

/**
 * With transfers, there is currently no way to determine if the `to` or `from` account is the
 * cause. However, we're (likely) never going to reach this case with the current SAP config:
 *
 * SAP seems to not be marking transactions that should fail due to account inactivity
 * (closed, inactive, locked) as failed. Instead, they make two successful transactions;
 * one that is the original transaction (that should fail), and then an immediate
 * reversal of that first transaction. No notification is sent.
 *
 * Will need to revisit this once SAP fix is applied. For now, just defaulting to `to` for transfers.
 */
const getAccountStatusDesc = (
  { failureReason, paymentType },
  { toName, fromName }
) => {
  const accountStatus = getAccountStatus(failureReason);
  if (!accountStatus) {
    return null;
  }

  const account = paymentType === transactionType.TRANSFER ? toName : fromName;
  return failedTransactionMessages.MSG_RBFTA_004C(account, accountStatus);
};

const formatAccountName = ({ nickname, name, number, customerReference }) => {
  const last4Digits = getLastDigits(number || customerReference);
  return `${nickname || name} (${last4Digits})`;
};

const formatAccounts = ({
  failureReason,
  fromAccount,
  payee,
  paymentType,
  toAccount
}) => {
  const fromName = formatAccountName(fromAccount);
  const toName = formatAccountName(toAccount || payee);

  const accounts = { fromName, toName };

  const accountStatus = getAccountStatus(failureReason);
  if (accountStatus && paymentType === transactionType.BILL_PAYMENT) {
    const fromWithStatus = `${fromName} - ${accountStatus}`;
    return { ...accounts, fromWithStatus };
  }
  // Will need to revisit if/when SAP changes are made (see getAccountStatusDesc comment)
  if (accountStatus && paymentType === transactionType.TRANSFER) {
    const toWithStatus = `${toName} - ${accountStatus}`;
    return { ...accounts, toWithStatus };
  }

  return accounts;
};

export const mapFailedTransaction = txn => {
  const associatedFees = "None";
  const amount = formatCurrency(txn.amount.value, txn.amount.currency);
  const failureReason = getFailureReason(txn.failureReason);
  const failureDate = formatDate(txn.failureDate);

  const { fromName, toName, fromWithStatus, toWithStatus } = formatAccounts(
    txn
  );

  const desc = getDesc(txn, { amount, toName });
  const accountStatusDesc = getAccountStatusDesc(txn, {
    toName,
    fromName
  });

  const {
    paymentOrderNumber,
    isAcknowledged,
    recurringPaymentInformation
  } = txn;

  return {
    id: paymentOrderNumber,
    desc,
    from: fromWithStatus || fromName,
    to: toWithStatus || toName,
    amount,
    failureDate,
    failureReason,
    associatedFees,
    isAcknowledged,
    accountStatusDesc,
    recurringPaymentInformation
  };
};
