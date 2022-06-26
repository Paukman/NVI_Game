/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */ // need to disable it globally
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useForm from "react-hook-form";
import { useHistory } from "react-router-dom";
import { escapeRegExp } from "lodash";
import pencilIcon from "assets/icons/Pencil/pencil.svg";
import pencilIconDisabled from "assets/icons/Pencil/pencil-disabled.svg";
import payBillIcon from "assets/icons/PayBill/pay-bill.svg";
import cross from "assets/icons/Cross/cross.svg";
import accountNumberIcon from "assets/icons/AccountNumber/account-number.svg";
import accountNumberIconDisabled from "assets/icons/AccountNumber/account-number-disabled.svg";
import searchIcon from "assets/icons/Search/search.svg";
import { manageContactMessage, billPaymentErrors } from "utils/MessageCatalog";
import AlertModal from "Common/AlertModal";
import { Button } from "StyleGuide/Components";
import { Divider, Search } from "semantic-ui-react";
import { menageContacts, modeName } from "globalConstants";
import { ManageContactsContext } from "../ManageContactsProvider";
import {
  validationRulesAccount,
  validationRulesNickname,
  errorMessages,
  errorTypes
} from "../utils";
import {
  NICKNAME_NAME_LENGTH,
  ACCOUNT_NUMBER_LENGTH,
  CREDITOR_NAME_LENGTH
} from "../constants";
import "./styles.scss";

