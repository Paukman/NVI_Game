import styled, { css } from 'styled-components';

const calcSize = ({ size }) => {
  const sizeStr = !isNaN(size) ? `${size || 0}px` : size;

  const sizeCss = {
    width: sizeStr,
    height: sizeStr,
  };

  return sizeCss;
};

const calcColor = (props) => {
  const { local, color } = props;

  return {
    stroke: local == 1 ? color : 'transparent',
    fill: color || 'currentColor',
  };
};

const Wrapper = styled.div.attrs((props) => ({
  style: calcSize(props),
}))`
  & > svg {
    display: 'block';
    width: 100%;
    height: 100%;
    opacity: ${({ disabled, hidden }) => (disabled ? '0.6' : hidden ? '0' : '1')};
    ${calcColor}
  }
`;

export { Wrapper };
