import React, { useContext } from "react";

import accountIcon from "assets/icons/FromAccount/account.svg";
import downArrow from "assets/icons/DownArrow/arrow_down.svg";
import payBillIcon from "assets/icons/PayBill/pay-bill.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import frequencyIcon from "assets/icons/Frequency/frequency.svg";
import calendarIcon from "assets/icons/Calendar/calendar.svg";
import endDateIcon from "assets/icons/End Date/end-date.svg";
import recurringIcon from "assets/icons/Recurring/recurring.svg";
import { Dropdown } from "semantic-ui-react";
import PropTypes from "prop-types";
import { Button, DatePicker, Skeleton } from "StyleGuide/Components";
import { BillPaymentContext } from "../BillPaymentProvider";
import useRecurringForm from "./useRecurringForm";
import { frequencyOptions } from "./constants";
import { endingOptions } from "../constants";
import { errorMessages } from "../utils";

const BillPaymentRecurringForm = props => {
  BillPaymentRecurringForm.propTypes = {
    nextTab: PropTypes.func.isRequired
  };

  const { recurringBillPay } = useContext(BillPaymentContext);
  const {
    state,
    onChange,
    updateEndDateNoOfPaymentsMessage,
    prepareDataForReview,
    prepareDataForPost,
    creditAccountWarning
  } = recurringBillPay;
  const {
    register,
    handleOnChange,
    handleOnFrequencyChange,
    errors,
    onBlurAmount,
    onFocusAmount,
    handleInputChange,
    onChangeEndingOption,
    onChangeNoOfPayments,
    onChangeDate,
    validateOnSubmit
  } = useRecurringForm(onChange, state, updateEndDateNoOfPaymentsMessage);

  const { nextTab } = props;

  const goNext = async () => {
    const valid = await validateOnSubmit();
    if (valid) {
      creditAccountWarning();
      prepareDataForReview();
      prepareDataForPost();
      nextTab();
    }
  };

  const renderFromAccountInput = () => {
    return (
      <div className="form-group">
        <div className="form-icon" width={1}>
          <img src={accountIcon} alt="From Account" />
        </div>
        <div className="form-inputs">
          <p className="form-label">From</p>
          <Dropdown
            data-testid="dropdown-from"
            value={state.from}
            placeholder="Select account"
            selection
            fluid
            onChange={handleOnChange}
            name="from"
            search
            selectOnBlur={false}
            selectOnNavigation={false}
            options={state.fromAccountsFormatted}
            className={`${errors.from ? "has-errors" : ""}`}
          />
          <p className="error from">
            {errors.from ? errorMessages[errors.from.type] : ""}
          </p>
        </div>
      </div>
    );
  };

  const renderToBillPayeeInput = () => {
    return (
      <div className="form-group form-second-field-margin">
        <div className="form-icon" width={1}>
          <img src={payBillIcon} alt="To Account" />
        </div>
        <div className="form-inputs">
          <p className="form-label">To</p>
          <Dropdown
            data-testid="dropdown-to"
            onChange={handleOnChange}
            value={state.to}
            name="to"
            placeholder="Select bill payee"
            selection
            fluid
            search
            options={state.billPayeesFormatted}
            selectOnBlur={false}
            selectOnNavigation={false}
            className={`${errors.to ? "has-errors" : ""}`}
          />
          <p className="error to">
            {errors.to ? errorMessages[errors.to.type] : ""}
          </p>
        </div>
      </div>
    );
  };

  const renderAmountInput = () => {
    return (
      <div className="form-group">
        <div className="form-icon" width={1}>
          <img src={moneyIcon} alt="Amount" />
        </div>
        <div className="form-inputs">
          <p className="form-label">Amount</p>
          <div className="ui input">
            <input
              data-testid="amount-input"
              name="amount"
              placeholder="$"
              value={state.amount}
              ref={register}
              onBlur={onBlurAmount}
              onFocus={onFocusAmount}
              onChange={handleInputChange}
              className={`${errors.amount ? "has-errors" : ""}`}
            />
          </div>
          <p className="error from">
            {errors.amount ? errorMessages[errors.amount.type] : ""}
          </p>
        </div>
      </div>
    );
  };

  const renderFrequencyInput = () => {
    return (
      <div className="form-group">
        <div className="form-icon" width={1}>
          <img src={frequencyIcon} alt="Frequency" />
        </div>
        <div className="form-inputs ">
          <p className="form-label">Frequency</p>
          <Dropdown
            data-testid="dropdown-frequency"
            onChange={handleOnFrequencyChange}
            value={state.frequency}
            name="frequency"
            placeholder="Select frequency"
            selection
            fluid
            options={frequencyOptions}
            selectOnBlur={false}
            selectOnNavigation={false}
            className={`${errors.frequency ? "has-errors" : ""}`}
          />
          <p className="error frequency">
            {errors.frequency ? errorMessages[errors.frequency.type] : ""}
          </p>
        </div>
      </div>
    );
  };

  const renderStartingDate = () => {
    return (
      <div className="form-group">
        <div className="form-icon" width={1}>
          <img src={calendarIcon} alt="Calendar" />
        </div>
        <div className="datepicker-inputs">
          <p className="form-label">Start</p>
          <div
            className={
              errors.starting ? "date-picker has-errors" : "date-picker"
            }
          >
            <DatePicker
              error={!!errors.starting}
              data-testid="date-starting"
              name="starting"
              block
              value={state.starting}
              onChange={date => {
                onChangeDate("starting", date);
              }}
            />
          </div>
          <p
            className={
              errors.starting
                ? "error starting error-icon-before"
                : "error starting"
            }
          >
            {errors.starting ? errorMessages[errors.starting.type] : ""}
          </p>
        </div>
      </div>
    );
  };

  const renderEndingSelector = () => {
    return (
      <div className="form-inputs ending-recurring-selector">
        <p className="form-label">Ending</p>
        <button
          type="button"
          name="endingOption"
          tabIndex={0}
          className={
            state.endingOption === endingOptions.never ? "recurring-active" : ""
          }
          onClick={() =>
            onChangeEndingOption("endingOption", endingOptions.never)
          }
        >
          Never
        </button>
        <button
          type="button"
          name="endingOption"
          tabIndex={0}
          className={
            state.endingOption === endingOptions.endDate
              ? "recurring-active"
              : ""
          }
          onClick={() =>
            onChangeEndingOption("endingOption", endingOptions.endDate)
          }
        >
          End date
        </button>
        <button
          type="button"
          name="endingOption"
          className={
            state.endingOption === endingOptions.numberOfPayments
              ? "recurring-active"
              : ""
          }
          tabIndex={0}
          onClick={() =>
            onChangeEndingOption("endingOption", endingOptions.numberOfPayments)
          }
        >
          No. of payments
        </button>
      </div>
    );
  };

  const renderEndingDate = () => {
    return (
      <div className="form-group">
        <div className="form-icon" width={1}>
          <img src={endDateIcon} alt="Calendar" />
        </div>
        <div className="datepicker-inputs">
          <p className="form-label">Ending</p>
          <div
            className={errors.ending ? "date-picker has-errors" : "date-picker"}
          >
            <DatePicker
              error={!!errors.ending}
              data-testid="date-ending"
              name="ending"
              block
              value={state.ending}
              onChange={date => {
                onChangeDate("ending", date);
              }}
            />
          </div>
          {errors.ending ? (
            <p className="error ending error-icon-before">
              {errors.ending.type === "ensureRecurringDateIsNotTooFarOut"
                ? errorMessages[errors.ending.type](errors.ending.message)
                : errorMessages[errors.ending.type]}
            </p>
          ) : (
            <p className="end-date-message">
              {state.endDateNoOfPaymentsMessage}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderNoOfPayments = () => {
    return (
      <div className="form-group">
        <div className="form-icon" width={1}>
          <img src={recurringIcon} alt="Recurring" />
        </div>
        <div className="form-inputs">
          <p className="form-label">Number of payments</p>
          <div className="ui input">
            <input
              data-testid="number-of-payments"
              name="numberOfPayments"
              value={state.numberOfPayments}
              onChange={onChangeNoOfPayments}
              className={`${errors.numberOfPayments ? "has-errors" : ""}`}
            />
          </div>
          {errors.numberOfPayments ? (
            <p className="error numberOfPayments">
              {errorMessages[errors.numberOfPayments.type]}
            </p>
          ) : (
            <p className="end-date-message">
              {state.endDateNoOfPaymentsMessage}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderConditionalRecurringElements = () =>
    state.endingOption === endingOptions.endDate
      ? renderEndingDate()
      : renderNoOfPayments();

  return (
    <>
      <form
        className="rebank-form bill-payment-form"
        data-testid="form-bill-payment-recurring"
      >
        <Skeleton
          sizeMedium
          loading={state.loading}
          className="form-skeleton form-skeleton-align-stepper"
          data-testid="bill-payment-recurring-skeleton"
        >
          {renderFromAccountInput()}
          <div className="secondary-icon">
            <img src={downArrow} alt="Down Arrow" />
          </div>
          {renderToBillPayeeInput()}
          {renderAmountInput()}
          {renderFrequencyInput()}
          {renderStartingDate()}
          {renderEndingSelector()}
          {state.endingOption !== endingOptions.never &&
            renderConditionalRecurringElements()}
          <div className="button-container">
            <div className="primary-button">
              <Button primary block onClick={goNext} id="submitButton">
                Submit
              </Button>
            </div>
          </div>
        </Skeleton>
      </form>
    </>
  );
};

export default BillPaymentRecurringForm;
