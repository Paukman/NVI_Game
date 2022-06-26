import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import useWindowDimensions from "utils/hooks/useWindowDimensions";

import chevron from "assets/icons/ChevronRight/chevron-right.svg";
import trashcan from "assets/icons/TrashCan/trashcan.svg";
import InteracStatusIndicator from "Common/InteracStatusIndicator/InteracStatusIndicator";
import "./styles.scss";
import "styles/snackbar.scss";
import "styles/text.scss";
import { eTransferErrors } from "utils/MessageCatalog";
import {
  PENDING_RULES_PAGE,
  EDIT_RULE_PAGE,
  REGISTER_RULE_PAGE
} from "../constants";
import { InteracPreferencesContext } from "../InteracPrefProvider";

const RulesView = () => {
  const { autodeposit: autodepositData } = useContext(
    InteracPreferencesContext
  );
  const {
    autodepositState,
    handleRegister,
    setAutoDepositRule,
    deleteAutoDepositRule,
    onKeyDown
  } = autodepositData;
  const { rules, error } = autodepositState;
  const { width } = useWindowDimensions();
  const history = useHistory();

  const renderPageTitle = () => {
    return "Autodeposit";
  };

  const getKeyForEachRow = autodeposit => {
    return autodeposit.directDepositReferenceNumber;
  };

  const handleRowClick = rule => {
    setAutoDepositRule(rule);
    if (rule.registrationStatus === 0) {
      history.push(
        `${PENDING_RULES_PAGE}?rule=${rule.directDepositReferenceNumber}`
      );
    } else {
      history.push(
        `${EDIT_RULE_PAGE}?rule=${rule.directDepositReferenceNumber}`
      );
    }
  };

  const handleNewRegister = () => {
    handleRegister();
    history.push(REGISTER_RULE_PAGE);
  };

  const handleUpdate = (e, rule) => {
    e.stopPropagation();
    setAutoDepositRule(rule);
    if (rule.registrationStatus === 0) {
      history.push(
        `${PENDING_RULES_PAGE}?rule=${rule.directDepositReferenceNumber}`
      );
    } else {
      history.push(
        `${EDIT_RULE_PAGE}?rule=${rule.directDepositReferenceNumber}`
      );
    }
  };

  const handleDelete = (e, rule) => {
    e.stopPropagation();
    deleteAutoDepositRule(rule);
  };

  const handleOnKeyDown = () => {
    onKeyDown();
  };

  if (error.type) {
    return null;
  }

  const renderMobileRulesList = () => {
    return rules.map((rule, index) => (
      <div
        role="button"
        tabIndex="0"
        onKeyDown={handleOnKeyDown}
        key={rule ? getKeyForEachRow(rule) : index}
        className="autodeposit-rules row-background"
        data-testid={`row-autodeposit-${index}`}
        onClick={() => {
          handleRowClick(rule);
        }}
      >
        <div className="autodeposit-rules row-container" role="presentation">
          {rule && (
            <>
              <InteracStatusIndicator interacStatus={rule.registrationStatus} />
              <div className="full-width">
                <div className="autodeposit-rules details">
                  <div className="label">Email</div>
                  <div className="value">
                    <span className="textEllipsesWrapper">
                      <p
                        className="firstText"
                        data-testid={`email-firstText-${index}`}
                      >
                        {rule.directDepositHandle.split("@")[0]}
                      </p>
                      <p
                        className="lastText"
                        data-testid={`email-lastText-${index}`}
                      >
                        {`@${rule.directDepositHandle.split("@")[1]}`}
                      </p>
                    </span>
                  </div>
                </div>
                <div className="autodeposit-rules details">
                  <div className="label">Account</div>
                  <div className="value">
                    <span className="textEllipsesWrapper">
                      <p
                        className="firstText"
                        data-testid={`account-firstText-${index}`}
                      >
                        {rule.accountName}
                      </p>
                      <p
                        className="lastText"
                        data-testid={`account-lastText-${index}`}
                      >
                        {" "}
                        ({rule.account})
                      </p>
                    </span>
                  </div>
                </div>
              </div>
              <img
                className="autodeposit-rules chevron"
                src={chevron}
                alt="Select Autodeposit"
              />
              <div className="ui divider mt-4 mb-4" />
            </>
          )}
        </div>
      </div>
    ));
  };

  const renderDesktopRulesList = () => {
    const paddingTable = width >= 1440 ? "pl-8" : "pl-4";
    const rows = rules.map((rule, index) => {
      return (
        <React.Fragment key={rule.directDepositReferenceNumber}>
          <div
            className={`row cell-item no-outline ${paddingTable} `}
            role="button"
            tabIndex="0"
            onKeyDown={handleOnKeyDown}
            data-testid={`row-autodeposit-${index}`}
            onClick={e => handleUpdate(e, rule)}
          >
            <div className="six wide column">
              <span className="textEllipsesWrapper">
                <p
                  className="firstText"
                  data-testid={`email-firstText-${index}`}
                >
                  {rule.directDepositHandle.split("@")[0]}
                </p>
                <p className="lastText" data-testid={`email-lastText-${index}`}>
                  {`@${rule.directDepositHandle.split("@")[1]}`}
                </p>
              </span>
            </div>
            <div className="five wide column">
              <span className="textEllipsesWrapper">
                <p
                  className="firstText"
                  data-testid={`account-firstText-${index}`}
                >
                  {rule.accountName}{" "}
                </p>
                <p
                  className="lastText"
                  data-testid={`account-lastText-${index}`}
                >
                  {" "}
                  ({rule.account})
                </p>
              </span>
            </div>
            <div className="five wide column">
              <div className="assets">
                <InteracStatusIndicator
                  interacStatus={rule.registrationStatus}
                  data-testid={`rule-status-${index}`}
                />
              </div>
              <span
                role="button"
                className="no-outline"
                name={`delete-autodeposit-${index}`}
                tabIndex="0"
                onKeyDown={handleOnKeyDown}
                data-testid={`delete-autodeposit-${rule.directDepositHandle.replace(
                  /[@\\.]/g,
                  "-"
                )}`}
                onClick={e => handleDelete(e, rule)}
              >
                <img
                  className="icons assets"
                  src={trashcan}
                  alt={`delete-autodeposit-${rule.directDepositReferenceNumber}`}
                />
              </span>
              <span
                role="button"
                className="no-outline select"
                name="select-autodeposit"
                tabIndex="0"
                onKeyDown={handleOnKeyDown}
                data-testid={`select-autodeposit-${index}`}
                onClick={e => handleUpdate(e, rule)}
              >
                <img
                  className="icons assets"
                  src={chevron}
                  alt={`select-autodeposit-${rule.directDepositReferenceNumber}`}
                />
              </span>
            </div>
          </div>
          <div className="ui divider item-divider" />
        </React.Fragment>
      );
    });
    return (
      <div className="transaction-grid mt-5 ml-3 mr-3">
        <div className="ui grid">
          <div className={`row head ${paddingTable}`}>
            <div className="six wide column header-items">Email</div>
            <div className="five wide column header-items">Account</div>
            <div className="five wide column header-items">Status</div>
          </div>
          {rows}
        </div>
      </div>
    );
  };

  return (
    <div className="autodeposit-rules form-container">
      <div className="autodeposit profile">
        <div className="autodeposit-rules header">
          <h3 data-testid="autodeposit-header">
            {autodepositData && renderPageTitle()}
          </h3>
          {autodepositData && (
            <span className="register-button-span">
              <>
                <button
                  type="button"
                  className="pl-0"
                  onClick={handleNewRegister}
                  data-testid="register-rule"
                >
                  Register another email
                </button>
              </>
            </span>
          )}
        </div>
        <div className="ui divider mb-4" />
        {autodepositData && (
          <>
            <div className="autodeposit-rules message">
              {`Autodeposit is an `}
              {eTransferErrors.eTransfer_Trademark}
              {` feature that allows you to have funds deposited directly 
             into your bank account, without having to answer a security question.`}
            </div>
          </>
        )}
        {width < 768 && (
          <>
            <div className="ui divider mt-0 mb-4" />
            {renderMobileRulesList()}
          </>
        )}
      </div>
      {width >= 768 && renderDesktopRulesList()}
    </div>
  );
};

export default RulesView;
