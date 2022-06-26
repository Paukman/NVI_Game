import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { StyledLabel } from './styled';
import { buildAttributes } from '../../../utils/formHelpers';

const Label = memo((props) => {
  const { children, toTheRight, label, fontSize, lineHeight, color, fontWeight } = props;
  const attrs = buildAttributes(props, ['id', 'dataEl']);
  return (
    <StyledLabel {...props} {...attrs}>
      <span>{label}</span>
      {children}
    </StyledLabel>
  );
});

Label.displayName = 'Label';

Label.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  toTheRight: PropTypes.bool,
  fontSize: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  lineHeight: PropTypes.number,
  fontWeight: PropTypes.string,
  color: PropTypes.string,
};

Label.defaultProps = {
  toTheRight: true,
};

export { Label };
