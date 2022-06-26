import React from 'react';
import { Label } from '../Label';

let props = {
  label: 'Label Text',
  toTheRight: false,
};

describe('Label', () => {
  it('Check label text applied to Label', () => {
    render(<Label {...props} />);
    expect(Screen.getByText('Label Text')).toBeInTheDocument();
  });
});
