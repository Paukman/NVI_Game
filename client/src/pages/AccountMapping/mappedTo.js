import React from 'react';
import PropTypes from 'prop-types';
import { DictionaryValue } from '../../components/Dictionary';

const MappedTo = ({ value, dataRow }) => {
  return <DictionaryValue dictionaryType={'hotel-client-account-management-status'} value={value} />;
};

MappedTo.propTypes = {
  value: PropTypes.any,
  dataRow: PropTypes.any,
};

MappedTo.displayName = 'MappedTo';

export { MappedTo };
