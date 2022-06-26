import React from 'react';
import { RadioGroup } from '../RadioGroup';

const buttonsCfg = [
  { value: 'amountType', label: 'Amount Type' },
  { value: 'kpi', label: 'KPI' },
];

describe('RadioGroup', () => {
  beforeEach(() => {
    cleanup();
  });

  const data = [
    { value: 'amountType', label: 'Amount Type' },
    { value: 'kpi', label: 'KPI' },
  ];

  it('should render without errors', () => {
    const { getByRole } = render(<RadioGroup />);
    expect(Screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('should render with props', () => {
    const { getByRole } = render(<RadioGroup row={true} />);
    expect(document.querySelector('div.MuiFormGroup-row')).toBeDefined();
  });
  it('should render provided configuration', () => {
    const { getByText } = render(<RadioGroup buttonsCfg={buttonsCfg} />);
    expect(getByText('Amount Type')).toBeInTheDocument();
    expect(getByText('KPI')).toBeInTheDocument();
  });
  it('should call onChange', () => {
    const onChange = jest.fn();
    const { getByText } = render(<RadioGroup name='myName' buttonsCfg={buttonsCfg} onChange={onChange} />);
    fireEvent.click(Screen.getByText('Amount Type'));
    expect(onChange).toHaveBeenCalledWith('myName', 'amountType', expect.any(Object));
    fireEvent.click(Screen.getByText('KPI'));
    expect(onChange).toHaveBeenCalledWith('myName', 'kpi', expect.any(Object));
  });
});
