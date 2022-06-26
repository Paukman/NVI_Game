import styled from 'styled-components';

export const Container = styled.div.attrs((props) => {
  const { margin, padding } = props;
  return {
    style: {
      margin: margin,
      padding: padding,
    },
  };
})``;
