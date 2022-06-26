import React from 'react';
import PropTypes from 'prop-types';
import { DictionaryContext } from '../contexts';
import { useDictionary } from '../graphql';

const DictionaryProvider = (props) => {
  const { children } = props;
  const hooks = useDictionary();

  return <DictionaryContext.Provider value={hooks}>{children}</DictionaryContext.Provider>;
};

DictionaryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DictionaryProvider };
