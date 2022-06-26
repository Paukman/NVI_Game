import React from 'react';
import PropTypes from 'prop-types';
import { UserContext } from 'contexts';
import { useUser } from 'hooks';

const UserProvider = (props) => {
  const { children } = props;
  const { user, setUserInfo, clearUserInfo, updateMdoToken } = useUser();

  return (
    <UserContext.Provider
      value={{
        user,
        setUserInfo,
        clearUserInfo,
        updateMdoToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserProvider };
