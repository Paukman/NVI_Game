import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * The only purpose of this component is to redirect page to another url.
 * @param {object} props
 * @returns
 */
const Redirect = (props) => {
  const { options } = (props || {}).page || {};
  const { url } = options;

  const history = useHistory();

  useEffect(() => {
    if (url && url.startsWith('http')) {
      window.location.href = url;
    } else if (url) {
      history.push(url);
    } else {
      console.warn('There is no redirect URL provided for this page');
    }
  });

  return null;
};

Redirect.displayName = 'Redirect';

Redirect.propTypes = {
  url: PropTypes.string,
};

export { Redirect };
