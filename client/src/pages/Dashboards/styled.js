import styled from 'styled-components';

export const StyledDragDropList = styled.div`
  white-space: pre-line;
`;

export const StyledList = styled.div`
  margin: 0 auto;
  width: 530px;
`;

export const StyledButton = styled.div`
  width: 100%;
  margin: 30px 0;
  text-align: center;
`;

export const DashboardComment = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-item: center;
`;

export const CommentContainer = styled.div`
  display: flex;
  width: ${({ width }) => (width ? `${width}px` : `650px`)};
  opacity: ${({ obsoleteData }) => (obsoleteData ? 0.4 : 1)};
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  height: 70vh;
  overflow: auto;
`;
