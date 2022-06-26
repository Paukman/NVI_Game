import React, { useContext } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import UrlTabMenuSelector from "Common/UrlTabSelector";
import { eTransferErrors } from "utils/MessageCatalog";
import Profile from "./UserProfile/Profile";
import AutodepositForm from "./AutoDeposit/AutodepositForm";
import { InteracPreferencesContext } from "./InteracPrefProvider";
import {
  BASE_PATH,
  BASE_PATH_PROFILE,
  BASE_PATH_AUTODEPOSIT,
  interacPreferencesTabItems
} from "./constants";

export const InteractPreferencesSubView = ({ match }) => {
  switch (match.params.sectionName) {
    case "profile":
      return <Profile />;
    case "autodeposit":
      return <AutodepositForm />;
    default: {
      return null;
    }
  }
};

export const InteracPreferences = () => {
  const match = useRouteMatch(`${BASE_PATH}/:sectionName`);
  if (!match) return null;
  return <InteractPreferencesSubView match={match} />;
};

const InteracPreferencesPage = () => {
  const { autodeposit } = useContext(InteracPreferencesContext);
  const { autodepositState } = autodeposit;
  const { hideSidebar } = autodepositState;
  const history = useHistory();

  const handleClick = index => {
    switch (index) {
      case 0:
        history.push(`${BASE_PATH_PROFILE}/view-profile`);
        break;
      case 1:
        history.push(`${BASE_PATH_AUTODEPOSIT}/view`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="sidebar-container">
      <div className={`sidebar-tabs ${hideSidebar}`}>
        <UrlTabMenuSelector
          title=""
          subTitle={eTransferErrors.preferences_Trademark}
          items={interacPreferencesTabItems}
          onClick={handleClick}
        />
      </div>
      <div className="sidebar-content sidebar-content-mobile">
        <InteracPreferences />
      </div>
    </div>
  );
};

export default InteracPreferencesPage;
