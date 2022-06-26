import React, { memo } from 'react';
import { DictionaryDropdown } from '../../Dictionary/DictionaryDropdown';

const VendorDropdown = memo((props) => {
  return <DictionaryDropdown dictionaryType={'company-type'} {...props} />;
});

VendorDropdown.displayName = 'VendorDropdown';

VendorDropdown.propTypes = {
  ...DictionaryDropdown.propTypes,
};

VendorDropdown.defaultProps = {
  label: 'Vendor',
};

export { VendorDropdown };
