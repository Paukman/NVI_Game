import styled from 'styled-components';
import { makeStyles } from '@material-ui/core';
import { calcCssSize } from '../../utils/propHelpers';

export const useListStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    // styles applied to List
    root: {
      paddingLeft: ({ level }) => `${10 * (level - 1)}px`,
    },
    // styles applied when disablePadding=true
    padding: {},
    // styles applied when dense=true
    dense: {},
    // styles applied for subheader
    subheader: {},
  };
});

export const useListItemStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    // styles applied to List
    root: {},
    // styles applied when dense=true
    dense: {},
    // styles applied for disabled
    disabled: {},
    // styles applied for divider
    divider: (props) => ({
      height: calcCssSize(props.dividerHeight),
      overflow: 'hidden',
      padding: '0',
    }),
    // styles applied for gutters
    gutters: {},
    // styles applied for button
    button: {},
    // styles applied for selected
    selected: {
      '&.MuiListItem-root.Mui-selected': {
        backgroundColor: colors.darkBlue,
        color: colors.white,
      },
      '&:hover': {
        backgroundColor: colors.darkBlue,
        color: colors.white,
      },
    },
  };
});

export const useListSubheaderStyles = makeStyles(() => {
  return {
    root: {
      color: 'currentColor',
    },
    gutters: {},
    sticky: {
      zIndex: 10,
    },
  };
});

export const useListItemTextStyles = makeStyles(() => {
  return {
    root: (props) => {
      return {
        color: 'currentColor',
        '&.MuiListItemText-root': {
          fontWeight: props.textBold ? 'bold' : 'normal',
        },
      };
    },
  };
});

export const useListItemIconStyles = makeStyles(() => {
  return {
    root: {
      color: 'currentColor',
      minWidth: '40px',
    },
  };
});

export const useTypographyStyles = makeStyles(() => {
  return {
    root: {
      '&.MuiTypography-root': {
        fontWeight: 'normal',
      },
    },
  };
});

export const ListTextSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: ${({ height }) => (height ? calcCssSize(height) : 'auto')};
`;

export const ListTextSearchInput = styled.div`
  flex: 0 0;
  padding-bottom: 10px;
  width: 100%;
`;

export const ListTextSearchItems = styled.div`
  flex: 1 1;
  width: 100%;
  overflow-y: auto;
`;

export const ListTextSearchPagination = styled.div`
  padding-top: 10px;
  flex: 0 0;
  width: 100%;
`;
