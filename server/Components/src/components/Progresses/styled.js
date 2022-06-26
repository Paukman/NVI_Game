import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

export const progressMaterialUiStyles = makeStyles((theme) => ({
  colorCircularProgress: {
    color: (props) => props.colorBar,
  },
  colorLinearProgress: {
    backgroundColor: (props) => props.colorBar,
  },
}));

export const ProgressBox = styled.div`
    ${(props) =>
      props.type === 'circularProgress'
        ? `inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${props.doFit ? 100 : props.size}px;
        height: ${props.doFit ? 100 : props.size}px; `
        : `display: table;
        width: 100%;
        table-layout: fixed;
        border-spacing: 10px;`}
  `,
  TypographyBox = styled.div`
    ${(props) =>
      props.type === 'circularProgress'
        ? `inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${props.doFit ? 100 : props.size}px;
        height: ${props.doFit ? 100 : props.size}px; `
        : `display: table-cell;
        width: 30px;`}
  `,
  Typography = styled.div`
    font-weight: 400;
    line-height: 1.66;
    font-family: arial;
    font-size: ${(props) => (props.doFit || props.type === 'linearProgress' || props.size > 70 ? 14 : 10)}px;
  `;
