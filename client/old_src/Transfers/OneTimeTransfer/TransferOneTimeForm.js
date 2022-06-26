import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Dropdown, Input } from "semantic-ui-react";
import accountIcon from "assets/icons/FromAccount/account.svg";
import downArrow from "assets/icons/DownArrow/arrow_down.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import calendarIcon from "assets/icons/Calendar/calendar.svg";
import foreignExchange from "assets/icons/ForeignExchange/foreign-exchange.svg";
import { Button, DatePicker, Skeleton } from "StyleGuide/Components";
import { TransferContext } from "../TransferProvider";
import { errorMessages } from "../utils";
import useOneTimeForm from "./useOneTimeForm";
import "../styles.scss";

import { EXCHANGE_RATE_TITLE, EXCHANGE_RATE_TEXT } from "../constants";

const TransferOneTimeForm = props => {
  TransferOneTimeForm.propTypes = {
    nextTab: PropTypes.func.isRequired
  };

  const { oneTimeTransfer } = useContext(TransferContext);
  const {
    onChange,
    prepareDataForReview,
    prepareDataForPost,
    state,
    updateExchangeRate
  } = oneTimeTransfer;
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
            onChange={handleOnAccountChange}
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
          <img src={moneyIcon} alt="fromAmount" />
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
          <p className="error from">
            {errors.amount ? errorMessages[errors.amount.type] : ""}
          </p>
        </div>
      </div>
    );
  };

  const renderAmountToInput = () => {
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
          <p className="error from">
            {errors.amountTo ? errorMessages[errors.amountTo.type] : ""}
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
          <p className="form-label">{EXCHANGE_RATE_TITLE}</p>
          <p className="exchange-rate">{state.exchangeRateFormatted}</p>
        </div>
        <div className="form-inputs ">
          <p className="form-label">{EXCHANGE_RATE_TEXT}</p>
        </div>
      </div>
    );
  };

  const renderWhenDate = () => {
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
              block
              value={state.when}
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

  return (
    <form className="rebank-form transfer-form">
      <Skeleton
        sizeMedium
        loading={state.loading}
        className="form-skeleton form-skeleton-align-stepper"
        data-testid="transfer-onetime-skeleton"
      >
        {renderFromAccountInput()}
        <div className="secondary-icon">
          <img src={downArrow} alt="Down Arrow" />
        </div>
        {renderToAccountInput()}
        {renderAmountInput()}
        {state.isDisplayedToAmount && renderAmountToInput()}
        {state.exchangeRateFormatted && renderExchangeRateText()}
        {renderWhenDate()}
        <div className="button-container">
          <div className="primary-button">
            <Button
              primary
              block
              onClick={goNext}
              loading={state.isExchangeLoading}
            >
              {state.isExchangeLoading ? null : "Next"}
            </Button>
          </div>
        </div>
      </Skeleton>
    </form>
  );
};

export default TransferOneTimeForm;
