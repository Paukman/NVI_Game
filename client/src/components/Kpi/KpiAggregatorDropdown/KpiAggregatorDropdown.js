import React, { memo } from 'react';
import { DictionaryDropdown } from '../../Dictionary/DictionaryDropdown';

const KpiAggregatorDropdown = memo((props) => {
  return <DictionaryDropdown dictionaryType={'kpi-aggregator'} {...props} />;
});

KpiAggregatorDropdown.displayName = 'KpiAggregatorDropdown';

KpiAggregatorDropdown.propTypes = {
  ...DictionaryDropdown.propTypes,
};

export { KpiAggregatorDropdown };
