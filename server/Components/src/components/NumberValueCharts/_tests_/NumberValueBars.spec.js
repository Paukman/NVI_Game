import React from 'react';
import { NumberValueBars } from '../NumberValueBars';

describe('Testing NumberValueBars', () => {
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

  it('should render NumberValueBars without errors', () => {
    render(<NumberValueBars id={'number-value'} data={data} />);
    expect(document.querySelector("div[id='number-value']")).toBeInTheDocument();
    expect(document.querySelector("div[id='number-value-Complimentary Rooms']")).toBeInTheDocument();
  });
});
