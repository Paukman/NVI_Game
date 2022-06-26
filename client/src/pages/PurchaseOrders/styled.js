import styled from 'styled-components';

export const colors = {
  darkGrey: '#2E2E2E',
  linkBlue: '#3B6CB4',
  addressFormColor: '#697177',
};

export const POCardHeaderStyle = styled.div`
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 20px;
`;

export const POAddressPlaceholderStyle = styled.div`
  color: #cad3da;
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const TextStyle = styled.div.attrs((props) => {
  const { fontSize, fontWeight, textAlign, lineHeight, color } = props;
  return {
    style: {
      fontSize: fontSize || 'inherit',
      fontWeight: fontWeight || 'inherit',
      textAlign: textAlign || 'inherit',
      lineHeight: lineHeight || 'inherit',
      color: color || 'inherit',
    },
  };
})``;

export const ShippingAddressStyle = styled.div`
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const TextSize12Bold = styled.div`
  font-size: 12px;
  font-weight: bold;
`;

export const ItemIndexStyle = styled.div`
  text-align: left;
  padding-top: 10px;
`;

export const ViewContainer = styled.div.attrs((props) => {
  const { showReceivedAlert } = props;
  return {
    style: {
      backgroundImage: showReceivedAlert ? `url("/received_alert.svg")` : 'none',
    },
  };
})`
  box-shadow: 0px 1px 12px #0000004a;
  width: 834px;
  height: 100%;
  box-sizing: border-box;
  color: #2e2e2e;
  font-size: 12px;
  line-height: 20px;
  background-repeat: no-repeat;
  background-position: top right;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

export const ViewButtonContainer = styled.div`
  margin: 15px 0 15px;
  width: 834px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

export const ReceiveDescription = styled.div`
  display: flex;
  align-items: center;
`;

export const EditFooterHeight = styled.div`
  height: 75px;
`;

export const PreWrap = styled.div`
  white-space: pre-wrap;
`;

export const AddressesDrawer = styled.div`
  width: 330px;
`;
