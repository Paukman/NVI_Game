import styled from 'styled-components';

const FilterContainer = styled.div`
  width: 100%;
  min-width: 320px;
  max-width: 100%;
  flex: 1 1;
  background-color: #fff;
  color: #000;
  padding: 20px;
  box-sizing: border-box;

  & > * {
    box-sizing: border-box;
  }
`;

FilterContainer.displayName = 'FilterContainer';

export { FilterContainer };
