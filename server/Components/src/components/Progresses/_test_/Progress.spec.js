import React from 'react';
import Progress from '../Progress';

describe('CircularProgress component', () => {
  let nodelist;
  it('Renders CircularProgress with value', () => {
    const props = {
      value: 20,
      maxValue: 200,
      colorBar: 'red',
      doFit: false,
      showValue: true,
      size: 40,
    };
    const { getByText } = render(<Progress {...props} />);
    expect(getByText(/0%/i)).toBeInTheDocument();
  });

  it('Renders CircularProgress without value', () => {
    const props = {
      value: undefined,
      maxValue: 200,
      colorBar: 'red',
      doFit: false,
      showValue: true,
      size: 40,
    };
    const { queryByText } = render(<Progress {...props} />);
    expect(queryByText(/0%/i)).not.toBeInTheDocument();
  });
});
