import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { Dropdown, TextArea } from "semantic-ui-react";
import useForm from "react-hook-form";

import accountIcon from "assets/icons/Account/account.svg";
import endDate from "assets/icons/End Date/end-date.svg";
import messageIcon from "assets/icons/Message/message.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import personIcon from "assets/icons/Person/person.svg";
import statementIcon from "assets/icons/Statement/statement.svg";
import {
  requestETransferErrors,
  eTransferErrors,
  fulfillRequestErrors
} from "utils/MessageCatalog";

import { formatCurrency, formatDate } from "utils";
import useWindowDimensions from "utils/hooks/useWindowDimensions";

import { validateAmountBalance } from "utils/formValidators";
import { withdrawalAccounts } from "utils/formUtils";
import { Button } from "StyleGuide/Components";
import PageHeader from "Common/PageHeader";
import { PromptContext } from "Common/PromptProvider";
import { ModalContext } from "Common/ModalProvider";
import { getRequester, renderField } from "./utils";

import "./styles.scss";

const FulfillRequestForm = ({
  requestData,
  eTransferData,
  submitForm,
  saving
}) => {
  FulfillRequestForm.propTypes = {
    requestData: PropTypes.shape({}).isRequired,
    eTransferData: PropTypes.shape({}).isRequired,
    submitForm: PropTypes.func.isRequired,
    saving: PropTypes.bool.isRequired
  };
  const id = "fulfill-request";
  const { width } = useWindowDimensions();

  const {
    blockLocation,
    blockClosingBrowser,
    onCommit,
    promptState,
    onCancel
  } = useContext(PromptContext);
  const modal = useContext(ModalContext);
  const { showModal } = promptState;
  const {
    errors,
    handleSubmit,
    register,
    setValue,
    triggerValidation
  } = useForm();

  // we need to use this way to register validations since using refs
  // doesn't work on DropDown.
  const [from, setFrom] = useState();
  const [message, setMessage] = useState();
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    register({ name: "message" });
    register(
      { name: "from" },
      {
        required: eTransferErrors.MSG_RBET_002,
        validate: {
          balancelimit: value => {
            return validateAmountBalance(
              requestData.amount / 100,
              eTransferData.withdrawalAccounts,
              { from: value },
              eTransferErrors.MSG_RBET_004
            );
          }
        }
      }
    );
  }, [eTransferData, register, requestData.amount]);

  useEffect(() => {
    blockLocation();
    blockClosingBrowser();
  }, [blockClosingBrowser, blockLocation]);

  const handleFromOnChange = async (e, { name, value }) => {
    setFrom(value);
    setValue(name, value);
    await triggerValidation();
  };

  const handleMessageOnChange = async (_, { name, value }) => {
    setCounter(value ? value.length : 0);
    setMessage(value);
    setValue(name, value);
  };

  const onSubmit = data => {
    onCommit();
    submitForm(data);
  };

  const renderMessage = () => {
    return (
      <div className="form-memo" id={`${id}-memo`}>
        <div className="form-icon">
          <img
            id={`${id}-message-icon`}
            src={messageIcon}
            alt="Message optional"
          />
        </div>

        <div className="form-inputs form-inputs-taller">
          <label className="form-memo-label" htmlFor="message-textarea">
            <span className="form-label">Message (optional)</span>
            <span className="form-counter">{counter}/400</span>
          </label>
          <TextArea
            id="message-textarea"
            data-testid="message-textarea"
            name="message"
            className="form-text-area"
            maxLength="400"
            onChange={handleMessageOnChange}
            value={message}
          />
        </div>
      </div>
    );
  };

  const renderFrom = () => {
    return (
      <div>
        <div className="form-icon">
          <img src={accountIcon} alt="From Account" />
        </div>
        <div className="form-inputs">
          <p className="form-label">From</p>
          <Dropdown
            id="from-select"
            data-testid="from-account-dropdown"
            name="from"
            value={from}
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
          <p className="error from" id="from-error">
            {errors.from && errors.from.message}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {modal.modalComponent({
        show: showModal,
        content: fulfillRequestErrors.MSG_RBET_072(
          formatCurrency(requestData.amount / 100),
          getRequester(requestData)
        ),
        actions: (
          <>
            <button
              type="button"
              className="ui button basic"
              onClick={() => {
                modal.hide();
                onCancel();
              }}
            >
              Back
            </button>
            <button
              type="button"
              className="ui button basic"
              onClick={async () => {
                onCommit();
                modal.hide();
              }}
            >
              Confirm
            </button>
          </>
        )
      })}
      <form className="rebank-form fulfill-request-form form-bottom-space">
        <PageHeader>Fulfill a request for money</PageHeader>
        <p>{requestETransferErrors.MSG_RBET_070}</p>
        {renderField(
          "requester",
          personIcon,
          "Requester",
          getRequester(requestData)
        )}
        {renderField(
          "amount",
          moneyIcon,
          "Requested amount",
          formatCurrency(requestData.amount / 100)
        )}
        {requestData.beneficiaryMessage &&
          renderField(
            "requester-message",
            messageIcon,
            "Message from requester",
            requestData.beneficiaryMessage
          )}
        {renderField(
          "expiration-date",
          endDate,
          "Expiration date",
          formatDate(requestData.expiryDateTime)
        )}
        {requestData.registrantType === "Corporation" &&
          requestData.invoiceDetail && (
            <>
              {requestData.invoiceDetail.invoiceNumber &&
                renderField(
                  "invoiceNumber",
                  statementIcon,
                  "Invoice number",
                  requestData.invoiceDetail.invoiceNumber
                )}
              {requestData.invoiceDetail.dueDate &&
                renderField(
                  "dueDate",
                  endDate,
                  "Invoice due",
                  formatDate(requestData.invoiceDetail.dueDate)
                )}
            </>
          )}
        {renderFrom()}
        {renderMessage()}

        <div className="button-container">
          <div className="primary-button">
            <Button
              primary
              block
              onClick={handleSubmit(onSubmit)}
              loading={saving}
            >
              {saving ? null : "Fulfill"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
export default FulfillRequestForm;
