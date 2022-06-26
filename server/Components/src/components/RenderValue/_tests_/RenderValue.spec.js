import React from 'react';
import { RenderValue } from '../index';

describe('Testing RenderValue component', () => {
  it('Renders RenderValue', () => {
    const props = {
      value: 100,
    };
    render(<RenderValue {...props} />);
    expect(Screen.getByText('100')).toBeInTheDocument();
  });
});
