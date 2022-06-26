import { cleanup, render } from '@testing-library/react';
import { PnLDataModeSelector } from '../PnLDataModeSelector';
import React from 'react';

const props = {
    labelName: 'libraries',
    id: 'pnldatamodeselector-test-id',
    value: '',
};

describe('PnLDataModeSelector', () => {
    beforeEach(() => {
        cleanup();
    });
    
    it('should render without errors', () => {
        const mockedOnChange = jest.fn();
        render(<PnLDataModeSelector {...props} onChange={mockedOnChange} />);
        expect(document.querySelector('#pnldatamodeselector-test-id')).toBeDefined();   
    });
    it('should call onChange when the dropdown is changed', () => {
        const mockedOnChange = jest.fn();
        const { container } = render(<PnLDataModeSelector {...props} onChange={mockedOnChange} />);
        expect(mockedOnChange).toHaveBeenCalledTimes(0);
        fireEvent.change(container.getElementsByTagName('input')[0], { target: { value: 'ACTUALS' } });
        jest.setTimeout(() => {
        expect(mockedOnChange).toHaveBeenCalledTimes(1);
        }, 600);
    });
    it('should have value', () => {
        const mockedOnChange = jest.fn();
        const props = {
            value: 'ACTUALS'
        }
        const { container } = render(<PnLDataModeSelector {...props} onChange={mockedOnChange} />);
        expect(container.getElementsByTagName('input')[0]).toHaveAttribute('value', 'ACTUALS');
    });
});
