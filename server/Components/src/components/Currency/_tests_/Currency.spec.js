import React from 'react';
import { Currency } from '../Currency';
const props = { value: 203.123, decimalPoints: 2 };
describe('Currency', () => {
  it('should render number', async () => {
    render(<Currency value={props.value} id={'currency'} />);
    const result = parseFloat(document.querySelector('#currency').innerHTML.replace('$', ''));
    expect(result).not.toBeNaN();
  });

  it('should render float number with given decimal placeses', async () => {
    render(<Currency value={props.value} id={'currency'} />);
    const result = parseFloat(document.querySelector('#currency').innerHTML.replace('$', ''));
    expect(props.value).toBeCloseTo(result, props.decimalPoints);
  });

  it('should render N/A for empty value', async () => {
    render(<Currency value={null} id={'currency'} />);
    const result = document.querySelector('#currency').innerHTML;
    expect(result).toBe('N/A');
  });
});
