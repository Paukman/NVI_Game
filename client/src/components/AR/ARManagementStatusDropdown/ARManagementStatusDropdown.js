import React, { memo } from 'react';
import { DictionaryDropdown } from '../../Dictionary/DictionaryDropdown';
import { DropdownWrapper } from './styled';

const ARManagementStatusDropdown = memo((props) => {
  return (
    <DropdownWrapper>
      <DictionaryDropdown dictionaryType={'hotel-client-account-management-status'} {...props} />;
    </DropdownWrapper>
  );
});

ARManagementStatusDropdown.displayName = 'ARManagementStatusDropdown';

ARManagementStatusDropdown.propTypes = {
  ...DictionaryDropdown.propTypes,
};

export { ARManagementStatusDropdown };
