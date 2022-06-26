import styled from 'styled-components';
import PropTypes from 'prop-types';

const FormBlock = styled.div`
  width: 100%;
  flex: ${({ stretch }) => (stretch ? '1 1' : '0 0')};
`;

FormBlock.displayName = 'FormBlock';

FormBlock.propTypes = {
  stretch: PropTypes.bool,
};

export { FormBlock };
