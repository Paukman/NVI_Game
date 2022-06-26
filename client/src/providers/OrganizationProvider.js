import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { OrganizationContext } from '../contexts';
import { useOrganization } from '../graphql';

const OrganizationProvider = (props) => {
  const { children } = props;
  const { organizationList, organizations, organizationsLoading, organizationListCalled } = useOrganization();

  useEffect(() => {
    organizationList();
  }, [organizationList]);

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        organizationsLoading,
        organizationListCalled,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

OrganizationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { OrganizationProvider };
