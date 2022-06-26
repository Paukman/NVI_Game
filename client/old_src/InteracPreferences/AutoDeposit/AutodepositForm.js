import React, { useContext } from "react";
import { useRouteMatch } from "react-router-dom";
import { Skeleton } from "antd";
import PropTypes from "prop-types";
import NoRulesRegistered from "./NoRulesRegistered";
import RegisterRule from "./RegisterRule";
import EditRule from "./EditRule";
import PendingAutodeposit from "./PendingAutodeposit";
import RulesView from "./RulesView";
import { InteracPreferencesContext } from "../InteracPrefProvider";
import "./styles.scss";

import { BASE_PATH_AUTODEPOSIT } from "../constants";

export const AutodepositSubView = ({ match }) => {
  AutodepositSubView.propTypes = {
    match: PropTypes.shape({}).isRequired
  };
  switch (match.params.sectionName) {
    case "view": {
      return <RulesView />;
    }
    case "no-rules": {
      return <NoRulesRegistered />;
    }
    case "pending": {
      return <PendingAutodeposit />;
    }
    case "register-rule": {
      return <RegisterRule />;
    }
    case "edit-rule": {
      return <EditRule />;
    }
    default:
      return null;
  }
};

export const AutodepositPage = () => {
  const match = useRouteMatch(`${BASE_PATH_AUTODEPOSIT}/:sectionName`);
  if (!match) return null;
  return <AutodepositSubView match={match} />;
};

const AutodepositForm = () => {
  const { userProfile, autodeposit } = useContext(InteracPreferencesContext);
  const { profileState } = userProfile;
  const { loading: profileLoading } = profileState;
  const { autodepositState } = autodeposit;
  const { loading: autodepositLoading } = autodepositState;

  if (profileLoading || autodepositLoading) {
    return (
      <div className="margin-left-60 margin-top-30 padding-right-60">
        <Skeleton active round paragraph={{ rows: 4 }} />
      </div>
    );
  }
  return <AutodepositPage />;
};

export default AutodepositForm;
