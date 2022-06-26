import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Dropdown } from "semantic-ui-react";
import accountIcon from "assets/icons/FromAccount/account.svg";
import downArrow from "assets/icons/DownArrow/arrow_down.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import calendarIcon from "assets/icons/Calendar/calendar.svg";
import frequencyIcon from "assets/icons/Frequency/frequency.svg";
import endDateIcon from "assets/icons/End Date/end-date.svg";
import recurringIcon from "assets/icons/Recurring/recurring.svg";

import { Button, DatePicker, Skeleton } from "StyleGuide/Components";

import useRecurringForm from "./useRecurringForm";
import { TransferContext } from "../TransferProvider";
import { frequencyOptions } from "./constants";
import { endingOptions } from "../constants";
import { errorMessages } from "../utils";

import "../styles.scss";

const TransferRecurringForm = props => {
  TransferRecurringForm.propTypes = {
    nextTab: PropTypes.func.isRequired
  };

  const { recurringTransfer } = useContext(TransferContext);
  const {
    state,
    onChange,
    updateEndDateNoOfTransfersMessage,
    prepareDataForReview,
    prepareDataForPost
  } = recurringTransfer;

  const {
    register,
    handleOnChange,
    handleOnFrequencyChange,
    errors,
    onBlurAmount,
    onFocusAmount,
    handleInputChange,
    onChangeEndingOption,
    onChangeNoOfTansfers,
    onChangeDate,
    validateOnSubmit
  } = useRecurringForm(onChange, state, updateEndDateNoOfTransfersMessage);

  const { nextTab } = props;

  const goNext = async () => {
    const valid = await validateOnSubmit();
    if (valid) {
      // creditAccountWarning();
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

  const renderToAccountInput = () => {
    return (
      <div className="form-group form-second-field-margin">
        <div className="form-icon" width={1}>
          <img src={accountIcon} alt="To Account" />
        </div>
        <div className="form-inputs">
          <p className="form-label">To</p>
          <Dropdown
            data-testid="dropdown-to"
            onChange={handleOnChange}
            value={state.to}
            name="to"
            placeholder="Select account"
            selection
            fluid
            search
            options={state.toAccountsFormatted}
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
          <p className="form-label">Starting</p>
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
            state.endingOption === endingOptions.numberOfTransfers
              ? "recurring-active"
              : ""
          }
          tabIndex={0}
          onClick={() =>
            onChangeEndingOption(
              "endingOption",
              endingOptions.numberOfTransfers
            )
          }
        >
          No. of transfers
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
          <p className="form-label">End date</p>
          <div
            className={errors.ending ? "date-picker has-errors" : "date-picker"}
            id="endDate"
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
            <p className="error ending  error-icon-before">
              {errors.ending.type === "ensureRecurringDateIsNotTooFarOut"
                ? errorMessages[errors.ending.type](errors.ending.message)
                : errorMessages[errors.ending.type]}
            </p>
          ) : (
            <p className="end-date-message">
              {state.endDateNoOfTransfersMessage}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderNoOfTansfers = () => {
    return (
      <div className="form-group">
        <div className="form-icon" width={1}>
          <img src={recurringIcon} alt="Recurring" />
        </div>
        <div className="form-inputs">
          <p className="form-label">Number of transfers</p>
          <div className="ui input">
            <input
              data-testid="number-of-transfers"
              name="numberOfTransfers"
              value={state.numberOfTransfers}
              onChange={onChangeNoOfTansfers}
              className={`${errors.numberOfTransfers ? "has-errors" : ""}`}
            />
          </div>
          {errors.numberOfTransfers ? (
            <p className="error numberOfTransfers">
              {errorMessages[errors.numberOfTransfers.type]}
            </p>
          ) : (
            <p className="end-date-message">
              {state.endDateNoOfTransfersMessage}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderConditionalRecurringElements = () =>
    state.endingOption === endingOptions.endDate
      ? renderEndingDate()
      : renderNoOfTansfers();

  return (
    <form className="rebank-form transfer-form">
      <Skeleton
        sizeMedium
        loading={state.loading}
        className="form-skeleton form-skeleton-align-stepper"
        data-testid="transfer-recurring-skeleton"
      >
        {renderFromAccountInput()}
        <div className="secondary-icon">
          <img src={downArrow} alt="Down Arrow" />
        </div>
        {renderToAccountInput()}
        {renderAmountInput()}
        {renderFrequencyInput()}
        {renderStartingDate()}
        {renderEndingSelector()}
        {state.endingOption !== endingOptions.never &&
          renderConditionalRecurringElements()}
        <div className="button-container">
          <div className="primary-button">
            <Button primary block onClick={goNext}>
              Next
            </Button>
          </div>
        </div>
      </Skeleton>
    </form>
  );
};

export default TransferRecurringForm;
