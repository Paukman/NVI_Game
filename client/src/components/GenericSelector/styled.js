import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-width: 50px;
  width: 100%;

  & > * {
    margin-right: 16px;
  }

  & > *:last-of-type {
    margin-right: 0;
  }
`;

const caluculateWidth = (width) => {
  if (typeof width === 'number') {
    return `${width}px`;
  } else {
    let res = 'inherit';
    switch (width) {
      case `default`:
      default:
        break;
      case 'small':
        res = '150px';
        break;
      case 'normal':
        res = '250px';
        break;
      case 'large':
        res = '400px';
        break;
    }
    return res;
  }
};

export const GenericItem = styled.div`
  width: ${({ width }) => (width ? caluculateWidth(width) : 'inherit')};
`;
