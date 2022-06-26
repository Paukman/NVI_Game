import React from 'react';
import { ExclamationIcon } from '../ExclamationIcon';

const data = ['6/15/2021', '5/30/2021', '5/29/2021'];

describe('ExclamationIcon', () => {
  beforeEach(() => {
    cleanup();
  });
  it('should render without errors', () => {
    const { container } = render(<ExclamationIcon data={data} titleText='Missing Dates' />);
    expect(container).toBeInTheDocument();
  });
});
