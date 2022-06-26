import React, { memo } from 'react';
import { DictionaryDropdown } from '../../Dictionary/DictionaryDropdown';

const KpiOperandDropdown = memo((props) => {
  return <DictionaryDropdown dictionaryType={'kpi-operand'} {...props} />;
});

KpiOperandDropdown.displayName = 'KpiOperandDropdown';

KpiOperandDropdown.propTypes = {
  ...DictionaryDropdown.propTypes,
};

export { KpiOperandDropdown };
