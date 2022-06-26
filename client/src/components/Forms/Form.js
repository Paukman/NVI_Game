import styled from 'styled-components';
import PropTypes from 'prop-types';

const Form = styled.form`
  border: none;
  margin: 0 0 30px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: ${({ fullHeight }) => (fullHeight ? '100%' : 'auto')};

  & > * {
    margin-bottom: 10px !important;
    box-sizing: border-box;
  }
`;

Form.displayName = 'Form';

Form.propTypes = {
  fullHeight: PropTypes.bool,
};

export { Form };
