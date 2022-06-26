import React from "react";
import { kebabCase } from "lodash";
import contributeIcon from "assets/icons/Contribute/contribute.svg";
import makePaymentIcon from "assets/icons/MakePayment/makePayment.svg";
import reloadIcon from "assets/icons/Reload/reload.svg";
import payBillIcon from "assets/icons/PayBill/pay-bill.blue.svg";
import transferIcon from "assets/icons/Transfer/transfer.svg";
import sendIcon from "assets/icons/Send/send.blue.svg";

const oneTimeBillPaymentPath = "/move-money/bill-payment/one-time";
const oneTimeTransferPath = "/move-money/transfer-between-accounts/one-time";
const eTransferPath = "/move-money/send-money";

const SORTED_QUICK_ACTIONS = [
  "etransfer",
  "payBill",
  "transferFrom",
  "makeBillPayment",
  "contribute",
  "makePayment",
  "reload"
];

export const filterQuickActions = quickActions =>
  SORTED_QUICK_ACTIONS.reduce(
    (activeActions, currentAction) =>
      quickActions[currentAction] === true
        ? [...activeActions, currentAction]
        : activeActions,
    []
  );

const getQuickActionPropsMap = {
  // e-Transfer quick actions
  etransfer: ({ bankAccount }) => ({
    icon: sendIcon,
    label: (
      <>
        Send by <i>Interac</i> e-Transfer
      </>
    ),
    redirectTo: {
      pathname: eTransferPath,
      hash: "#create",
      from: bankAccount
    }
  }),

  // Bill payment quick actions
  payBill: ({ bankAccount }) => ({
    icon: payBillIcon,
    label: "Pay bill",
    redirectTo: {
      pathname: oneTimeBillPaymentPath,
      hash: "#create",
      from: bankAccount
    }
  }),
  makeBillPayment: ({
    creditCardNumber,
    currency,
    associatedCreditCardNumbers
  }) => ({
    icon: makePaymentIcon,
    label: "Make payment",
    redirectTo: {
      pathname: oneTimeBillPaymentPath,
      hash: "#create",
      to: {
        accountNumber: creditCardNumber,
        currency,
        associatedAccountNumbers: associatedCreditCardNumbers
      }
    }
  }),
  reload: ({ creditCardNumber, currency, associatedCreditCardNumbers }) => ({
    icon: reloadIcon,
    label: "Reload",
    redirectTo: {
      pathname: oneTimeBillPaymentPath,
      hash: "#create",
      to: {
        accountNumber: creditCardNumber,
        currency,
        associatedAccountNumbers: associatedCreditCardNumbers
      }
    }
  }),

  // Transfers quick actions
  transferFrom: ({ bankAccount }) => ({
    icon: transferIcon,
    label: "Transfer",
    redirectTo: {
      pathname: oneTimeTransferPath,
      hash: "#create",
      from: bankAccount
    }
  }),
  contribute: ({ bankAccount }) => ({
    icon: contributeIcon,
    label: "Contribute",
    redirectTo: {
      pathname: oneTimeTransferPath,
      hash: "#create",
      to: bankAccount
    }
  }),
  makePayment: ({ bankAccount }) => ({
    icon: makePaymentIcon,
    label: "Make payment",
    redirectTo: {
      pathname: oneTimeTransferPath,
      hash: "#create",
      to: bankAccount
    }
  })
};

const getQuickActionId = (quickAction, { name, number }) =>
  `${name} (${number}) ${kebabCase(quickAction)}`;

export const getQuickActionProps = (quickAction, account) => {
  const getProps = getQuickActionPropsMap[quickAction];
  return getProps
    ? {
        ...getProps(account),
        id: getQuickActionId(quickAction, account)
      }
    : undefined;
};

export const mapQuickActions = (quickActions, account) => {
  if (!quickActions) {
    return [];
  }

  const filteredActions = filterQuickActions(quickActions);

  return filteredActions.reduce((actions, current) => {
    const props = getQuickActionProps(current, account);
    return props ? [...actions, props] : actions;
  }, []);
};
