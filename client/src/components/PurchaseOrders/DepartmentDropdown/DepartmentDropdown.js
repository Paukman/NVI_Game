import React, { memo } from 'react';
import { DictionaryDropdown } from '../../Dictionary/DictionaryDropdown';

const DepartmentDropdown = memo((props) => {
  return <DictionaryDropdown dictionaryType={'department-type'} {...props} />;
});

DepartmentDropdown.displayName = 'DepartmentDropdown';

DepartmentDropdown.propTypes = {
  ...DictionaryDropdown.propTypes,
};

DepartmentDropdown.defaultProps = {
  label: 'Department',
};

export { DepartmentDropdown };
