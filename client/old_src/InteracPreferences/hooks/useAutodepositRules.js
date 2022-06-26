import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  RULES_VIEW_PAGE,
  EDIT_RULE_PAGE,
  PENDING_RULES_PAGE,
  NO_RULES_REGISTERED_PAGE,
  REGISTER_RULE_PAGE,
  AUTODEPOSIT_DEFAULT_PAGE,
  BASE_PATH_AUTODEPOSIT
} from "../constants";

const PENDING = 0;
const ACTIVE = 1;

export const useQuery = param => {
  const query = new URLSearchParams(useLocation().search);
  return query.get(param);
};

const useAutodepositRules = ({
  rules = [],
  profile = null,
  enabled = false,
  setAutoDepositRule = null,
  dataLoaded,
  error,
  showNoProfileAlert
}) => {
  const refNumber = useQuery("rule");
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    if (!dataLoaded) {
      return;
    }
    const noProfileExist = !(profile && enabled);
    switch (location.pathname) {
      case RULES_VIEW_PAGE: {
        if (noProfileExist) {
          showNoProfileAlert();
        }
        if (error.type) {
          return;
        }
        if (rules.length === 0) {
          history.push(NO_RULES_REGISTERED_PAGE);
          return;
        }
        return;
      }
      case NO_RULES_REGISTERED_PAGE: {
        if (noProfileExist) {
          showNoProfileAlert();
        }
        if (error.type) {
          return;
        }
        if (rules.length) {
          history.push(RULES_VIEW_PAGE);
          return;
        }
        return;
      }
      case PENDING_RULES_PAGE: {
        if (noProfileExist) {
          showNoProfileAlert();
        }
        if (error.type) {
          return;
        }
        if (rules.length) {
          const rule =
            rules.filter(
              item => item.directDepositReferenceNumber === refNumber
            )[0] || null;

          if (rule && rule.registrationStatus === PENDING) {
            setAutoDepositRule(rule);
            return;
          }
        }
        history.push(RULES_VIEW_PAGE); // all other cases
        return;
      }
      case EDIT_RULE_PAGE: {
        if (noProfileExist) {
          showNoProfileAlert();
        }
        if (error.type) {
          return;
        }
        if (rules.length) {
          const rule =
            rules.filter(
              item => item.directDepositReferenceNumber === refNumber
            )[0] || null;
          if (rule && rule.registrationStatus === ACTIVE) {
            setAutoDepositRule(rule);
            return;
          }
        }
        history.push(RULES_VIEW_PAGE); // all other cases
        break;
      }
      case REGISTER_RULE_PAGE: {
        if (noProfileExist) {
          showNoProfileAlert();
        }
        if (rules.length >= 5) history.push(RULES_VIEW_PAGE);
        break;
      }
      case AUTODEPOSIT_DEFAULT_PAGE:
      case BASE_PATH_AUTODEPOSIT: {
        if (noProfileExist) {
          showNoProfileAlert();
        }
        if (rules.length === 0) {
          history.push(NO_RULES_REGISTERED_PAGE);
        } else history.push(RULES_VIEW_PAGE);
        break;
      }
      default:
        break;
    }
  }, [
    rules,
    location,
    profile,
    enabled,
    history,
    refNumber,
    setAutoDepositRule,
    dataLoaded,
    error
  ]);

  return {
    location,
    history,
    refNumber
  };
};

export default useAutodepositRules;
