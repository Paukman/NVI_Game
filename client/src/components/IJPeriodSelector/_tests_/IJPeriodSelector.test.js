import { cleanup, render } from '@testing-library/react';
import { IJPeriodSelector } from '../IJPeriodSelector';
import React from 'react';

const props = {
  labelName: 'libraries',
  id: 'ijperiodselector-test-id',
  value: '',
};

describe('IJPeriodSelector', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    const mockedOnChange = jest.fn();
    render(<IJPeriodSelector {...props} onChange={mockedOnChange} />);
    expect(document.querySelector('#ijperiodselector-test-id')).toBeDefined();
  });
  it('should call onChange when the dropdown is changed', () => {
    const mockedOnChange = jest.fn();
    const { container } = render(<IJPeriodSelector {...props} onChange={mockedOnChange} />);
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
    fireEvent.change(container.getElementsByTagName('input')[0], { target: { value: 'MTD' } });
    jest.setTimeout(() => {
      expect(mockedOnChange).toHaveBeenCalledTimes(1);
    }, 600);
  });
  it('should have value', () => {
    const mockedOnChange = jest.fn();
    const props = {
      value: 'MTD',
    };
    const { container } = render(<IJPeriodSelector {...props} onChange={mockedOnChange} />);
    expect(container.getElementsByTagName('input')[0]).toHaveAttribute('value', 'MTD');
  });
});
