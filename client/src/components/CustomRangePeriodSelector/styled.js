import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;

const PeriodStyling = styled.div`
  display: flex;
  height: ${({ periodHeight }) => periodHeight || '48px'};
  padding: ${({ paddingPeriod }) => paddingPeriod || '0px 8px 0px 0px'};
`;

const StartDateStyling = styled.div`
  display: flex;
  height: ${({ widthStartDate }) => widthStartDate || 'auto'};
  padding: ${({ paddingStartDate }) => paddingStartDate || '0px 8px 0px 8px'};
`;

const EndDateStyling = styled.div`
  display: flex;
  height: ${({ widthEndDate }) => widthEndDate || 'auto'};
  padding: ${({ paddingEndDate }) => paddingEndDate || '0px 0px 0px 8px'};
`;

export { Container, PeriodStyling, StartDateStyling, EndDateStyling };
