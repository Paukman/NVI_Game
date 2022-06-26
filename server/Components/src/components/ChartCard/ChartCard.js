import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '../Typography/Typography';
import { CardTitleDiv, ChartDiv } from './styled';

const ChartCard = memo((props) => {
  const {
    title,
    height,
    width,
    elevation,
    children,
    titleMargin,
    titleColor,
    titleFontSize,
    titleFontWeight,
    backgroundColor,
    chartBorderColor,
    chartPadding,
  } = props;

  return (
    <ChartDiv
      height={height}
      width={width}
      elevation={elevation}
      backgroundColor={backgroundColor}
      chartBorderColor={chartBorderColor}
      chartPadding={chartPadding}
    >
      {title && (
        <CardTitleDiv
          titleMargin={titleMargin}
          titleColor={titleColor}
          titleFontSize={titleFontSize}
          titleFontWeight={titleFontWeight}
        >
          <Typography variant='h5'>{title}</Typography>
        </CardTitleDiv>
      )}
      {children}
    </ChartDiv>
  );
});

ChartCard.displayName = 'ChartCard';

ChartCard.elevations = [0, 1];

ChartCard.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  elevation: PropTypes.oneOf(ChartCard.elevations),
  titleMargin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  titleColor: PropTypes.string,
  titleFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  titleFontWeight: PropTypes.string,
  backgroundColor: PropTypes.string,
  chartBorderColor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chartPadding: PropTypes.string,
};

ChartCard.defaultProps = {
  width: '100%',
  height: '100%',
  elevation: 0,
};

export { ChartCard };
