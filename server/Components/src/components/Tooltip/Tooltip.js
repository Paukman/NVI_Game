import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip as MaterialUiTooltip, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';

const Tooltip = memo((props) => {
  const {
    title,
    arrow,
    placement,
    classes,
    children,
    html,
    iconName,
    maxWidth,
    backgroundColor,
    fontColor,
    fontWeight,
    padding,
    border,
    borderRadius,
    boxShadow,
    fontSize,
  } = props;

  const HtmlTooltip = withStyles(() => ({
    tooltip: {
      backgroundColor,
      color: fontColor,
      fontWeight,
      maxWidth,
      padding,
      border,
      borderRadius,
      boxShadow,
      fontSize,
    },
  }))(MaterialUiTooltip);

  return (
    <>
      {!html ? (
        <MaterialUiTooltip classes={classes} title={title} arrow={arrow} placement={placement}>
          {children}
        </MaterialUiTooltip>
      ) : (
        <HtmlTooltip title={title}>
          <IconButton style={{ padding: '0' }}>
            <Icon name={iconName} size='small' />
          </IconButton>
        </HtmlTooltip>
      )}
    </>
  );
});
Tooltip.displayName = 'Tooltip';

Tooltip.placements = ['bottom', 'bottom-end', 'left', 'left-end', 'right', 'right-end', 'top'];

Tooltip.propTypes = {
  title: PropTypes.string,
  arrow: PropTypes.bool,
  placement: PropTypes.oneOf(Tooltip.placements),
  classes: PropTypes.any,
  children: PropTypes.node,
  html: PropTypes.bool,
  iconName: PropTypes.string,
  backgroundColor: PropTypes.string,
  fontColor: PropTypes.string,
  maxWidth: PropTypes.number,
  padding: PropTypes.string,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.string,
  border: PropTypes.string,
  borderRadius: PropTypes.string,
  boxShadow: PropTypes.string,
};

Tooltip.defaultProps = {
  html: false,
  iconName: 'MissingDates',
  maxWidth: 220,
  backgroundColor: colors.white,
  fontColor: colors.black,
  fontWeight: 'normal',
  fontSize: '14px',
  padding: '17.5px 17px 19.5px 21.3px',
  border: `1px solid ${colors.lightGrey}`,
  borderRadius: '10px',
  boxShadow: `0 0 8px 0 ${colors.iconGrey}`,
};
export { Tooltip };
