// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import React, { useContext, createContext } from "react";
import { useHistory } from "react-router-dom";
import { PromptContext } from "Common/PromptProvider";
import classNames from "classnames";
import { Form } from "antd";
import AccountSelectionForm from "./AccountSelectionForm";
import ConfirmPage from "../ConfirmPage";
import DeclinePage from "../DeclinePage";
import useAcceptDeposit from "./useAcceptDeposit";

export const AccountSelectionContext = createContext();

const AccountSelectionProvider = ({ receiveEState }) => {
  const history = useHistory();
  const {
    blockLocation,
    blockClosingBrowser,
    onCommit,
    promptState,
    onCancel
  } = useContext(PromptContext);

  const { deposit, onDeposit, onDecline } = useAcceptDeposit(onCommit);

  const { pageToRender } = deposit;

  const {
    receiveMoneyData,
    eligibleAccountsFormatted,
    eligibleAccounts
  } = receiveEState;

  const { eTransferId } = receiveMoneyData;

  const [declineForm] = Form.useForm();
  const [selectionForm] = Form.useForm();
  const [confirmForm] = Form.useForm();

  const handleOnDecline = () => {
    const data = {
      ...selectionForm.getFieldsValue(),
      eTransferId
    };
    onDecline(data);
    declineForm.setFieldsValue({
      senderName: selectionForm.getFieldValue("senderName"),
      amount: selectionForm.getFieldValue("amount"),
      beneficiaryMessage: selectionForm.getFieldValue("beneficiaryMessage")
    });
  };

  const handleViewAccountDetails = () => {
    const accountToDeposit = eligibleAccounts.filter(
      account => account.id === selectionForm.getFieldValue("toAccounts")
    );
    history.push(
      `/details/${accountToDeposit[0].type.toLowerCase()}/${selectionForm.getFieldValue(
        "toAccounts"
      )}`
    );
  };

  const onFormFinish = async (name, { values, forms }) => {
    switch (name) {
      case "accountSelectionForm": {
        const formData = {
          ...values,
          eTransferId
        };
        const account = eligibleAccountsFormatted.filter(
          item => item.key === values.toAccounts
        );
        const toAccount = account.length ? account[0].text : "";

        forms.confirmForm.setFieldsValue({
          senderName: forms.accountSelectionForm.getFieldValue("senderName"),
          amount: forms.accountSelectionForm.getFieldValue("amount"),
          toAccount,
          beneficiaryMessage: forms.accountSelectionForm.getFieldValue(
            "beneficiaryMessage"
          )
        });
        await onDeposit(formData);
        return null;
      }
      default: {
        return null;
      }
    }
  };
  return (
    <AccountSelectionContext.Provider
      value={{
        receiveEState,
        deposit,
        onDeposit,
        onDecline,
        blockLocation,
        blockClosingBrowser,
        onCommit,
        promptState,
        onCancel
      }}
    >
      <Form.Provider onFormFinish={onFormFinish}>
        <div
          className={classNames(
            { "display-none": pageToRender !== "AccountSelectionForm" },
            { "display-block": pageToRender === "AccountSelectionForm" }
          )}
        >
          <AccountSelectionForm
            form={selectionForm}
            handleOnDecline={handleOnDecline}
          />
        </div>
        <div
          className={classNames(
            { "display-none": pageToRender !== "ConfirmPage" },
            { "display-block": pageToRender === "ConfirmPage" }
          )}
        >
          <ConfirmPage
            form={confirmForm}
            handleViewAccountDetails={handleViewAccountDetails}
          />
        </div>
        <div
          className={classNames(
            { "display-none": pageToRender !== "DeclinePage" },
            { "display-block": pageToRender === "DeclinePage" }
          )}
        >
          <DeclinePage form={declineForm} />
        </div>
        {/* for testing only */}
        {!pageToRender && <div data-testid="accountSelection-component" />}
      </Form.Provider>
    </AccountSelectionContext.Provider>
  );
};

export default AccountSelectionProvider;
