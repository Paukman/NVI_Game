import React, { memo } from 'react';
import { DictionaryDropdown } from '../../Dictionary/DictionaryDropdown';

const POTypeDropdown = memo((props) => {
  return <DictionaryDropdown dictionaryType={'purchase-order-type'} searchable {...props} />;
});

POTypeDropdown.displayName = 'POTypeDropdown';

POTypeDropdown.propTypes = {
  ...DictionaryDropdown.propTypes,
};

POTypeDropdown.defaultProps = {
  label: 'PO Types',
};

export { POTypeDropdown };
