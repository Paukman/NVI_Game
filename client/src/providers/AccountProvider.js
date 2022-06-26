import React from 'react';
import PropTypes from 'prop-types';
import { AccountContext } from '../contexts';
import { useAccountMapping } from '../graphql';

const AccountProvider = (props) => {
  const { children } = props;
  const accountHooks = useAccountMapping();

  return <AccountContext.Provider value={accountHooks}>{children}</AccountContext.Provider>;
};

AccountProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AccountProvider };
