/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Dropdown } from "semantic-ui-react";
import crossIcon from "assets/icons/Cross/cross.svg";
import emailIcon from "assets/icons/Email/email.svg";
import accountIcon from "assets/icons/Account/account.svg";
import { interacPreferences } from "utils/MessageCatalog";
import { Button } from "StyleGuide/Components";
import { ModalContext } from "Common/ModalProvider";
import { InteracPreferencesContext } from "../InteracPrefProvider";
import useAutodepositForm from "../hooks/useAutodepositForm";
import { errorMessages } from "../hooks/utils";
import "./styles.scss";
import { RULES_VIEW_PAGE } from "../constants";

const EditRule = () => {
  const { autodeposit, legalName } = useContext(InteracPreferencesContext);
  const { modalComponent } = useContext(ModalContext);
  const {
    updateAutoDepositRule,
    deleteAutoDepositRule,
    clearForm,
    autodepositState,
    handleOnChange
  } = autodeposit;

  const {
    account,
    formattedAccountOptions,
    rebankSupportNumber,
    autodepositRule,
    error,
    isPosting
  } = autodepositState;

  const { handleOnDropdownChange, errors, validateForm } = useAutodepositForm(
    handleOnChange,
    autodepositState
  );
  const history = useHistory();

  if (error.type) {
    return null;
  }

  const handleOnClick = async () => {
    const valid = await validateForm();
    if (valid) {
      updateAutoDepositRule();
    }
  };

  const handleCancel = () => {
    clearForm();
    history.push(RULES_VIEW_PAGE);
  };

  const handleOnDelete = () => {
    deleteAutoDepositRule(autodepositRule);
  };

  const handleModal = () => {
    clearForm();
    history.push(RULES_VIEW_PAGE);
  };

  // If legal name blank
  if (!legalName) {
    return (
      <>
        {modalComponent({
          show: true,
          content: interacPreferences.MSG_RBET_052B(),
          actions: (
            <button
              type="button"
              className="ui button basic"
              onClick={() => handleModal()}
            >
              OK
            </button>
          )
        })}
      </>
    );
  }

  return (
    <div className="mt-6 margin-interac-profile">
      <div className="ui grid">
        <div className="row">
          <div className="fifteen wide column">
            <h3
              data-testid="Edit-Autodeposit"
              className="autodeposit profile-header"
            >
              Edit Autodeposit
            </h3>
            <button
              type="button"
              className="close-btn float-right no-outline close-btn-margin-interac-profile"
              data-testid="create-rule-cancel"
              onClick={handleCancel}
            >
              <img src={crossIcon} alt="create-rule-cancel" />
            </button>
            <div className="ui divider" />
          </div>
        </div>
        <div className="row">
          <div className="column column nmt-3 pr-6">
            Register your email address and link it to your account. Any
            transfers sent to the registered email address will automatically be
            deposited into the account.{" "}
          </div>
        </div>
        <div className="row">
          <div className="column">
            <b>If</b>
            {` funds are sent by`} <i>Interac</i> {` e-Transfer to:`}
          </div>
        </div>
        <div className="row nmt-4">
          <div className="fifteen wide column">
            <form className="ui form inline-form">
              <div className="mb-3">
                <div className="ui form inline-form label-div pl-6">Email</div>
                <div className="ui form inline-form-field">
                  <img
                    alt="pending-autodeposit-email"
                    src={emailIcon}
                    className="nmt-5"
                  />
                  <div
                    className="ui form inline-form-field form-field"
                    data-testid="register-rule-email"
                  >
                    {autodepositRule.directDepositHandle}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <b>Then</b>
                  {` deposit funds into:`}
                </div>
              </div>
              <div className="mt-2">
                <label
                  className="ui form inline-form label-div pl-6 mb-2"
                  htmlFor="register-rule-account"
                >
                  Account
                </label>
                <div className="ui form inline-form-field">
                  <img alt="account-profile-edit" src={accountIcon} />
                  <Dropdown
                    searchInput={{ id: "register-rule-account" }}
                    value={account}
                    placeholder="Select account"
                    data-testid="register-rule-account"
                    selection
                    fluid
                    onChange={handleOnDropdownChange}
                    name="account"
                    search
                    selectOnBlur={false}
                    selectOnNavigation={false}
                    options={formattedAccountOptions}
                    className={errors.account && "has-errors"}
                  />
                </div>
                <p className="ui form inline-form error-message">
                  {errors.account && errorMessages[errors.account.type]}
                </p>
              </div>
              {account && (
                <div className="autodepost message-bottom">
                  <p>
                    When someone sends you funds by <i>Interac e-Transfer</i>,
                    for security purposes, they{"'"}ll see your registered legal
                    name {legalName}.
                  </p>
                  <p>
                    If you need to update your name in our records, call{" "}
                    {rebankSupportNumber} and make sure to have any relevant
                    legal documents ready.
                  </p>
                </div>
              )}
              <div className="button-container">
                <div className="primary-button">
                  <Button
                    primary
                    block
                    onClick={handleOnClick}
                    loading={isPosting}
                  >
                    {isPosting ? null : "Save"}
                  </Button>
                </div>
                <div className="text-button">
                  <Button
                    block
                    onClick={handleOnDelete}
                    unclickable={isPosting}
                    text
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div className="one wide column" />
        </div>
      </div>
    </div>
  );
};
export default EditRule;