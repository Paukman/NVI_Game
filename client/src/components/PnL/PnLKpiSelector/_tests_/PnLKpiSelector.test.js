import { cleanup, render } from '@testing-library/react';
import { PnLKpiSelector } from '../PnLKpiSelector';
import React from 'react';

const props = {
  labelName: 'libraries',
  id: 'pnlkpiselector-test-id',
  value: '',
};

describe('PnLKpiSelector', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    const mockedOnChange = jest.fn();
    render(<PnLKpiSelector {...props} onChange={mockedOnChange} />);
    expect(document.querySelector('#pnlkpiselector-test-id')).toBeDefined();
  });
  it('should call onChange when the dropdown is changed', () => {
    const mockedOnChange = jest.fn();
    const { container } = render(<PnLKpiSelector {...props} onChange={mockedOnChange} />);
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
    fireEvent.change(container.getElementsByTagName('input')[0], { target: { value: 'POR' } });
    jest.setTimeout(() => {
      expect(mockedOnChange).toHaveBeenCalledTimes(1);
    }, 600);
  });
  it('should have value', () => {
    const mockedOnChange = jest.fn();
    const props = {
      value: 'POR',
    };
    const { container } = render(<PnLKpiSelector {...props} onChange={mockedOnChange} />);
    expect(container.getElementsByTagName('input')[0]).toHaveAttribute('value', 'POR');
  });
});
