import React, { memo } from 'react';
import { DictionaryButtonDropdown } from '../../Dictionary/DictionaryButtonDropdown';

const KpiAggregatorButtonDropdown = memo((props) => {
  return <DictionaryButtonDropdown dictionaryType={'kpi-aggregator'} {...props} />;
});

KpiAggregatorButtonDropdown.displayName = 'KpiAggregatorButtonDropdown';

KpiAggregatorButtonDropdown.propTypes = {
  ...DictionaryButtonDropdown.propTypes,
};


export { KpiAggregatorButtonDropdown };
