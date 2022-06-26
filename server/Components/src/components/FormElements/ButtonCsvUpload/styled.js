import styled from 'styled-components';
import { colors } from '../../../theme/colors';

export const Zone = styled.div`
  border: 2px dashed #ccc;
  border-radius: 10;
  padding: 20px;
`;
export const PlaceHolderText = styled.div`
  display: flex;
  margin-right: 20px;
  color: #697177;
  font-weight: bold;
  .MuiSvgIcon-root {
    transform: rotate(20deg);
    margin-right: 15px;
  }
`;

export const File = styled.div`
  display: flex;
  width: 100%;
`;

export const FileName = styled.div`
  display: flex;
  margin-right: 10px;
  color: ${({ error }) => (error ? colors.red : colors.blue)};
  text-decoration: underline;
  .MuiSvgIcon-root {
    transform: rotate(20deg);
    margin-right: 15px;
  }
`;
