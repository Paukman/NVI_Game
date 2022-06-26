import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { getText } from '../../../utils/localesHelpers';
import { DictionaryDropdown } from '../../Dictionary/DictionaryDropdown';

const KpiCategoryDropdown = memo((props) => {
  const startWithItems = [];

  if (props.includeAll) {
    startWithItems.push({
      label: getText('kpi.allCategories'),
      value: -1,
    });
  }

  return <DictionaryDropdown dictionaryType={'kpi-category'} startWithItems={startWithItems} {...props} />;
});

KpiCategoryDropdown.displayName = ' KpiCategoryDropdown';

KpiCategoryDropdown.propTypes = {
  ...DictionaryDropdown.propTypes,
  includeAll: PropTypes.bool,
};

KpiCategoryDropdown.defaultProps = {
  includeAll: true,
};

export { KpiCategoryDropdown };
