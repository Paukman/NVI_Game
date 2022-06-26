import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { getText } from '../../../utils/localesHelpers';
import { DictionaryButtonDropdown } from '../../Dictionary/DictionaryButtonDropdown';

const KpiCategoryButtonDropdown = memo((props) => {
  const startWithItems = [];
  if (props.includeAll) {
    startWithItems.push({
      label: getText('kpi.allCategories'),
      value: -1,
    });
  }

  return <DictionaryButtonDropdown dictionaryType={'kpi-category'} startWithItems={startWithItems} {...props} />;
});

KpiCategoryButtonDropdown.displayName = 'KpiCategoryButtonDropdown';

KpiCategoryButtonDropdown.propTypes = {
  ...DictionaryButtonDropdown.propTypes,
  includeAll: PropTypes.bool,
};

KpiCategoryButtonDropdown.defaultProps = {
  includeAll: true,
};
export { KpiCategoryButtonDropdown };
