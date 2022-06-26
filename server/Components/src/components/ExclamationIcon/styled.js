import styled, { css } from 'styled-components';
import { makeStyles } from '@material-ui/core';
import theme from '../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

const Wrapper = styled.div`
  display: inline-block;
  margin: auto;
`;

const TitleWrapper = styled.p`
  color: ${colors.mediumGray};
  line-height: 12pt;
  margin-top: 2px;
`;

const ItemWrapper = styled.p`
  display: block;
  color: ${colors.black};
  line-height: 5pt;
  font-weight: 600;
  text-align: left;
`;

const useStyles = makeStyles({
  tooltipPlacementBottom: {
    margin: '0',
  },
  tooltip: {
    backgroundColor: colors.white,
    border: '1px solid ' + colors.grey,
    boxShadow: '0px 0px 8px ' + colors.grey,
    textAlign: 'center',
  },
  arrow: {
    '&:before': {
      border: '1px solid ' + colors.grey,
    },
    color: colors.white,
    fontSize: 20,
  },
});

export { Wrapper, TitleWrapper, ItemWrapper, useStyles };
