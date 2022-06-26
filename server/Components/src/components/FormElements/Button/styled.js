import styled from 'styled-components';
import { Button as ButtonMaterialUi } from '@material-ui/core';
import { calcCssSize, getSizeInPx } from '../../../utils/propHelpers';
import { colors } from '../../../theme/colors';

export const sizes = {
  xsSmall: {
    height: '28px',
    minWidth: '28px',
  },
  small: {
    height: '35px',
    minWidth: '35px',
  },
  large: {
    height: '55px',
    minWidth: '55px',
  },
  default: {
    height: '35px',
    minWidth: '75px',
  },
  medium: {
    height: '35px',
    minWidth: '75px',
  },
};

export const buttonsDirection = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

export const buttonsPlacement = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export const variantNames = ['default', 'primary', 'secondary', 'success', 'tertiary', 'alert', 'none'];
export const sizesNames = ['small', 'large', 'default', 'medium', 'xsSmall'];
export const directions = Object.keys(buttonsDirection);
export const placements = Object.keys(buttonsPlacement);

export const variants = {
  default: {
    default: {
      color: colors.blue,
      background: colors.white,
      borderColor: colors.gray,
    },
    hover: {
      background: colors.lightGray,
    },
    active: {
      boxShadow: `0 0 4px 1px ${colors.lightBlue}`,
    },
    disabled: {
      cursor: 'default',
      opacity: 0.8,
    },
  },
  primary: {
    default: {
      color: colors.white,
      background: colors.green,
      borderColor: colors.green,
    },
    hover: {
      background: colors.darkGreen,
    },
    active: {
      boxShadow: `0 0 4px 1px ${colors.lightBlue}`,
    },
    disabled: {
      cursor: 'default',
      opacity: 0.8,
    },
  },
  secondary: {
    default: {
      color: colors.black,
      background: colors.lightGreen,
      borderColor: colors.green,
    },
    hover: {
      background: colors.lightGreen,
    },
    active: {
      boxShadow: `0 0 4px 1px ${colors.lightBlue}`,
    },
    disabled: {
      cursor: 'default',
      opacity: 0.8,
    },
  },
  success: {
    default: {
      color: colors.white,
      background: colors.blue,
      borderColor: colors.blue,
    },
    hover: {
      background: colors.blue,
    },
    active: {
      boxShadow: `0 0 4px 1px ${colors.lightBlue}`,
    },
    disabled: {
      color: colors.white,
      background: colors.grey,
      cursor: 'default',
      opacity: 0.8,
      borderColor: colors.grey,
    },
  },
  tertiary: {
    default: {
      color: colors.blue,
      borderColor: colors.white,
    },
    hover: {
      background: colors.lightGray,
    },
    active: {
      boxShadow: `0 0 4px 1px ${colors.lightBlue}`,
      background: colors.lightGray,
    },
    disabled: {
      cursor: 'default',
      opacity: 0.8,
    },
  },
  alert: {
    default: {
      color: colors.white,
      background: colors.red,
      borderColor: colors.red,
    },
    hover: {
      background: colors.red,
    },
    active: {
      boxShadow: `0 0 4px 1px ${colors.plum}`,
    },
    disabled: {
      cursor: 'default',
      opacity: 0.8,
    },
  },
  none: {
    default: {
      color: 'currentColor',
      background: 'transparent',
      borderColor: 'transparent',
    },
    hover: {
      background: 'transparent',
    },
    active: {},
    disabled: {
      cursor: 'default',
      opacity: 0.8,
    },
  },
};

export const getVariantParams = (variant) => {
  const getVariantState = (state) => {
    const stateParams = variants?.[variant]?.[state] || {};
    return stateParams;
  };
  return getVariantState;
};

export const TButton = styled(ButtonMaterialUi)`
  &.tbutton {
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    font-size: ${({ fontSize }) => (fontSize ? getSizeInPx(fontSize) : '14px')};
    padding: ${({ just_icon }) => (just_icon === 'true' ? '0' : '0 10px')};
    font-weight: bold;
    cursor: pointer;
    text-transform: initial;
    transition: background 0.8s;
    width: ${({ width }) => (width ? calcCssSize(width) : 'auto')};
    height: ${({ size }) => (size ? sizes[size]?.height : 'auto')};
    min-width: ${({ size }) => (size ? sizes[size]?.minWidth : 'auto')};
    ${({ mdo_variant }) => getVariantParams(mdo_variant)('default')};
    &:disabled {
      ${({ mdo_variant }) => getVariantParams(mdo_variant)('disabled')}
    }
    &:hover {
      ${({ mdo_variant }) => getVariantParams(mdo_variant)('hover')}
    }
    &:active {
      ${({ mdo_variant }) => getVariantParams(mdo_variant)('active')} }
    &:focus {
      ${({ mdo_variant }) => getVariantParams(mdo_variant)('focus')} }
    }
    & > span > div + span {
      padding-left: 5px;
      padding-right: 5px;
    }
  }
`;
