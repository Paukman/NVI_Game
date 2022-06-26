/* eslint-disable jsx-a11y/label-has-associated-control */ // need to disable it globally
import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Divider, Search } from "semantic-ui-react";
import { Button } from "StyleGuide/Components";
import pencilIcon from "assets/icons/Pencil/pencil.svg";
import pencilIconDisabled from "assets/icons/Pencil/pencil-disabled.svg";
import payBillIcon from "assets/icons/PayBill/pay-bill.svg";
import searchIcon from "assets/icons/Search/search.svg";
import accountNumberIcon from "assets/icons/AccountNumber/account-number.svg";
import accountNumberIconDisabled from "assets/icons/AccountNumber/account-number-disabled.svg";
import cross from "assets/icons/Cross/cross.svg";
import { manageContactMessage } from "utils/MessageCatalog";
import { AddPayeeContext } from "./AddPayeeProvider";
import useAddPayeeForm from "./useAddPayeeForm";
import { errorMessages } from "./utils";
import "./styles.scss";

export const NICKNAME_NAME_LENGTH = 20;
export const ACCOUNT_NUMBER_LENGTH = 50;
export const CREDITOR_NAME_LENGTH = 40;

const emBoldenFragment = (str, frag) => {
  if (!str) {
    return str;
  }
  const strLC = str.toLowerCase();
  const fragLC = frag.toLowerCase();
  if (!strLC.includes(fragLC)) {
    return str;
  }
  const startIx = strLC.indexOf(fragLC);
  return (
    <>
      {str.substr(0, startIx)}
      <b>{str.substr(startIx, frag.length)}</b>
      {str.substr(startIx + fragLC.length, strLC.length)}
    </>
  );
};
const renderResult = ({ name }, payeeName) => {
  return emBoldenFragment(name, payeeName);
};

const AddEditPayeeForm = ({ handleModal }) => {
  AddEditPayeeForm.propTypes = {
    handleModal: PropTypes.func
  };
  AddEditPayeeForm.defaultProps = {
    handleModal: () => null
  };
  const {
    addPayeeState,
    onInputChange,
    handleResultSelect,
    handleSearchChange,
    addPayee
  } = useContext(AddPayeeContext);
  const {
    onChange,
    onSelectResult,
    onSearch,
    errors,
    validateForm,
    onBlurPayee
  } = useAddPayeeForm(
    onInputChange,
    handleResultSelect,
    handleSearchChange,
    addPayeeState
  );
  const {
    disabled,
    searchResults,
    payeeName,
    account,
    nickname,
    selectedPayee
  } = addPayeeState;

  const handleCrossClick = () => {
    handleModal();
  };

  const handleOnClick = async () => {
    const valid = await validateForm();
    if (valid) {
      addPayee(handleModal);
    }
  };

  const isTextOrErrorMessage = () => {
    if (disabled) {
      return " ";
    }
    if (errors.account) {
      return errorMessages[errors.account.type];
    }
    if (addPayeeState.errors.account) {
      return errorMessages[addPayeeState.errors.account.type];
    }
    return manageContactMessage.MSG_RBBP_044C;
  };

  const isTextOrErrorClass = () => {
    if (disabled) {
      return "in-line-message";
    }
    if (errors.account || addPayeeState.errors.account) {
      return "error error-tall";
    }
    return "in-line-message-tall";
  };

  const determinePromptStyle = () => {
    if (searchResults.length) {
      return "is-selected";
    }
    if (payeeName.length >= 3) {
      return "is-empty-selection";
    }
    return "";
  };
  const renderApprovedCreditors = () => {
    return (
      <div className="edit-label">
        <div className="form-icon">
          <img src={payBillIcon} alt="Payee name" />
        </div>
        <div className="form-inputs input-spacing">
          <label className="form-label" htmlFor="payeeName">
            Payee name
          </label>
          <Search
            className={`ui input full-width-input ${
              errors.payeeName ? "has-errors" : ""
            }`}
            name="payeeName"
            loading={false}
            fluid
            icon={false}
            onResultSelect={onSelectResult}
            onBlur={onBlurPayee}
            onSearchChange={onSearch}
            results={searchResults}
            value={payeeName}
            resultRenderer={name => renderResult(name, payeeName)}
            minCharacters={3}
            id="payeeName"
            input={{
              name: "payeeName",
              className: `${determinePromptStyle()}`,
              maxLength: CREDITOR_NAME_LENGTH
            }}
          />
          <span className="search-icon">
            {disabled && <img src={searchIcon} alt="Account search by name" />}
          </span>
          <p className="error payeeName">
            {errors.payeeName ? errorMessages[errors.payeeName.type] : ""}
          </p>
        </div>
      </div>
    );
  };
  const prepareName = name => {
    if (!name) {
      return name;
    }
    return name.substr(0, NICKNAME_NAME_LENGTH);
  };

  return (
    <div className="modal-form-container">
      <div className="modal-form-header">
        <h3>Add payee</h3>
        <input
          type="image"
          className="modal-form-cross-btn"
          src={cross}
          alt="Close payee edit"
          onClick={() => handleCrossClick()}
        />
      </div>
      <Divider className="modal-form-divider" />
      <form className="rebank-form payee-form">
        {renderApprovedCreditors()}
        <div className="edit-label">
          <div className="form-icon">
            <img
              src={disabled ? accountNumberIconDisabled : accountNumberIcon}
              alt="Account number"
            />
          </div>
          <div className="form-inputs input-spacing">
            <label
              className={`form-label ${disabled ? "disabled-label" : ""}`}
              htmlFor="payee-account-number"
            >
              Account number
            </label>
            <input
              id="payee-account-number"
              className={`ui input full-width-input ${
                disabled ? "disabled-input" : ""
              } ${errors.account && !disabled ? "has-errors" : ""} `}
              placeholder=""
              name="account"
              value={account}
              maxLength={ACCOUNT_NUMBER_LENGTH}
              onChange={onChange}
              disabled={disabled}
            />
            <div className="account-message-container">
              {<p className={isTextOrErrorClass()}>{isTextOrErrorMessage()}</p>}
            </div>
          </div>
        </div>
        <div className="edit-label">
          <div className="form-icon">
            <img
              src={disabled ? pencilIconDisabled : pencilIcon}
              alt="Nickname"
            />
          </div>
          <div className="form-inputs input-spacing">
            <label
              className={`form-label ${disabled ? "disabled-label" : ""}`}
              htmlFor="edit-payee-nickname"
            >
              Nickname (optional)
            </label>
            <input
              id="edit-payee-nickname"
              placeholder=""
              name="nickname"
              value={nickname}
              maxLength={NICKNAME_NAME_LENGTH}
              onChange={onChange}
              disabled={disabled}
              className={`ui input full-width-input ${
                disabled ? "disabled-input" : ""
              } ${errors.nickname ? "has-errors" : ""} `}
            />
            <p className="error">
              {errors.nickname ? errorMessages[errors.nickname.type] : ""}
            </p>
            <div />
          </div>
        </div>
        <div className="payee-shortname-container">
          <p className="payee-shortname">
            {selectedPayee
              ? manageContactMessage.MSG_RBBP_044A(prepareName(selectedPayee))
              : ""}
          </p>
        </div>
        <div className="payee-button-container">
          <Button block primary onClick={handleOnClick}>
            Add payee
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEditPayeeForm;
