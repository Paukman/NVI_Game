import React from 'react';
import { NumberValue } from '../NumberValue';

describe('Testing NumberValue', () => {
  beforeEach(() => {
    cleanup();
  });

  const data = [
    {
      label: 'Complimentary Rooms',
      value: 124,
      valueTypeId: undefined,
    },
  ];

  it('should render NumberValue without errors', () => {
    render(<NumberValue id={'number-value'} data={data} />);
    expect(document.querySelector("div[id='number-value']")).toBeInTheDocument();
  });
});
