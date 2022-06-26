import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const FormState = memo((props) => {
  const { data, onSubmit, onChange, children } = props;

  const [state, setState] = useState(data);

  const handleChange = (name, value) => {
    const newstate = { ...state, [name]: value };
    setState(newstate);

    if (typeof onChange === 'function') {
      onChange({ data: state, name, value });
    }
  };

  const handleSubmit = (event) => {
    event && event.preventDefault();
    if (typeof onSubmit === 'function') {
      onSubmit(state);
    }
  };

  useEffect(() => {
    setState(data);
  }, [data]);

  // The following calls a function and tries to render whatever the function returns.
  return children({ data: state, handleChange, submit: handleSubmit });
});

FormState.displayName = 'FormState';

FormState.propTypes = {
  data: PropTypes.shape(),
  currentValue: PropTypes.shape(),
  children: PropTypes.func,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
};

export { FormState };
