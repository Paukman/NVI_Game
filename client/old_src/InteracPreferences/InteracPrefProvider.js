import React, { createContext } from "react";
import PropTypes from "prop-types";
import useAccountHolderName from "utils/hooks/useAccountHolderName";
import useProfile from "./hooks/useProfile";
import useAutodeposit from "./hooks/useAutodeposit";
import useAutodepositRules from "./hooks/useAutodepositRules";
import useProfileRules from "./hooks/useProfileRules";

export const InteracPreferencesContext = createContext();

const InteracPrefProvider = props => {
  InteracPrefProvider.propTypes = {
    children: PropTypes.node.isRequired
  };
  const { accountHolderFullName } = useAccountHolderName();
  const legalName = accountHolderFullName;

  const {
    profileState,
    updateProfile,
    createProfile,
    onProfileChange,
    cancelProfileEdit,
    cancelProfileCreate
  } = useProfile();

  const {
    autodepositState,
    updateAutodeposit,
    createAutodepositRule,
    updateAutoDepositRule,
    deleteAutoDepositRule,
    setAutoDepositRule,
    onAutodepositChange,
    handleRegister,
    clearForm,
    showNoProfileAlert
  } = useAutodeposit({ enabled: profileState.enabled });

  useProfileRules({
    profile: profileState.editProfile,
    enabled: profileState.enabled,
    dataLoaded: profileState.dataLoaded,
    error: profileState.error
  });

  useAutodepositRules({
    setAutoDepositRule,
    rules: autodepositState.rules,
    profile: profileState.editProfile,
    enabled: profileState.enabled,
    dataLoaded: autodepositState.dataLoaded,
    error: autodepositState.error,
    showNoProfileAlert
  });
  const { children } = props;
  return (
    <InteracPreferencesContext.Provider
      value={{
        userProfile: {
          profileState,
          handleOnChange: onProfileChange,
          cancelEdit: cancelProfileEdit,
          cancelCreate: cancelProfileCreate,
          onSubmitUpdate: updateProfile,
          onSubmitCreate: createProfile
        },
        autodeposit: {
          autodepositState,
          updateAutodeposit,
          createAutodepositRule,
          updateAutoDepositRule,
          deleteAutoDepositRule,
          setAutoDepositRule,
          handleOnChange: onAutodepositChange,
          handleRegister,
          clearForm,
          showNoProfileAlert
        },
        legalName
      }}
    >
      {children}
    </InteracPreferencesContext.Provider>
  );
};

export default InteracPrefProvider;
