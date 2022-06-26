import { formatCurrency } from "utils";
import { eTransferErrors } from "utils/MessageCatalog";
import { truncate } from "utils/formUtils";

const nameForCurrentDepositAccount = (accounts, selectedDepositAccount) => {
  const selectedAccount = accounts.find(
    ({ recipientId }) => recipientId === selectedDepositAccount
  );
  if (selectedAccount && selectedAccount.aliasName)
    return ` to ${truncate(selectedAccount.aliasName, 15)} `;
  return "";
};

const determineOverallLimit = interacLimits => {
  const limits = interacLimits.limits.outgoingLimits;
  const current = interacLimits.accumulatedAmount.outgoingAmounts;
  const daily = limits.max24HrAmount - current.total24HrAmount;
  const weekly = limits.max7DayAmount - current.total7DayAmount;
  const monthly = limits.max30DayAmount - current.total30DayAmount;
  const overallMinimum = Math.min(daily, weekly, monthly);
  return overallMinimum;
};

const validateAmountLimits = (
  value,
  eTransferData,
  selectedDepositAccount,
  setAlertError,
  setInlineLimitsError,
  combinedFormData,
  setETransferSubmit,
  nextTab,
  directDepositNumber,
  handleOk
) => {
  const valNumber = parseFloat(value);
  const limits = eTransferData.interacLimits.limits.outgoingLimits;
  const current = eTransferData.interacLimits.accumulatedAmount.outgoingAmounts;
  // These checks are order dependent
  if (valNumber + current.total24HrAmount > limits.max24HrAmount) {
    const recipients = eTransferData.depositAccounts;
    const recipientName = nameForCurrentDepositAccount(
      recipients,
      selectedDepositAccount
    );
    setAlertError({
      title: "Transaction Limit Exceeded",
      errorMessage: eTransferErrors.MSG_RBET_016(recipientName),
      buttons: [
        {
          buttonName: "OK",
          url: "/move-money/send-money",
          onClick: handleOk
        }
      ]
    });
    // TODO picking out the least minimum of the limits and showing is not specified
    // but it will produce a bug.
    setInlineLimitsError(
      eTransferErrors.MSG_RBET_016E(
        formatCurrency(determineOverallLimit(eTransferData.interacLimits))
      )
    );
  } else if (valNumber + current.total7DayAmount > limits.max7DayAmount) {
    const recipients = eTransferData.depositAccounts;
    const recipientName = nameForCurrentDepositAccount(
      recipients,
      selectedDepositAccount
    );
    setAlertError({
      title: "Transaction Limit Exceeded",
      errorMessage: eTransferErrors.MSG_RBET_016B(
        recipientName,
        formatCurrency(limits.max7DayAmount - current.total7DayAmount)
      ),
      buttons: [
        {
          buttonName: "OK",
          url: "/move-money/send-money",
          onClick: handleOk
        }
      ]
    });
    setInlineLimitsError(
      eTransferErrors.MSG_RBET_016E(
        formatCurrency(limits.max7DayAmount - current.total7DayAmount)
      )
    );
  } else if (valNumber + current.total30DayAmount > limits.max30DayAmount) {
    const recipients = eTransferData.depositAccounts;
    const recipientName = nameForCurrentDepositAccount(
      recipients,
      selectedDepositAccount
    );
    setAlertError({
      title: "Transaction Limit Exceeded",
      errorMessage: eTransferErrors.MSG_RBET_016C(
        recipientName,
        formatCurrency(limits.max30DayAmount - current.total30DayAmount)
      ),

      buttons: [
        {
          buttonName: "OK",
          url: "/move-money/send-money",
          onClick: handleOk
        }
      ]
    });
    setInlineLimitsError(
      eTransferErrors.MSG_RBET_003_UNK(
        formatCurrency(limits.max30DayAmount - current.total30DayAmount)
      )
    );
  } else {
    const from = eTransferData.withdrawalAccounts.filter(
      account => account.id === combinedFormData.from
    );
    const to = eTransferData.depositAccounts.filter(
      account => account.recipientId === combinedFormData.to
    );

    const formattedData = {
      ...combinedFormData,
      from: {
        name: `${from[0].name} (${from[0].number}) | ${formatCurrency(
          from[0].availableBalance.value
        )}`,
        id: combinedFormData.from,
        currency: from[0].currency
      },
      to: {
        name: `${to[0].aliasName} (${to[0].notificationPreference[0].notificationHandle})`,
        id: combinedFormData.to
      },
      securityQuestion: to[0].defaultTransferAuthentication.question,
      directDepositNumber
    };
    setETransferSubmit(formattedData);
    nextTab();
    return value;
  }

  return "";
};

const validateDepositorHashType = (
  value,
  depositAccounts,
  setAlertError,
  handleOk,
  handleEditRecipientQuestion
) => {
  const selectedDepositor = depositAccounts.find(
    ({ recipientId }) => recipientId === value
  );
  if (
    selectedDepositor?.defaultTransferAuthentication.hashType === "SHA2" ||
    selectedDepositor?.defaultTransferAuthentication.hashType === undefined
  ) {
    return true;
  }
  setAlertError({
    title: "Security Prompts Out-of-date",
    errorMessage: eTransferErrors.MSG_ET_060,
    buttons: [
      {
        buttonName: "Edit Recipient",
        onClick: handleEditRecipientQuestion
      },
      {
        buttonName: "OK",
        url: "/move-money/send-money",
        onClick: handleOk
      }
    ]
  });
  return eTransferErrors.MSG_RBET_001_UNK;
};

export { validateAmountLimits, validateDepositorHashType };
