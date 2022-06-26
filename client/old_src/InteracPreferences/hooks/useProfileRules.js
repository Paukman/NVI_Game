import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  PROFILE_VIEW_PAGE,
  EDIT_PROFILE_PAGE,
  NO_PROFILE_PAGE,
  CREATE_PROFILE_PAGE,
  PROFILE_DEFAULT_PAGE,
  BASE_PATH_PROFILE
} from "../constants";

const useProfileRules = ({ profile = null, enabled, dataLoaded, error }) => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (!dataLoaded) {
      return;
    }
    switch (location.pathname) {
      case PROFILE_VIEW_PAGE: {
        if (!(profile && enabled)) {
          history.push(NO_PROFILE_PAGE);
          return;
        }
        if (error.type) {
          return;
        }
        return;
      }
      case NO_PROFILE_PAGE: {
        if (profile && enabled) {
          history.push(PROFILE_VIEW_PAGE);
          return;
        }
        if (error.type) {
          return;
        }
        return;
      }
      case EDIT_PROFILE_PAGE: {
        if (error.type) {
          return;
        }
        if (!(profile && enabled)) {
          history.push(NO_PROFILE_PAGE);
        }
        break;
      }
      case CREATE_PROFILE_PAGE: {
        if (error.type) {
          return;
        }
        if (profile && enabled) {
          history.push(PROFILE_VIEW_PAGE);
        }
        break;
      }
      case PROFILE_DEFAULT_PAGE:
      case BASE_PATH_PROFILE: {
        if (profile && enabled) {
          history.push(PROFILE_VIEW_PAGE);
        } else history.push(NO_PROFILE_PAGE);
        break;
      }
      default:
        break;
    }
  }, [location, history, profile, dataLoaded, error, enabled]);

  return {
    location,
    history
  };
};

export default useProfileRules;
