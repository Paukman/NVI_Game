import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Dropdown, Input, TextArea } from "semantic-ui-react";
import useForm from "react-hook-form";

import accountIcon from "assets/icons/FromAccount/account.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import personIcon from "assets/icons/Person/person.svg";
import messageIcon from "assets/icons/Message/message.svg";
import downArrowIcon from "assets/icons/DownArrow/arrow_down.svg";
import { Skeleton } from "StyleGuide/Components";
import useMask from "utils/hooks/useMask";
import { formatCurrency } from "utils";
import useWindowDimensions from "utils/hooks/useWindowDimensions";

import { requestETransferErrors } from "utils/MessageCatalog";
import { ETransferContext } from "../../ETransferProvider";
import { formatReviewPageData } from "./utils";
import {
  unFormatCurrency,
  depositAccounts as formatRecipients,
  withdrawalAccounts as formatDepositToAccounts,
  floatValue,
  numberFilter
} from "../../../utils/formUtils";
import { validateAmountRange } from "./validators";
import "./RequestETransferForm.scss";
import "styles/forms/global.scss";
import AddRecipient from "../../AddRecipient/AddRecipient";
import AddRecipientProvider from "../../AddRecipient/AddRecipientProvider";

const RequestETransferForm = ({
  id,
  eTransferData,
  setRequestETransferSubmit,
  nextTab,
  persistedData,
  setFormData,
  onReviewAnalytics
}) => {
  RequestETransferForm.propTypes = {
    id: PropTypes.string.isRequired,
    eTransferData: PropTypes.shape({}).isRequired,
    setRequestETransferSubmit: PropTypes.func.isRequired,
    nextTab: PropTypes.func.isRequired,
    persistedData: PropTypes.shape({}),
    setFormData: PropTypes.func.isRequired,
    onReviewAnalytics: PropTypes.func
  };

  RequestETransferForm.defaultProps = {
    persistedData: {},
    onReviewAnalytics: () => {}
  };

  const { request } = useContext(ETransferContext);
  const { requestState, onChange, showAddRecipient } = request;

  const {
    handleSubmit,
    setValue,
    triggerValidation,
    register,
    errors
  } = useForm();
  const { width } = useWindowDimensions();

  const [maskedValue, unmaskedValue, onChangeMask] = useMask(
    formatCurrency,
    unFormatCurrency
  );

  // controlled state for persistence w/ edit
  const [toData, setToData] = useState();
  const [messageData, setMessageData] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    register(
      {
        name: "from"
      },
      {
        required: requestETransferErrors.MSG_RBET_007B
      }
    );
    register(
      {
        name: "to"
      },
      {
        required: requestETransferErrors.MSG_RBET_002
        // TODO: So, like, why wouldn't we validate SHA encryption here, too?
        // TODO: or why wouldn't we validate Current Eligibility here, too?
      }
    );
    register(
      {
        name: "amount"
      },
      {
        required: requestETransferErrors.MSG_RBET_012C,
        validate: {
          amountRange: value =>
            validateAmountRange(floatValue(value), eTransferData.interacLimits)
        }
      }
    );
    register({ name: "message" });
  }, [eTransferData, register]);

  const fillRequestEtransferForm = formData => {
    Object.keys(formData).map(async field => {
      if (field === "amount") {
        setAmount(formData[field]);
        onChangeMask(formData[field]);
        return setValue(field, formData[field]);
      }
      if (field === "message") {
        setMessageData(formData[field] || "");
        return setValue(field, formData[field]);
      }
      if (field === "from") {
        setValue(field, requestState.from);
        return null;
      }
      if (field === "to") {
        setValue(field, formData[field].id);
        return setToData(formData[field].id);
      }
      return setValue(field, formData[field]);
    });
  };

  // when we edit/back to create page from review persistedData is going to hold form data
  // that was previously entered

  useEffect(() => {
    if (persistedData) {
      fillRequestEtransferForm(persistedData);
    }
  }, [persistedData]);

  const handleMessageOnChange = async (_, { name, value }) => {
    setMessageData(value || "");
    setValue(name, value);
  };

  const handleFromOnChange = async (_, { name, value }) => {
    if (value === "add-recipient") {
      showAddRecipient(true);
      return;
    }
    onChange({ name, value });
    setValue(name, value);
    await triggerValidation({ name });
  };

  const handleAddRecipient = async newRecipient => {
    const recipients = [...eTransferData.depositAccounts];
    recipients.push(newRecipient);

    setFormData(state => ({
      ...state,
      depositAccounts: recipients
    }));
    handleFromOnChange(null, { name: "from", value: newRecipient.recipientId });
  };

  const handleToOnChange = async (_, { name, value }) => {
    setValue(name, value);
    setToData(value);
    await triggerValidation({ name });
  };

  const handleAmountOnChange = async (_, { name, value }) => {
    onChangeMask(value);
    const filtered = numberFilter(value);
    setAmount(filtered);
    await triggerValidation({ name });
  };

  const handleAmountOnBlur = async () => {
    setAmount(maskedValue || "");
    await triggerValidation({ name: "amount" });
  };

  const handleAmountOnFocus = async () => {
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

  const onSubmit = async formData => {
    await triggerValidation();
    const formattedData = formatReviewPageData(formData, eTransferData);
    setRequestETransferSubmit(formattedData);
    onReviewAnalytics(formattedData);
    nextTab();
  };

  return (
    <form
      className="rebank-form request-etransfer-form"
      id={`${id}-form`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Skeleton
        sizeMedium
        loading={eTransferData.loading}
        className="form-skeleton form-skeleton-align-stepper"
        data-testid="request-etransfer-skeleton"
      >
        <div id={`${id}-from`}>
          <div className="form-icon">
            <img
              id={`${id}-from-icon`}
              src={personIcon}
              alt="Select recipient"
            />
          </div>
          <div className="form-inputs">
            <p className="form-label" id={`${id}-from-label`}>
              Request from
            </p>
            <Dropdown
              data-testid="dropdown-contact"
              id={`${id}-from-select`}
              name="from"
              value={requestState.from}
              fluid
              options={formatRecipients(eTransferData)}
              placeholder="Select contact"
              selection
              search
              selectOnNavigation={false}
              selectOnBlur={false}
              onChange={handleFromOnChange}
              className={`${errors.from ? "has-errors" : ""}`}
            />
            <p className="error from" id="from-error">
              {errors.from && errors.from.message}
            </p>
          </div>
        </div>
        <div className="form-arrow request-arrow">
          <img
            id={`${id}-down-arrow-icon`}
            src={downArrowIcon}
            alt="Down Arrow"
          />
        </div>

        <div id={`${id}-to`} className="form-to">
          <div className="form-icon">
            <img id={`${id}-to-icon`} src={accountIcon} alt="Select account" />
          </div>
          <div className="form-inputs">
            <p className="form-label" id={`${id}-to-label`}>
              Deposit account
            </p>
            <Dropdown
              data-testid="dropdown-to-account"
              id={`${id}-to-select`}
              name="to"
              value={toData}
              fluid
              options={formatDepositToAccounts(eTransferData, width)}
              placeholder="Select account"
              selection
              search
              selectOnNavigation={false}
              selectOnBlur={false}
              onChange={handleToOnChange}
              className={`${errors.to ? "has-errors" : ""}`}
            />
            <p className="error to" id="to-error">
              {errors.to && errors.to.message}
            </p>
          </div>
        </div>
        <div className="input-spacing" id={`${id}-amount`}>
          <div className="form-icon">
            <img id={`${id}-amount-icon`} src={moneyIcon} alt="Amount" />
          </div>
        </div>
        <div className="form-inputs form-inputs-taller">
          <p className="form-label" id="transfer-amount-label">
            Amount
          </p>
          <Input
            name="amount"
            id={`${id}-amount-input`}
            placeholder="$"
            autoComplete="off"
            onBlur={handleAmountOnBlur}
            onFocus={handleAmountOnFocus}
            onChange={handleAmountOnChange}
            value={amount}
            className={`${errors.amount ? "has-errors" : ""}`}
          />
          <p className="error amount" id="amount-error">
            {errors.amount && errors.amount.message}
          </p>
        </div>
        <div className="form-memo" id={`${id}-memo`}>
          <div className="form-icon">
            <img
              id={`${id}-message-icon`}
              src={messageIcon}
              alt="Message optional"
            />
          </div>
          <div className="form-inputs form-inputs-taller">
            <div className="form-memo-label" id={`${id}-memo-label`}>
              <span className="form-label" id={`${id}-message-label`}>
                Message (optional)
              </span>
              <span className="form-counter" id={`${id}-memo-counter`}>
                {messageData?.length || "0"}/400
              </span>
            </div>

            <TextArea
              id={`${id}-memo-textarea`}
              name="message"
              className="form-text-area"
              maxLength="400"
              onChange={handleMessageOnChange}
              value={messageData}
            />
            <p className="error memo" id="memo-error">
              {errors.memo && errors.memo.message}
            </p>
          </div>
        </div>
        <div className="clearfix form-next">
          <button type="submit" id={`${id}-form-submit-button`}>
            Next
          </button>
        </div>
        <div>
          {requestState.showAddRecipient ? (
            <AddRecipientProvider
              showAddRecipient={showAddRecipient}
              handleAddRecipient={handleAddRecipient}
              recipientList={eTransferData.depositAccounts}
            >
              <AddRecipient />
            </AddRecipientProvider>
          ) : null}
        </div>
      </Skeleton>
    </form>
  );
};

export default RequestETransferForm;
