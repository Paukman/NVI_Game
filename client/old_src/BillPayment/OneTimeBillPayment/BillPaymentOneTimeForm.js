import React, { useContext } from "react";
import accountIcon from "assets/icons/FromAccount/account.svg";
import downArrow from "assets/icons/DownArrow/arrow_down.svg";
import payBillIcon from "assets/icons/PayBill/pay-bill.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import calendarIcon from "assets/icons/Calendar/calendar.svg";
import foreignExchange from "assets/icons/ForeignExchange/foreign-exchange.svg";
import { Dropdown, Input } from "semantic-ui-react";
import PropTypes from "prop-types";
import { Button, DatePicker, Skeleton } from "StyleGuide/Components";
import { BillPaymentContext } from "../BillPaymentProvider";
import { errorMessages } from "../utils";

import useOneTimeForm from "./useOneTimeForm";

import "../styles.scss";

const BillPaymentOneTimeForm = props => {
  BillPaymentOneTimeForm.propTypes = {
    nextTab: PropTypes.func.isRequired
  };

  const { oneTimeBillPay } = useContext(BillPaymentContext);
  const {
    onChange,
    state,
    prepareDataForReview,
    prepareDataForPost,
    creditAccountWarning,
    updateExchangeRate,
    checkForDoublePayments
  } = oneTimeBillPay;
  const {
    register,
    errors,
    onChangeDate,
    handleOnAccountChange,
    handleAmountChange,
    onBlurAmount,
    onFocusAmount,
    validateOnSubmit,
    onBlurAmountTo,
    onFocusAmountTo
  } = useOneTimeForm(onChange, state, updateExchangeRate);
  const { nextTab } = props;

  const goNext = async () => {
    const valid = await validateOnSubmit();
    if (valid) {
      creditAccountWarning();
      prepareDataForReview();
      prepareDataForPost();
      checkForDoublePayments(nextTab);
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
            onChange={handleOnAccountChange}
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
            onChange={handleOnAccountChange}
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
          <p className="form-label">
            {state.isDisplayedToAmount ? "From amount" : "Amount"}
          </p>
          <div className="ui input">
            <Input
              data-testid="amount-input"
              name="amount"
              autoComplete="off"
              placeholder="$"
              value={state.amount}
              ref={register}
              onBlur={onBlurAmount}
              onFocus={onFocusAmount}
              onChange={handleAmountChange}
              className={`${errors.amount ? "has-errors" : ""}`}
              label={
                state.isDisplayedToAmount
                  ? { basic: true, content: state.fromCurrency }
                  : null
              }
              labelPosition={state.isDisplayedToAmount ? "right" : null}
            />
          </div>
          <p className="error from" data-testid="fromAmountError">
            {errors.amount ? errorMessages[errors.amount.type] : ""}
          </p>
        </div>
      </div>
    );
  };

  const renderToAmountInput = () => {
    return (
      <div className="form-group">
        <div className="form-icon" width={1}>
          <img src={moneyIcon} alt="toAmount" />
        </div>
        <div className="form-inputs">
          <p className="form-label">To amount</p>
          <div className="ui input">
            <Input
              data-testid="amount-input-to"
              name="amountTo"
              placeholder="$"
              autoComplete="off"
              value={state.amountTo}
              ref={register}
              onBlur={onBlurAmountTo}
              onFocus={onFocusAmountTo}
              onChange={handleAmountChange}
              className={`${errors.amountTo ? "has-errors" : ""}`}
              label={{ basic: true, content: state.toCurrency }}
              labelPosition="right"
            />
          </div>
          <p className="error from" data-testid="toAmountError">
            {errors.amountTo ? errorMessages[errors.amountTo.type] : ""}
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
          <p className="form-label">When</p>
          <div
            className={errors.when ? "date-picker has-errors" : "date-picker"}
          >
            <DatePicker
              error={!!errors.when}
              data-testid="date-when"
              name="when"
              value={state.when}
              block
              onChange={date => {
                onChangeDate("when", date);
              }}
            />
          </div>
          <p className={errors.when ? "error error-icon-before" : "error"}>
            {errors.when ? errorMessages[errors.when.type] : ""}
          </p>
        </div>
      </div>
    );
  };

  const renderExchangeRateText = () => {
    return (
      <div className="form-group exchange-group">
        <div className="form-icon exchange-icon" width={1}>
          <img src={foreignExchange} alt="exchangeRate" />
        </div>
        <div className="form-inputs">
          <p className="form-label">Foreign exchange rate</p>
          <p className="exchange-rate">{state.exchangeRateFormatted}</p>
        </div>
        <div className="form-inputs ">
          <p className="form-label">
            This rate applies to the current transaction only and includes any
            and all associated exchange-related fees.
          </p>
        </div>
      </div>
    );
  };

  return (
    <form
      className="rebank-form bill-payment-form"
      data-testid="form-onetime-bill-payment"
    >
      <Skeleton
        sizeMedium
        loading={state.loading}
        className="form-skeleton form-skeleton-align-stepper"
        data-testid="bill-payment-onetime-skeleton"
      >
        {renderFromAccountInput()}
        <div className="secondary-icon">
          <img src={downArrow} alt="Down Arrow" />
        </div>
        {renderToBillPayeeInput()}
        {renderAmountInput()}
        {state.isDisplayedToAmount && renderToAmountInput()}
        {state.exchangeRateFormatted && renderExchangeRateText()}
        {renderStartingDate()}
        <div className="button-container">
          <div className="primary-button">
            <Button
              primary
              block
              onClick={goNext}
              loading={state.isExchangeLoading}
              id="submitButton"
            >
              {state.isExchangeLoading ? null : "Submit"}
            </Button>
          </div>
        </div>
      </Skeleton>
    </form>
  );
};

export default BillPaymentOneTimeForm;
