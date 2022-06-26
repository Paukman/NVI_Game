import { toNumber } from 'lodash';
import styled from 'styled-components';
import { colors, Label } from 'mdo-react-components';
import { HEIGHT_STEP } from './constants';

export const Content = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const PeriodLabel = styled.span`
  color: rgba(0, 0, 0, 0.54);
  font-size: 12px;
  font-family: Open Sans;
  font-weight: 400;
`;

export const Widgets = styled.div`
  display: flex;
  flex-direction: row;
  align-items: ${({ centered }) => (centered ? 'center' : 'flex-start')};
  height: ${({ centered }) => (centered ? '100%' : 'auto')};
  flex-wrap: wrap;
`;

export const ButtonWithoutStyle = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

export const calcHeight = ({ height }) => {
  const height2use = toNumber(height);

  if (height == null || isNaN(height)) {
    return `${HEIGHT_STEP}px`;
  } else if (height2use === 0) {
    return 'auto';
  }

  return `${height2use * HEIGHT_STEP}px`;
};

export const WidgetWrapper = styled.div`
  box-sizing: border-box;
  padding: 10px;
  width: ${({ width }) => width || '100%'};
  height: ${(props) => calcHeight(props)};
`;

export const NegativeNumberStyle = styled.div`
  white-space: pre;
  color: ${({ negativeColor }) => (negativeColor ? `${colors.red}` : '')};
`;

export const MessageCloudStyling = styled.div`
  height: 260px;
`;

export const AddCommentContainer = styled.div`
  width: 600px;
  padding-left: 30px;
  padding-right: 32px;
`;

export const SingleCommentContainer = styled.div`
  width: 600px;
  padding-left: 10px;
  padding-right: 10px;
  white-space: pre-line;
`;

export const ViewAllCommentContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
`;

export const ReplyMessageStyling = styled.div`
  margin: 0px 0px 20px 0px;
`;

export const AllCommentReplyMessageStyling = styled.div`
  display: flex;
  align-items: baseline;

  & InputField {
    padding: 8px;
    margin-right: 15px;
    height: 35px;
  }
`;

export const ButtonLinkStyling = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: -20px 0px 20px 0px;
`;

export const ParentComment = styled.div``;

export const CommentHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 16px;
`;

export const AllCommentHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 6px;
`;

export const ReplyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;

  & span {
    font-size: 12px;
  }

  & Label {
    & span {
      font-size: 14px;
      font-weight: 600;
    }
  }
`;

export const Heading = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 16px;

  & span {
    font-weight: 600;
    font-size: 12px;
  }

  & label {
    font-weight: 600;
    font-size: 20px;
  }
`;

export const Username = styled.div`
  font-weight: 600;
  color: ${colors.widgetsPlum};
  font-size: 16px;
  padding-top: 0;
`;

export const Description = styled.div`
  display: flex;
  flex-wrap: nowrap;
  color: ${colors.mediumGray};
  font-size: 14px;
  font-weight: 500;
  padding-top: 10px;

  & span {
    color: ${colors.black};
    font-weight: 500;
  }
  & label {
    color: ${colors.black};
    font-weight: 500;
    display: block;
  }
`;

export const Comment = styled.div`
  padding-top: 15px;
  font-weight: 600;
  font-size: 16px;
`;

export const ReplyLabel = styled.div`
  display: flex;
  align-items: flex-end;
  direction: row;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: 600;

  & label {
    margin-right: 10px;
  }
`;

export const ReplyContent = styled.div`
  display: flex;
  flex-direction: column;
`;
export const ReplyBody = styled.div`
  overflow-wrap: break-word;
`;
export const Kpi = styled.div`
  color: ${colors.mediumGray};
  font-size: 14px;
  display: inline-block;
`;

export const LineBetweenReply = styled.hr`
  width: 100%;
  border-top: 1px solid ${colors.grey};
  margin-top: 14px;
  margin-bottom: 14px;
`;

export const PeriodStyling = styled.div`
  display: flex;
  height: ${({ periodHeight }) => periodHeight || '48px'};
  padding: ${({ paddingPeriod }) => paddingPeriod || '0px 8px 0px 0px'};
`;

export const StartDateStyling = styled.div`
  display: flex;
  height: ${({ widthStartDate }) => widthStartDate || 'auto'};
  padding: ${({ paddingStartDate }) => paddingStartDate || '0px 8px 0px 8px'};
`;

export const EndDateStyling = styled.div`
  display: flex;
  height: ${({ widthEndDate }) => widthEndDate || 'auto'};
  padding: ${({ paddingEndDate }) => paddingEndDate || '0px 0px 0px 8px'};
`;

export const TopHeader = styled.div`
  margin-bottom: 22px;
  font-size: 16px;
  font-weight: bold;
  padding: 0;
  color: ${colors.black};
`;

export const SubHeader = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-top: 11px;
  margin-bottom: 4px;
  padding: 0;
  color: ${colors.black};
`;

export const MissingContent = styled.div`
  font-size: 14px;
  font-weight: normal;
  padding: 0;
  margin-bottom: 4px;
  color: ${colors.black};
  text-transform: uppercase;
`;


export const MissingIcon = styled.div`
  padding-top: 5px;
  cursor: pointer;
`;

export const MissingIconClose = styled.div`
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
    position: absolute;
    right: 15px;
    top: 15px;
  }
`;
