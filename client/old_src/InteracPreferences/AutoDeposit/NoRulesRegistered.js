import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { eTransferErrors } from "utils/MessageCatalog";
import { InteracPreferencesContext } from "../InteracPrefProvider";
import { REGISTER_RULE_PAGE } from "../constants";
import "./styles.scss";

const NoRulesRegistered = () => {
  const { autodeposit } = useContext(InteracPreferencesContext);
  const { handleRegister, autodepositState } = autodeposit;
  const history = useHistory();
  const { error } = autodepositState;

  const handleNewRegister = () => {
    handleRegister();
    history.push(REGISTER_RULE_PAGE);
  };

  if (error.type) {
    return null;
  }

  // eslint-disable-next-line consistent-return
  return (
    <div className="mt-6 margin-interac-profile">
      <div className="ui grid">
        <div className="row">
          <div className="fifteen wide column">
            <div className="profile-title">
              <div>
                <h3
                  className="autodeposit profile-header"
                  data-testid="autodeposit-header"
                >
                  Autodeposit
                </h3>
              </div>
              <div className="ui divider" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="fifteen wide column">
            <p className="autodeposit profile-body">
              {`Autodeposit is an `}
              {eTransferErrors.eTransfer_Trademark}
              {` feature that allows you to have funds deposited directly 
              into your bank account, without having to answer a security question.`}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="fifteen wide column">
            <form className="ui form inline-form">
              <button
                type="button"
                className="ui button interac-btn float-right interac-centered-btn secondary mt-5 mb-8"
                onClick={handleNewRegister}
                aria-label="Register autodeposit profile"
                data-testid="register-rule"
              >
                Register
              </button>
            </form>
          </div>
          <div className="one wide column" />
        </div>
      </div>
    </div>
  );
};

export default NoRulesRegistered;
