import styled from 'styled-components';
import { colors } from 'mdo-react-components';

export const HeaderFooter = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  padding: 0;
`;

export const NameColumn = styled.div`
  font-weight: ${(props) => (props.topLevelHeaders ? 700 : props.subLevelHeaders ? 500 : 300)};
  text-transform: ${(props) => (props.topLevelHeaders ? 'uppercase' : 'capitalize')};
  display: inline-block;
  margin-left: ${(props) =>
    props.isMappingSummary ? (props.subLevelHeaders ? (!props.hasChildren ? '25px' : '0') : '12px') : '0'};
`;

export const StyledCellRenderer = styled.div.attrs((props) => {
  // TODO: It seems to be used by other pages which is wrong. Refactor this component to
  const { location, topLevelHeaders, subLevelHeaders, bold } = props;
  let fontWeight = 300;

  if (topLevelHeaders || subLevelHeaders) {
    fontWeight = 500;
  } else if (bold) {
    fontWeight = 600;
  }

  return location === 'ar-aging' ? {} : { style: { fontWeight } };
})``;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

  & > * {
    margin-right: 10px !important;
  }
`;

export const FiltersContainer = styled.div`
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

export const FilterTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 30px 0;
`;

export const Form = styled.form`
  border: none;
  margin: 0 0 30px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & > * {
    margin-bottom: 10px !important;
    box-sizing: border-box;
  }
`;

export const SectionHeader = styled.div`
  font-weight: bold;
`;

export const ViewItemInner = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ section }) => (section ? `24px` : `0px`)};
  line-height: 38px;
  width: 85%;
  font-size: ${({ section }) => (section ? `14px` : `12px`)};
  font-weight: ${({ section, defaultViewId }) => (section || defaultViewId ? `bold` : `normal`)};
  border-bottom: ${({ section }) => (section ? `4px solid ${colors.grey}` : `1px solid ${colors.grey}`)};
  color: ${({ section }) => (section ? colors.darkBlue : '')};
`;

export const ViewItemOuter = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

export const ViewText = styled.div`
  white-space: break-spaces;
  line-height: ${({ singleLine }) => (singleLine ? '22px' : '38px')};
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${({ formPlacement }) => (formPlacement === 'right' ? 'auto' : '')};
  margin-right: ${({ formPlacement }) => (formPlacement === 'left' ? 'auto' : '')};
  margin: ${({ formPlacement }) => (formPlacement === 'center' ? 'auto' : '')};
  max-width: 400px;
  justify-content: center;
  align-content: center;
`;
