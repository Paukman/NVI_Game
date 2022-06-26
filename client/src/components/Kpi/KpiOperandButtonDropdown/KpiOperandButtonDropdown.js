import React, { memo } from 'react';
import { DictionaryButtonDropdown } from '../../Dictionary/DictionaryButtonDropdown';

const KpiOperandButtonDropdown = memo((props) => {
  return <DictionaryButtonDropdown dictionaryType={'kpi-operand'} {...props} />;
});

KpiOperandButtonDropdown.displayName = 'KpiOperandButtonDropdown';

KpiOperandButtonDropdown.propTypes = {
  ...DictionaryButtonDropdown.propTypes,
};

export { KpiOperandButtonDropdown };