const EditPayee = () => {
  const { page, payee } = useContext(ManageContactsContext);
  const {
    setPageName,
    isAlertShowing,
    setIsAlertShowing,
    alertError,
    mode,
    serverErrors,
    clearServerError
  } = page;
  const { getApprovedCreditors, isPosting, onSubmit, payeeToHandle } = payee;

  const [creditors, setCreditors] = useState([]);
  const [payeeNameValue, setPayeeNameValue] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    errors,
    clearError
  } = useForm({
    mode: "onBlur"
  });

  const isValidPayeeName = payeeName => {
    if (!results?.length) return false;
    return !!results.find(({ name }) => name === payeeName);
  };

  const selectedMode = () => {
    if (mode === modeName.CREATE_MODE) {
      if (payeeNameValue.length > 3 && isValidPayeeName(payeeNameValue)) {
        return false;
      }
      return true;
    }
    return false;
  };

  // Note: semantic-ui Search does not support 'ref' so relying on this approach
  useEffect(() => {
    if (mode === modeName.CREATE_MODE) {
      register(
        { name: "payeeName" },
        {
          validate: {
            checkIsValid: () => {
              const { payeeName } = getValues();
              if (
                !payeeName ||
                !isValidPayeeName(payeeName) ||
                payeeName.length < 3
              ) {
                return billPaymentErrors.MSG_RBBP_006;
              }
              return true;
            }
          }
        }
      );
    }
  }, [getValues, mode, register]);

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

  const renderSelectItem = ({ name }) => emBoldenFragment(name, payeeNameValue);
  renderSelectItem.propTypes = {
    name: PropTypes.string
  };
  renderSelectItem.defaultProps = {
    name: ""
  };

  const resultRenderer = ({ name }) => emBoldenFragment(name);
  resultRenderer.propTypes = {
    name: PropTypes.string,
    id: PropTypes.string
  };

  const handleSearchChange = (e, data) => {
    setIsLoading(true);
    if (data.value.length < 3) {
      setIsLoading(false);
      setResults([]);
      setPayeeNameValue(data.value);
      setValue("payeeName", data.value);
      return;
    }
    const re = new RegExp(escapeRegExp(data.value), "i");
    setIsLoading(false);
    setPayeeNameValue(data.value);
    const matchingCreditors = creditors
      .filter(creditor => re.test(creditor.name))
      .map(creditor => ({
        title: creditor.name,
        name: creditor.name,
        id: creditor.id
      }));
    setResults(matchingCreditors);
  };

  const handleResultSelect = (e, { result }) => {
    setValue("payeeName", result.name);
    setPayeeNameValue(result.name);
  };

  const onBlurPayeeName = async (e, result) => {
    if (result.value) {
      setValue("payeeName", result.value);
      setPayeeNameValue(result.value);
    }
  };

  useEffect(() => {
    if (mode === modeName.CREATE_MODE && payeeNameValue.length) {
      clearError();
    }
  }, [clearError, mode, payeeNameValue]);

  useEffect(() => {
    clearServerError(errorTypes.INVALID_ACCOUNT);
  }, [clearServerError]);

  useEffect(() => {
    if (mode === modeName.CREATE_MODE) {
      getApprovedCreditors(setCreditors);
    }
  }, [mode]);

  const handleCrossClick = async () => {
    if (mode === modeName.CREATE_MODE) {
      await setPageName(menageContacts.PAYEES);
      history.push("/more/manage-contacts/payees");
    } else {
      await setPageName(menageContacts.PAYEE_DETAILS);
    }
  };

  const handleOnSubmit = data => {
    onSubmit(data); // will not submit the form when there are errors
  };

  const renderEditHeader = () => {
    return (
      <>
        <div className="manage-contacts-subheader">
          <h3>{payeeToHandle?.payeeName || ""}</h3>
          <p className="payee-comment">{manageContactMessage.MSG_RBBP_044}</p>
        </div>
      </>
    );
  };

  const renderAlertModal = () => {
    return (
      <AlertModal
        key={alert.id}
        id="manage-contact"
        alertMessage={alertError}
        isShowing={isAlertShowing}
        setIsShowing={setIsAlertShowing}
      />
    );
  };

  const filterNickname = (name, nickname) => {
    if (!name) return name;
    if (!nickname) {
      return name.substr(
        0,
        name.length < NICKNAME_NAME_LENGTH ? name.length : NICKNAME_NAME_LENGTH
      );
    }
    if (name.substr(0, NICKNAME_NAME_LENGTH) === nickname) {
      return "";
    }
    return nickname;
  };

  const prepareName = name => {
    if (!name) {
      return name;
    }
    return name.substr(0, NICKNAME_NAME_LENGTH);
  };
  const getSearchIcon = () => {
    return searchIcon;
  };

  const displaySearchIcon = () => {
    if (selectedMode()) {
      return <img src={getSearchIcon()} alt="Account search by name" />;
    }
    return "";
  };

  const getAccountNumberIcon = () => {
    if (selectedMode() === false) {
      return accountNumberIcon;
    }
    return accountNumberIconDisabled;
  };

  const getPencilIcon = () => {
    if (selectedMode() === false) {
      return pencilIcon;
    }
    return pencilIconDisabled;
  };

  const isTextOrErrorClass = () => {
    if (errors.account || serverErrors.account.type) {
      return "error error-tall";
    }
    if (!selectedMode()) {
      return "in-line-message";
    }
    return "in-line-message-tall";
  };

  const isTextOrErrorMessage = () => {
    if (errors.account || serverErrors.account.type) {
      return errors.account
        ? errorMessages[errors.account.type]
        : errorMessages[serverErrors.account.type];
    }
    if (!selectedMode()) {
      return manageContactMessage.MSG_RBBP_044C;
    }
    return " ";
  };

  const onAccountNumberChange = () => {
    if (serverErrors.account.type === errorTypes.INVALID_ACCOUNT) {
      clearServerError(errorTypes.INVALID_ACCOUNT);
    }
  };

  const determinePromptStyle = () => {
    if (results && results.length > 0) {
      return "ui input is-selected";
    }
    if (payeeNameValue.length >= 3) {
      return "ui input is-empty-selection";
    }
    return "ui input";
  };

  const renderApprovedCreditors = () => {
    return (
      <div className="edit-label">
        <div className="form-icon">
          <img src={payBillIcon} alt="Payee name" />
        </div>
        <div className="form-inputs input-spacing">
          <label
            data-testid="label-payee-name"
            className="form-label"
            htmlFor="edit-payee-payee-name"
          >
            Payee name
          </label>
          <Search
            className={`ui input full-width-input ${
              errors.payeeName ? "has-errors" : ""
            }`}
            id="edit-payee-payee-name"
            name="payeeName"
            loading={isLoading}
            fluid
            icon={false}
            onResultSelect={handleResultSelect}
            onSearchChange={handleSearchChange}
            onBlur={onBlurPayeeName}
            results={results}
            value={payeeNameValue}
            resultRenderer={renderSelectItem}
            minCharacters={3}
            input={{
              name: "payeeName",
              className: `${determinePromptStyle()}`,
              maxLength: CREDITOR_NAME_LENGTH
            }}
          />
          <span className="search-icon">{displaySearchIcon()}</span>
          <p className="error payeeName">
            {errors.payeeName && errors.payeeName.message}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="manage-contacts-container">
        <div className="manage-contacts-header">
          <h3>{mode === modeName.CREATE_MODE ? "Add payee" : "Edit payee"}</h3>
          <input
            type="image"
            className="manage-contacts-cross"
            src={cross}
            alt="Close payee edit"
            onClick={() => handleCrossClick()}
          />
        </div>
        <Divider className="manage-contacts-divider payee-divider" />

        {mode === modeName.EDIT_MODE && renderEditHeader()}
        {alertError && renderAlertModal()}
        <form
          className="rebank-form edit-payee-form"
          onSubmit={handleSubmit(handleOnSubmit)}
          data-testid="form-edit-payee"
        >
          {mode === modeName.CREATE_MODE && renderApprovedCreditors()}
          <div className="edit-label">
            <div className="form-icon">
              <img src={getAccountNumberIcon()} alt="Account number" />
            </div>
            <div className="form-inputs input-spacing">
              <label
                className={`form-label ${
                  selectedMode() ? "disabled-label" : ""
                }`}
                htmlFor="edit-payee-account-number"
              >
                Account number
              </label>
              <input
                className={`ui input full-width-input ${
                  selectedMode() ? "disabled-input" : ""
                } ${
                  errors.account || serverErrors.account.type
                    ? "has-errors"
                    : ""
                } `}
                placeholder=""
                ref={register({
                  validate: validationRulesAccount(selectedMode())
                })}
                name="account"
                id="edit-payee-account-number"
                defaultValue={
                  mode === modeName.CREATE_MODE
                    ? ""
                    : payeeToHandle.payeeCustomerReference
                }
                maxLength={ACCOUNT_NUMBER_LENGTH}
                disabled={selectedMode()}
                onChange={onAccountNumberChange}
                autoComplete="off"
              />
              <p className={isTextOrErrorClass()}>{isTextOrErrorMessage()}</p>
            </div>
          </div>
          <div className="edit-label">
            <div className="form-icon">
              <img src={getPencilIcon()} alt="Nickname" />
            </div>
            <div className="form-inputs input-spacing">
              <label
                className={`form-label  ${
                  selectedMode() ? "disabled-label" : ""
                }`}
                htmlFor="edit-payee-nickname"
              >
                Nickname (optional)
              </label>
              <input
                placeholder=""
                name="nickname"
                ref={register({ validate: validationRulesNickname })}
                id="edit-payee-nickname"
                defaultValue={
                  mode === modeName.CREATE_MODE
                    ? ""
                    : filterNickname(
                        payeeToHandle.payeeName,
                        payeeToHandle.payeeNickname
                      )
                }
                maxLength={NICKNAME_NAME_LENGTH}
                disabled={selectedMode()}
                className={`ui input full-width-input ${
                  selectedMode() ? "disabled-input" : ""
                } ${errors.nickname ? "has-errors" : ""} `}
                autoComplete="off"
              />
              <p className="error">
                {errors.nickname ? errorMessages[errors.nickname.type] : ""}
              </p>
              <div />
            </div>
          </div>
          <div>
            <p className="payee-shortname">
              {mode !== modeName.CREATE_MODE
                ? manageContactMessage.MSG_RBBP_044A(
                    prepareName(payeeToHandle.payeeName)
                  )
                : ""}
              {!selectedMode() && mode !== modeName.EDIT_MODE
                ? manageContactMessage.MSG_RBBP_044A(
                    prepareName(getValues().payeeName)
                  )
                : ""}
            </p>
          </div>

          <div className="button-container">
            <Button
              primary
              htmlType="submit"
              loading={isPosting}
              block
              data-testid="add-save-payee"
            >
              {isPosting
                ? null
                : mode === modeName.EDIT_MODE
                ? "Save"
                : "Add payee"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPayee;
