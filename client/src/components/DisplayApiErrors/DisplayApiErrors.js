import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Container } from './styled';

const DisplayApiErrors = memo((props) => {
  const { errors, dataEl, genericOnlyErrors, customError } = props || {};
  let msgToShow = '';

  if (!Array.isArray(errors)) {
    console.error(`The DisplayApiErrors component expected 'errors' prop to be an array but got`, errors);
  } else if (errors.length === 0) {
    return null;
  } else {
    msgToShow = errors
      .reduce((acc, error) => {
        if (genericOnlyErrors && error.name !== '') {
          return acc;
        }

        if (Array.isArray(error.messages)) {
          acc.push(...error.messages);
        }
        return acc;
      }, [])
      .join('. ');
  }

  if (!msgToShow && !genericOnlyErrors) {
    msgToShow = 'Oops! Something went wrong. Please try later';
  }

  if (customError) {
    msgToShow = customError;
  }

  return <Container data-el={dataEl}>{msgToShow}</Container>;
});

DisplayApiErrors.displayName = 'DisplayApiErrors';

DisplayApiErrors.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      messages: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  dataEl: PropTypes.string,
  genericOnlyErrors: PropTypes.bool,
};

DisplayApiErrors.defaultProps = {
  dataEl: 'displayApiErrors',
  genericOnlyErrors: false,
};

export { DisplayApiErrors };
