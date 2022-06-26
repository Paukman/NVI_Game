import React from 'react';
import { NoDataToShow } from '../NoDataToShow';

let props = {
  message: 'No Data',
};

describe('No Data To Show', () => {
  it('Renders NoDataToShow Component with Message', () => {
    render(<NoDataToShow {...props} />);
    expect(Screen.getByText('No Data')).toBeInTheDocument();
  });
});
