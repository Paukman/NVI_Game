export const handleOnDecline = (
  selectionForm,
  onDecline,
  declineForm,
  eTransferId
) => {
  const data = {
    ...selectionForm.getFieldsValue(),
    eTransferId
  };
  onDecline(data);
  declineForm.setFieldsValue({
    senderName: selectionForm.getFieldValue("senderName"),
    amount: selectionForm.getFieldValue("amount"),
    beneficiaryMessage: ""
  });
};

export const onFormFinish = async (
  name,
  { values, forms },
  eTransferId,
  onDeposit,
  eligibleAccountsFormatted
) => {
  switch (name) {
    case "accountSelectionForm": {
      const formData = {
        ...values,
        eTransferId
      };
      const result = await onDeposit(formData);
      const account = eligibleAccountsFormatted.filter(
        item => item.key === values.toAccounts
      );
      const toAccount = account.length ? account[0].text : "";
      forms.confirmForm.setFieldsValue({
        senderName: forms.accountSelectionForm.getFieldValue("senderName"),
        amount: forms.accountSelectionForm.getFieldValue("amount"),
        toAccount,
        beneficiaryMessage: ""
      });
      return result;
    }
    default: {
      return null;
    }
  }
};
