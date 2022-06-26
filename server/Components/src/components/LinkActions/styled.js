import styled from 'styled-components';
import { colors } from '../../theme/colors';
import { getSizeInPx } from '../../utils/propHelpers';

const getDisabled = (props) => {
  const { disabled } = props;

  return disabled
    ? {
        cursor: 'default',
        opacity: 0.6,
      }
    : {
        cursor: 'pointer',
      };
};

const getNoPadding = (props) => {
  const { noPadding } = props;
  return noPadding ? '0px' : '12px';
};

const getIconAlign = (props) => {
  const { iconAlign } = props;
  return iconAlign === 'right' ? { marginLeft: '5px' } : { marginRight: '5px' };
};

const Span = styled.span`
  display: flex;
  flex-direction: row;
`;

const LinkLabel = styled.span`
  color: ${(props) => (props.linkLabelFont?.color ? props.linkLabelFont?.color : colors.black)};
  text-decoration: ${(props) => (props.linkLabelFont?.textDecoration ? props.linkLabelFont?.textDecoration : 'none')};
  font-size: ${(props) =>
    props.linkLabelFont?.fontSize ? getSizeInPx(props.linkLabelFont?.fontSize) : '12px'} !important;
  line-height: ${(props) =>
    props.linkLabelFont?.lineHeight ? getSizeInPx(props.linkLabelFont?.lineHeight) : 'inherit'}!important;
  font-weight: ${(props) => (props.linkLabelFont?.fontWeight ? props.linkLabelFont?.fontWeight : 'normal')};
`;

const Wrap = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: stretch;

  &:first-child {
    a {
      border: none;
    }
  }
`;

const A = styled.a`
  ${getDisabled}
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: ${colors.blue};
  font-size: 12px;
  text-decoration: none;
  padding-left: ${getNoPadding};
  padding-right: ${getNoPadding};
  span {
    line-height: 1.2;
  }
`;

const IconWrap = styled.span`
  div {
    ${getIconAlign}
  }
  margin-left: ${(props) => (props?.marginLeft ? getSizeInPx(props?.marginLeft) : '')};
  margin-right: ${(props) => (props?.marginRight ? getSizeInPx(props?.marginRight) : '')};
`;

export { Span, A, Wrap, IconWrap, LinkLabel };
