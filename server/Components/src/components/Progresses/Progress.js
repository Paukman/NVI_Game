import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { progressMaterialUiStyles, ProgressBox, Typography, TypographyBox } from './styled';

const Progress = memo((props) => {
  const classes = progressMaterialUiStyles(props);
  const { doFit, maxValue, showValue, size, type, value } = props;
  const [progress, setProgress] = React.useState(0);
  const percentage = (100 * value) / maxValue;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 100 : prevProgress + percentage >= 100 ? 100 : prevProgress + percentage,
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, [percentage]);

  const typeOfProgress = isNaN(Number(value)) ? 'indeterminate' : 'determinate';

  return (
    <ProgressBox {...props}>
      {type === 'circularProgress' ? (
        <CircularProgress
          size={doFit ? 100 : size}
          variant={typeOfProgress}
          value={progress}
          classes={{ colorPrimary: classes.colorCircularProgress }}
        />
      ) : (
        <LinearProgress
          classes={{
            root: classes.linear,
            colorPrimary: classes.colorLinearProgress,
          }}
          variant={typeOfProgress}
          value={progress}
        />
      )}
      {value && showValue && (
        <TypographyBox {...props}>
          <Typography {...props}>{`${Math.round(progress)}%`}</Typography>
        </TypographyBox>
      )}
    </ProgressBox>
  );
});

Progress.displayName = 'Progress';

Progress.types = ['linearProgress', 'circularProgress'];

Progress.propTypes = {
  colorBar: PropTypes.string,
  doFit: PropTypes.bool,
  maxValue: PropTypes.number,
  showValue: PropTypes.bool,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.oneOf(Progress.types).isRequired,
  value: PropTypes.number,
};

Progress.defaultProps = {
  type: Progress.types[0],
};

export default Progress;
