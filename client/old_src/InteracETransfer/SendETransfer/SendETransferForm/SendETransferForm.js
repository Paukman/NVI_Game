import React, { useState, useEffect, useContext } from "react";
import { isEqual } from "lodash";
import PropTypes from "prop-types";
import { Dropdown, Input, TextArea } from "semantic-ui-react";
import useForm from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "react-query";
import accountIcon from "assets/icons/FromAccount/account.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import personIcon from "assets/icons/Person/person.svg";
import messageIcon from "assets/icons/Message/message.svg";
import downArrowIcon from "assets/icons/DownArrow/arrow_down.svg";
import AlertModal from "Common/AlertModal";
import { Skeleton } from "StyleGuide/Components";
import { formatCurrency } from "utils";
import useWindowDimensions from "utils/hooks/useWindowDimensions";
import { eTransferErrors } from "utils/MessageCatalog";
import {
  validateAmountRange,
  validateAmountBalance
} from "utils/formValidators";
import { queryKeys } from "api";

import { getLegalName } from "utils/getLegalName";
import AddRecipient from "../../AddRecipient/AddRecipient";
import EditSecurityQuestionAnswerModal from "../../AddRecipient/EditSecurityQuestionAnswerModal";

import { ETransferContext } from "../../ETransferProvider";

import SecurityQuestions from "./SecurityQuestions";
import useUpdateRecipient from "./hooks/useUpdateRecipient";

// avoid relative paths when calling things that aren't nested
import useMask from "../../../utils/hooks/useMask";

import {
  floatValue,
  withdrawalAccounts,
  depositAccounts,
  locateDepositSecurity,
  unFormatCurrency,
  numberFilter
} from "../../../utils/formUtils";
import "styles/forms/global.scss";
import "./styles.scss";

import { validateAmountLimits, validateDepositorHashType } from "./validators";
import AddRecipientProvider from "../../AddRecipient/AddRecipientProvider";

