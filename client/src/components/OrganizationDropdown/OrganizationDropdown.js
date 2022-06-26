import React, { memo, useContext } from 'react';
//import PropTypes from 'prop-types';
import { getText } from 'utils/localesHelpers';
import { Dropdown, SearchableDropdown } from 'mdo-react-components';
import { OrganizationContext } from '../../contexts';

const OrganizationDropdown = memo((props) => {
  const { organizations, organizationsLoading } = useContext(OrganizationContext);

  const items = [];

  if (organizationsLoading) {
    items.push({
      label: getText('generic.loading'),
      value: '',
      disabled: true,
    });
  } else {
    items.push(
      ...organizations.data.map((organization) => {
        return {
          label: `${organization.companyName}`,
          value: organization.id,
        };
      }),
    );
  }

  return <SearchableDropdown items={items} {...props} disableClearable />;
});

OrganizationDropdown.displayName = 'OrganizationDropdown';

OrganizationDropdown.propTypes = {
  ...Dropdown.propTypes,
};

export { OrganizationDropdown };
