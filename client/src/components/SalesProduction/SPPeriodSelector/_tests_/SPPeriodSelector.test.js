import { cleanup, render } from '@testing-library/react';
import { SPPeriodSelector } from '../SPPeriodSelector';
import React from 'react';

const props = {
  labelName: 'libraries',
  value: '',
  dataEl: 'selector-SPPeriod',
};

describe('SPPeriodSelector', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    const mockedOnChange = jest.fn();
    render(<SPPeriodSelector {...props} onChange={mockedOnChange} />);
    expect(document.querySelector(`[data-el="${props.dataEl}"]`)).toBeDefined();
  });
  it('should call onChange when the dropdown is changed', () => {
    const mockedOnChange = jest.fn();
    const { container } = render(<SPPeriodSelector {...props} onChange={mockedOnChange} />);
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
    fireEvent.change(container.getElementsByTagName('input')[0], { target: { value: 'MONTH' } });
    jest.setTimeout(() => {
      expect(mockedOnChange).toHaveBeenCalledTimes(1);
    }, 600);
  });
  it('should have value', () => {
    const mockedOnChange = jest.fn();
    const props = {
      value: 'MONTH',
    };
    const { container } = render(<SPPeriodSelector {...props} onChange={mockedOnChange} />);
    expect(container.getElementsByTagName('input')[0]).toHaveAttribute('value', 'MONTH');
  });
  it('should have dataEl', () => {
    const mockedOnChange = jest.fn();
    const { container } = render(<SPPeriodSelector {...props} onChange={mockedOnChange} />);
    expect(container.getElementsByClassName('MuiInputBase-root')[0]).toHaveAttribute('data-el', 'selector-SPPeriod');
  });
});
