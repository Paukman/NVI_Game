import styled from 'styled-components';
import PropTypes from 'prop-types';
import { calcPxSize } from 'utils/formatHelpers';

const DataContainer = styled.div.attrs(() => {
  return {
    'data-el': 'data-container',
  };
})`
  width: 100%;
  flex: 1 1 0;
  overflow: ${({ overflow }) => overflow || 'auto'};
  position: relative;
  opacity: ${({ obsoleteData }) => (obsoleteData ? 0.4 : 1)};
  max-height: ${({ tableHeight }) => calcPxSize(tableHeight) || 'auto'};
`;

DataContainer.displayName = 'DataContainer';

DataContainer.propTypes = {
  obsoleteData: PropTypes.bool,
};

export { DataContainer };