const SendETransferForm = ({
  id,
  eTransferData,
  setETransferSubmit,
  nextTab,
  persistedData,
  showForm,
  setShowForm,
  setFormData
}) => {
  SendETransferForm.propTypes = {
    id: PropTypes.string.isRequired,
    eTransferData: PropTypes.shape({}).isRequired,
    setETransferSubmit: PropTypes.func.isRequired,
    nextTab: PropTypes.func.isRequired,
    // TODO - re-use the proptypes from ReviewAndComplete
    persistedData: PropTypes.shape({}),
    showForm: PropTypes.bool.isRequired,
    setShowForm: PropTypes.func.isRequired,
    setFormData: PropTypes.func.isRequired
  };

  SendETransferForm.defaultProps = {
    persistedData: {}
  };

  const {
    register,
    handleSubmit,
    setValue,
    triggerValidation,
    setError,
    errors,
    getValues,
    clearError
  } = useForm();

  const { width } = useWindowDimensions();
  const { updateRecipient, isPosting } = useUpdateRecipient();

  const [showQuestions, setShowQuestions] = useState(true);
  const [showSecurity, setShowSecurity] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [toRecipient, setToRecipient] = useState(null);
  const [recipientLegalName, setRecipientLegalName] = useState("");
  const [alertError, setAlertError] = useState({});
  const [isShowing, setIsShowing] = useState(true);
  const [inlineLimitsError, setInlineLimitsError] = useState("");
  const [directDepositNumber, setDirectDepositNumber] = useState("");
  const [maskedValue, unmaskedValue, onChangeMask] = useMask(
    formatCurrency,
    unFormatCurrency
  );
  const queryClient = useQueryClient();
  // controlled state for persistence w/ edit
  const [fromData, setFromData] = useState();
  const [messageData, setMessageData] = useState("");
  const [amount, setAmount] = useState("");
  const [isQuestionExpired, setIsQuestionExpired] = useState(false);

  const { send } = useContext(ETransferContext);
  const {
    sendState,
    onChange,
    showAddRecipient,
    showEditSecurityQuestionAnswer,
    validateEmailAddress
  } = send;

  const location = useLocation();

  const handleOk = () => {
    setShowForm(true);
    setIsShowing(false);
    setAlertError({});
  };

  const handleEditRecipientQuestion = () => {
    handleOk();
    setIsQuestionExpired(true);
  };

  const resetRecipientFieldError = () => {
    clearError("to");
  };

  useEffect(() => {
    setAlertError({});
    register(
      {
        name: "from"
      },
      {
        required: eTransferErrors.MSG_RBET_002
      }
    );
    register(
      {
        name: "to"
      },
      {
        required: eTransferErrors.MSG_RBET_007,
        validate: {
          // Ensure the recipient's email security configuration is SHA2 compliant
          shaencryption: value => {
            return validateDepositorHashType(
              value,
              eTransferData.depositAccounts,
              setAlertError,
              handleOk,
              handleEditRecipientQuestion
            );
          }
        }
      }
    );
    register(
      {
        name: "amount"
      },
      {
        required: eTransferErrors.MSG_RBET_025,
        validate: {
          nonBlankValue: value => {
            if (value === undefined) {
              return eTransferErrors.MSG_RBET_025;
            }
            return true;
          },
          // Ensure amount does not exceed the current balance of the currently selected withdrawal account
          // Ensure amount does not exceed Interac single transaction limit min/max
          balancelimit: value => {
            if (value === undefined) {
              // TODO why doesn't nonBlankValue failing not stop balanceLimit from triggering, too?
              // added as guard produced by degenerate test case
              return eTransferErrors.MSG_RBET_025;
            }
            return validateAmountBalance(
              floatValue(value),
              eTransferData.withdrawalAccounts,
              getValues("from"),
              eTransferErrors.MSG_RBET_004
            );
          },
          // Ensure the amount is sane numerically
          // TODO: numeric check incomplete based on final Input / behaviour work
          // and is within interac minimum and maximum
          amountrange: value => {
            if (value === undefined) {
              // TODO why doesn't nonBlankValue failing not stop balanceLimit from triggering, too?
              // added as guard produced by degenerate test case
              return eTransferErrors.MSG_RBET_025;
            }
            return validateAmountRange(
              floatValue(value),
              eTransferData.interacLimits.limits.outgoingLimits.minAmount,
              eTransferData.interacLimits.limits.outgoingLimits.maxAmount,
              eTransferErrors.MSG_RBET_012(
                eTransferData.interacLimits.limits.outgoingLimits.minAmount,
                eTransferData.interacLimits.limits.outgoingLimits.maxAmount
              )
            );
          }
        }
      }
    );
    register({ name: "message" });
  }, [eTransferData, register]);

  useEffect(() => {
    if (location.hash !== "#create") {
      return;
    }

    const { from } = location;
    if (!from) {
      return;
    }
    const fromAccount = eTransferData?.withdrawalAccounts?.find(account =>
      isEqual(account.bankAccount, from)
    );
    if (fromAccount) {
      setFromData(fromAccount.id);
      setValue("from", fromAccount.id);
    }
  }, [location, eTransferData.withdrawalAccounts]);

  const handleError = () => {
    if (!alertError) {
      return;
    }
    if (alertError.title) {
      if (alertError.title === "Invalid Registration Email") {
        setError("to", "email", eTransferErrors.MSG_RBET_002_UNK);
      }
      if (alertError.title && alertError.title === "Autodeposit Change") {
        setError("to", "email", eTransferErrors.MSG_RBET_001_UNK);
      }
    }
  };

  const onSubmit = async data => {
    setInlineLimitsError("");
    await triggerValidation();
    await validateAmountLimits(
      data.amount,
      eTransferData,
      data.to,
      setAlertError,
      setInlineLimitsError,
      data,
      setETransferSubmit,
      nextTab,
      directDepositNumber,
      handleOk
    );
  };

  const handleOnChange = async (
    _,
    {
      name,
      value,
      isAddRecipient = false,
      recipients = null,
      isUpdatingRecipient = false
    }
  ) => {
    if (value === "add-recipient") {
      showAddRecipient(true);
      return;
    }
    // If new recipeint is added update state with new recipient list
    if (isAddRecipient) {
      eTransferData = { ...eTransferData, depositAccounts: recipients };
    }

    let emailOptions = null;
    // skip this if we've just updated recipient
    if (!isUpdatingRecipient) {
      const selectedAccount = eTransferData.depositAccounts.find(
        account => account.recipientId === value
      );
      emailOptions = await validateEmailAddress(value, selectedAccount);
      if (emailOptions?.customerName?.legalName?.retailName?.firstName) {
        const legalName = getLegalName({}, emailOptions.customerName);
        setRecipientLegalName(legalName);
      }
      if (
        emailOptions?.transferType === 0 &&
        // this might be a user that doesn't have q/a
        selectedAccount.defaultTransferAuthentication.authenticationType ===
          "None"
      ) {
        // update our hook with recipient data, so the modal can use it
        onChange({ name: "recipientName", value: selectedAccount.aliasName });
        onChange({ name: "recipientId", value: selectedAccount.recipientId });
        onChange({
          name: "recipientEmail",
          value: selectedAccount.notificationPreference[0].notificationHandle
        });
        showEditSecurityQuestionAnswer(true);
        return;
      }
      if (emailOptions?.transferType === 2) {
        setDirectDepositNumber(emailOptions.directDepositReferenceNumber);
      }
    }

    // get api

    locateDepositSecurity(
      value,
      setShowSecurity,
      setSecurityQuestion,
      setShowQuestions,
      eTransferData,
      setToRecipient,
      emailOptions ? emailOptions.transferType : null
    );
    setIsShowing(true);
    onChange({ name, value });
    setValue(name, value);
    await triggerValidation({ name });
  };

  const fillForm = sendData => {
    Object.keys(sendData).map(async field => {
      if (field === "from") {
        setValue(field, sendData[field].id);
        return setFromData(sendData[field].id);
      }
      if (field === "to") {
        handleOnChange(null, { name: field, value: sendState.to });
        return null;
      }
      if (field === "securityQuestion") {
        setValue(field, sendData[field]);
        setShowSecurity(true);

        // autodeposit cases
        if (sendData[field] === undefined) {
          setShowQuestions(false);
        } else {
          setShowQuestions(true);
        }

        return setSecurityQuestion(sendData[field]);
      }
      if (field === "message") {
        setValue(field, sendData[field]);
        return setMessageData(sendData[field] || "");
      }
      if (field === "amount") {
        setAmount(sendData[field]);
        onChangeMask(sendData[field]);
        return setValue(field, sendData[field]);
      }
      return setValue(field, sendData[field]);
    });
  };

  useEffect(() => {
    if (persistedData) {
      fillForm(persistedData);
    }
  }, [persistedData]);

  useEffect(() => {
    if (toRecipient) {
      locateDepositSecurity(
        toRecipient.recipientId,
        setShowSecurity,
        setSecurityQuestion,
        setShowQuestions,
        eTransferData,
        setToRecipient
      );
    }
  }, [eTransferData]);

  const messageText =
    width < 768 ? "Message (optional)" : "Message to recipient (optional)";
  const handleFromOnChange = async (e, { name, value }) => {
    setFromData(value);
    setValue(name, value);
    await triggerValidation({ name });
  };
  const handleAmountOnChange = async (_, { name, value }) => {
    setAlertError({});
    setInlineLimitsError("");
    setIsShowing(true);
    onChangeMask(value);
    const filtered = numberFilter(value);
    setAmount(filtered);
    await triggerValidation(name);
  };

  const handleMemoOnChange = async (_, { name, value }) => {
    setMessageData(value || "");
    setValue(name, value);
    await triggerValidation(name);
  };

  const handleUpdateRecipient = async ({
    selectedRecipient,
    setShowEditModal,
    question,
    answer
  }) => {
    await updateRecipient(
      selectedRecipient,
      setShowEditModal,
      question,
      answer,
      resetRecipientFieldError
    );

    queryClient.setQueryData(queryKeys.RECIPIENTS, prevRecipients => {
      return prevRecipients.map(recipient =>
        recipient.recipientId === selectedRecipient.recipientId
          ? selectedRecipient
          : recipient
      );
    });
    queryClient.invalidateQueries(queryKeys.RECIPIENTS);
    locateDepositSecurity(
      selectedRecipient.recipientId,
      setShowSecurity,
      setSecurityQuestion,
      setShowQuestions,
      eTransferData,
      setToRecipient
    );
  };

  const handleAddRecipient = async newRecipient => {
    const recipients = [...eTransferData.depositAccounts];
    recipients.push(newRecipient);

    setFormData(state => ({
      ...state,
      depositAccounts: recipients
    }));
    handleOnChange(null, {
      name: "to",
      value: newRecipient.recipientId,
      isAddRecipient: true,
      recipients
    });
  };

  const handleEditRecipient = async editedRecipient => {
    const recipients = eTransferData.depositAccounts.map(account =>
      account.recipientId === editedRecipient.recipientId
        ? editedRecipient
        : account
    );

    setFormData(state => ({
      ...state,
      depositAccounts: recipients
    }));

    handleOnChange(null, {
      name: "to",
      value: editedRecipient.recipientId,
      isAddRecipient: false,
      recipients,
      isUpdatingRecipient: true
    });
  };

  const handleOnBlur = async () => {
    setAmount(maskedValue || "");
    await triggerValidation({ name: "amount" });
  };

  const handleOnFocus = async () => {
    setAmount(maskedValue || "");
  };

  useEffect(() => {
    const setAndValidate = async () => {
      setValue("amount", unmaskedValue);
      if (unmaskedValue) {
        await triggerValidation({ name: "amount" });
      }
    };
    setAndValidate();
  }, [maskedValue, unmaskedValue]);

  return (
    <>
      <form
        className="rebank-form etransfer-form"
        id={`${id}-form`}
        data-testid={`${id}-form`}
        onSubmit={handleSubmit(onSubmit)}
        onLoad={handleError}
      >
        {alertError.title && (
          <AlertModal
            key={alert.id}
            id={`${id}-alert-modal`}
            data-testid={`${id}-alert-modal`}
            alertMessage={alertError}
            isShowing={isShowing}
            setIsShowing={setIsShowing}
          />
        )}
        <Skeleton
          sizeMedium
          loading={!showForm}
          className="form-skeleton form-skeleton-align-stepper"
          data-testid="send-etransfer-skeleton"
        >
          <div id={`${id}-from`} data-testid={`${id}-from`}>
            <div className="form-icon">
              <img
                id={`${id}-from-icon`}
                data-testid={`${id}-from-icon`}
                src={accountIcon}
                alt="From Account"
              />
            </div>
            <div className="form-inputs">
              <p
                className="form-label"
                id={`${id}-from-label`}
                data-testid={`${id}-from-label`}
              >
                From
              </p>
              <Dropdown
                id={`${id}-from-select`}
                data-testid={`${id}-from-select`}
                name="from"
                value={fromData}
                fluid
                options={withdrawalAccounts(eTransferData, width)}
                placeholder="Select account"
                selection
                search
                selectOnNavigation={false}
                selectOnBlur={false}
                onChange={handleFromOnChange}
                className={`${errors.from ? "has-errors" : ""}`}
              />
              <p
                className="error from"
                id="from-error"
                data-testid="from-error"
              >
                {errors.from && errors.from.message}
              </p>
            </div>
          </div>
          <div className="form-arrow">
            <img
              id={`${id}-down-arrow-icon`}
              data-testid={`${id}-down-arrow-icon`}
              src={downArrowIcon}
              alt="Down Arrow"
            />
          </div>
          <div
            id={`${id}-to`}
            className="form-to"
            data-testid={`to-autodeposit-${directDepositNumber}`}
          >
            <div className="form-icon">
              <img
                id={`${id}-to-icon`}
                data-testid={`${id}-to-icon`}
                src={personIcon}
                alt="Select recipient"
              />
            </div>
            <div className="form-inputs">
              <p
                className="form-label"
                id={`${id}-to-label`}
                data-testid={`${id}-to-label`}
              >
                To
              </p>
              <Dropdown
                id={`${id}-to-select`}
                data-testid={`${id}-to-select`}
                name="to"
                value={sendState.to}
                fluid
                options={depositAccounts(eTransferData)}
                placeholder="Select recipient"
                selection
                search
                selectOnNavigation={false}
                selectOnBlur={false}
                onChange={handleOnChange}
                className={`${errors.to ? "has-errors" : ""}`}
              />
              <p className="error to" id="to-error" data-testid="to-error">
                {errors.to && errors.to.message}
              </p>
              {/* <div className="edit-add-recipient">{renderRecipientLinks()}</div> */}
            </div>
          </div>
          <SecurityQuestions
            id={`${id}-security-questions`}
            data-testid={`${id}-security-questions`}
            showQuestions={showQuestions}
            showSecurity={showSecurity}
            securityQuestion={securityQuestion}
            selectedRecipient={{
              ...toRecipient,
              legalName: recipientLegalName
            }}
            handleUpdateRecipient={handleUpdateRecipient}
            isPosting={isPosting}
            isQuestionExpired={isQuestionExpired}
            setIsQuestionExpired={setIsQuestionExpired}
          />
          <div
            className="input-spacing"
            id={`${id}-amount`}
            data-testid={`${id}-amount`}
          >
            <div className="form-icon">
              <img
                id={`${id}-amount-icon`}
                data-testid={`${id}-amount-icon`}
                src={moneyIcon}
                alt="Amount"
              />
            </div>
          </div>
          <div className="form-inputs">
            <p
              className="form-label"
              id={`${id}-amount-label`}
              data-testid={`${id}-amount-label`}
            >
              Amount
            </p>
            <Input
              name="amount"
              id={`${id}-amount-input`}
              data-testid={`${id}-amount-input`}
              placeholder="$"
              autoComplete="off"
              onBlur={handleOnBlur}
              onFocus={handleOnFocus}
              onChange={handleAmountOnChange}
              value={amount}
              className={`${
                errors.amount || inlineLimitsError ? "has-errors" : ""
              }`}
            />
            <p
              className="error amount"
              id="amount-error"
              data-testid="amount-error"
            >
              {errors.amount ? errors.amount.message : inlineLimitsError}
            </p>
          </div>
          <div
            className="form-memo"
            id={`${id}-memo`}
            data-testid={`${id}-memo`}
          >
            <div className="form-icon">
              <img
                id={`${id}-message-icon`}
                data-testid={`${id}-message-icon`}
                src={messageIcon}
                alt="Message optional"
              />
            </div>
            <div className="form-inputs form-inputs-taller">
              <p
                className="form-memo-label"
                id={`${id}-memo-label`}
                data-testid={`${id}-memo-label`}
              >
                <span
                  className="form-label"
                  id={`${id}-message-label`}
                  data-testid={`${id}-message-label`}
                >
                  {messageText}
                </span>
                <span
                  className="form-counter"
                  id={`${id}-memo-counter`}
                  data-testid={`${id}-memo-counter`}
                >
                  {messageData?.length || "0"}/400
                </span>
              </p>

              <TextArea
                id={`${id}-memo-textarea`}
                data-testid={`${id}-memo-textarea`}
                name="message"
                className="form-text-area"
                maxLength="400"
                onChange={handleMemoOnChange}
                value={messageData}
              />
              <p
                className="error memo"
                id="memo-error"
                data-testid="memo-error"
              >
                {errors.memo && errors.memo.message}
              </p>
            </div>
          </div>
          <div className="clearfix form-next">
            <button type="submit" id="form-submit-button">
              Next
            </button>
          </div>
          <div>
            {sendState.showAddRecipient ? (
              <AddRecipientProvider
                showAddRecipient={showAddRecipient}
                handleAddRecipient={handleAddRecipient}
                recipientList={eTransferData.depositAccounts}
              >
                <AddRecipient />
              </AddRecipientProvider>
            ) : null}
          </div>
          <div>
            {sendState.showEditSecurityQuestionAnswer ? (
              <AddRecipientProvider
                showEditSecurityQuestionAnswer={showEditSecurityQuestionAnswer}
                handleEditRecipient={handleEditRecipient}
                recipient={sendState}
                recipientList={eTransferData.depositAccounts}
              >
                <EditSecurityQuestionAnswerModal />
              </AddRecipientProvider>
            ) : null}
          </div>
        </Skeleton>
      </form>
    </>
  );
};

export default SendETransferForm;
