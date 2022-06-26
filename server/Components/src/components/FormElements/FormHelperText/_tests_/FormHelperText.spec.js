import React from 'react';
import { FormHelperText } from '../FormHelperText';

let props = {
  children: 'This is FormHelperText',
  error: false,
  disabled: false,
  filled: false,
  focused: false,
  margin: 'dense',
  required: false,
  variant: FormHelperText.variants[0],
};

describe('FormHelperText', () => {
  it('Render FormHelperText', () => {
    render(<FormHelperText {...props} />);
    expect(Screen.getByText(props.children)).toBeInTheDocument();
  });
});
