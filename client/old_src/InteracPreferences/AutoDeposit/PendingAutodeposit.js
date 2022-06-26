/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import crossIcon from "assets/icons/Cross/cross.svg";
import emailIcon from "assets/icons/Email/email.svg";
import accountIcon from "assets/icons/Account/account.svg";
import { eTransferErrors } from "utils/MessageCatalog";
import { InteracPreferencesContext } from "../InteracPrefProvider";

import { RULES_VIEW_PAGE } from "../constants";
import "./styles.scss";

const PendingAutodeposit = () => {
  const { autodeposit, legalName } = useContext(InteracPreferencesContext);
  const { autodepositState, deleteAutoDepositRule, clearForm } = autodeposit;
  const { rebankSupportNumber, autodepositRule, error } = autodepositState;
  const history = useHistory();

  if (error.type) {
    return null;
  }

  const handleOnDelete = () => {
    deleteAutoDepositRule(autodepositRule);
  };

  const handleCancel = () => {
    clearForm();
    history.push(RULES_VIEW_PAGE);
  };
  // eslint-disable-next-line consistent-return
  return (
    <div className="mt-6 margin-interac-profile">
      <div className="ui grid">
        <div className="row">
          <div className="fifteen wide column">
            <h3 className="autodeposit profile-header">Autodeposit Pending</h3>
            <button
              type="button"
              className="close-btn no-outline float-right close-btn-margin-interac-profile"
              data-testid="create-rule-cancel"
              onClick={handleCancel}
            >
              <img src={crossIcon} alt="create-rule-cancel" />
            </button>
            <div className="ui divider" />
          </div>
        </div>
        <div className="row">
          <div className="column nmt-3 pr-6">
            Almost done! You&apos;ll receive a confirmation email from{" "}
            <i>Interac</i> at the address you entered. Click the activation link
            in that email within 24 hours to complete your Autodeposit
            registration.
          </div>
        </div>
        <div className="row">
          <div className="column">
            <b>If</b>
            {` funds are sent by`} {eTransferErrors.eTransfer_Trademark}{" "}
            {` to:`}
          </div>
        </div>
        <div className="row pt-0">
          <div className="fifteen wide column">
            <form className="ui form inline-form">
              <div className="mb-4">
                <div className="autodeposit label-title pl-8">Email</div>
                <div className="ui form inline-form-field">
                  <img
                    alt="pending-autodeposit-email"
                    src={emailIcon}
                    className="nmt-6"
                  />
                  <div className="ui form inline-form-field form-field pl-3">
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
              <div className="mt-3">
                <div className="autodeposit label-title pl-8">Account</div>
                <div className="ui form inline-form-field">
                  <img
                    alt="pending-autodeposit-email"
                    src={accountIcon}
                    className="nmt-6"
                  />
                  <div className="ui form inline-form-field form-field pl-3">
                    {autodepositRule.accountName} ({autodepositRule.account})
                  </div>
                </div>
              </div>
              {autodepositRule.account && (
                <div className="pt-12">
                  <p className="small-text ">
                    When someone sends you funds by <i>Interac</i> e-Transfer,
                    for security purposes, they&#39;ll see your registered legal
                    name {legalName}.
                  </p>
                  <p className="small-text">
                    If you need to update your name in our records, call{" "}
                    {rebankSupportNumber} and make sure to have any relevant
                    legal documents ready.
                  </p>
                </div>
              )}
              <button
                onClick={handleOnDelete}
                type="button"
                className="ui button interac-btn float-right interac-centered-btn secondary mt-5 mb-8"
                aria-label="delete autodeposit rule"
                data-testid="delete-autodeposit"
              >
                Delete
              </button>
            </form>
          </div>
          <div className="one wide column" />
        </div>
      </div>
    </div>
  );
};
export default PendingAutodeposit;
