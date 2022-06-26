import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'mdo-react-components';

import { HeaderFooter, NameColumn } from './styled';

const TextCellRenderer = ({ value, dataRow }) => {
  return dataRow.header || dataRow.footer ? (
    <HeaderFooter>{value}</HeaderFooter>
  ) : (
    <NameColumn
      topLevelHeaders={dataRow.topLevelHeaders}
      subLevelHeaders={dataRow.subLevelHeaders}
      hasChildren={dataRow.children && dataRow.children.length}
      isMappingSummary={dataRow.isMappingSummary}
    >
      {typeof value === 'string' && value.length > 100 ? (
        <Tooltip title={value} arrow>
          <span>{value.substr(0, 100)}...</span>
        </Tooltip>
      ) : (
        value
      )}
    </NameColumn>
  );
};

TextCellRenderer.propTypes = {
  value: PropTypes.any,
  dataRow: PropTypes.any,
};

TextCellRenderer.displayName = 'TextCellRenderer';

export { TextCellRenderer };
