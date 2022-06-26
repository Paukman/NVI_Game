import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { InputField } from '../../FormElements/InputField/InputField';
import { InputAdornment } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import { handleInputChange, createInputStandardAttrs } from '../../../utils/formHelpers';

const Search = forwardRef((props, ref) => {
  const { loading, placeholder, label, timeoutMs, value, title, dataEl, helperText, error } = props;
  const handleDebouncedChange = handleInputChange(props);
  const [state, setState] = useState('');
  const [timeoutId, setTimeoutId] = useState(0);

  useEffect(() => {
    setState(value);
  }, []); //  eslint-disable-line

  const handleChange = (name, value, event) => {
    setState(value);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(
      setTimeout(() => {
        handleDebouncedChange({ target: { value } });
      }, timeoutMs),
    );
  };

  const attrs = createInputStandardAttrs(props);

  return (
    <InputField
      label={label}
      onChange={handleChange}
      {...attrs}
      value={state}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>{loading ? <CircularProgress size={16} /> : <SearchIcon />}</InputAdornment>
        ),
      }}
      placeholder={placeholder}
      title={title}
      dataEl={dataEl}
      helperText={helperText}
      error={error}
    />
  );
});

Search.displayName = 'SearchInput';

Search.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  loading: PropTypes.bool,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  timeoutMs: PropTypes.number,
  value: PropTypes.string,
  title: PropTypes.string,
  dataEl: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
};

Search.defaultProps = {
  loading: false,
  timeoutMs: 250,
};

export { Search };
