import { cleanup, render } from '@testing-library/react';
import { FilterPnLMdoGlCodes } from '../FilterPnLMdoGlCodes';
import React from 'react';

const props = {
  labelName: 'libraries',
  id: 'filterpnlmdoglcodes-test-id',
  value: '',
};

describe('FilterPnLMdoGlCodes', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    const mockedOnChange = jest.fn();
    render(<FilterPnLMdoGlCodes {...props} onChange={mockedOnChange} />);
    expect(document.querySelector('#FilterPnLMdoGlCodes-test-id')).toBeDefined();
  });
  it('should call onChange when the dropdown is changed', () => {
    const mockedOnChange = jest.fn();
    const { container } = render(<FilterPnLMdoGlCodes {...props} onChange={mockedOnChange} />);
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
    const { container } = render(<FilterPnLMdoGlCodes {...props} onChange={mockedOnChange} />);
    expect(container.getElementsByTagName('input')[0]).toHaveAttribute('value', 'POR');
  });
});
