import React, { createContext } from "react";
import PropTypes from "prop-types";
import useProfile from "../../InteracUserProfile/useProfile";

export const FulfillERequestContext = createContext();

const FulfillERequestProvider = props => {
  FulfillERequestProvider.propTypes = {
    children: PropTypes.node.isRequired
  };

  const { profile, goNext } = useProfile();

  const { children } = props;
  return (
    <FulfillERequestContext.Provider
      value={{
        userProfile: {
          profile,
          goNext
        }
      }}
    >
      {children}
    </FulfillERequestContext.Provider>
  );
};

export default FulfillERequestProvider;
