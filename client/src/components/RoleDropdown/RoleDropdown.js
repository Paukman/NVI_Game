import React, { memo, useEffect, useMemo } from 'react';
//import PropTypes from 'prop-types';
import { getText } from 'utils/localesHelpers';
import { Dropdown } from 'mdo-react-components';
import { useRole } from '../../graphql';

const RoleDropdown = memo((props) => {
  const { roles, roleList, rolesLoading } = useRole();

  useEffect(() => {
    roleList({ params: {} });
  }, [roleList]);

  const items = [];

  if (rolesLoading) {
    items.push({
      label: getText('generic.loading'),
      value: '',
      disabled: true,
    });
  } else {
    items.push(
      ...roles.data.map((role) => {
        return {
          label: `${role.roleName} (ID: ${role.id})`,
          value: role.id,
        };
      }),
    );
  }

  return <Dropdown items={items} {...props} />;
});

RoleDropdown.displayName = 'RoleDropdown';

RoleDropdown.propTypes = {
  ...Dropdown.propTypes,
};

export { RoleDropdown };
