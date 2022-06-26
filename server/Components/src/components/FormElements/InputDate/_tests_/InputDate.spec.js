import React from 'react';
import { InputDate } from '../InputDate';

describe('Date Picker', () => {
  beforeEach(() => {
    cleanup();
  });
  it('renders date picker component', () => {
    const mockedOnChange = jest.fn();
    const { container } = render(<InputDate label='date picker' onChange={mockedOnChange} />);
    expect(container).toBeInTheDocument();
  });
  it('should render date picker with value prop', () => {
    const mockedOnChange = jest.fn();
    render(<InputDate label='date picker' value={'Sat May 15 2021 19:40:00 GMT+0530'} onChange={mockedOnChange} />);
    expect(document.getElementsByTagName('input')[0]).toHaveValue('05/15/2021');
  });
});
