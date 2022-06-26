import { cleanup, render } from '@testing-library/react';
import { FilterStatusActiveInactive } from '../FilterStatusActiveInactive';
import React from 'react';

const props = {
    labelName: 'libraries',
    id: 'filterstatusactiveinactive-test-id',
    value: '',
};

describe('FilterStatusActiveInactive', () => {
    beforeEach(() => {
    cleanup();
    });
    
    it('should render without errors', () => {
    const mockedOnChange = jest.fn();
    render(<FilterStatusActiveInactive {...props} onChange={mockedOnChange} />);
    expect(document.querySelector('#filterstatusactiveinactive-test-id')).toBeDefined();
    });
    it('should call onChange when the dropdown is changed', () => {
        const mockedOnChange = jest.fn();
        const { container } = render(<FilterStatusActiveInactive {...props} onChange={mockedOnChange} />);
        expect(mockedOnChange).toHaveBeenCalledTimes(0);
        fireEvent.change(container.getElementsByTagName('input')[0], { target: { value: 'ACTIVE' } });
        jest.setTimeout(() => {
        expect(mockedOnChange).toHaveBeenCalledTimes(1);
        }, 600);
    });
    it('should have value', () => {
        const mockedOnChange = jest.fn();
        const props = {
            value: 'ACTIVE'
        }
        const { container } = render(<FilterStatusActiveInactive {...props} onChange={mockedOnChange} />);
        expect(container.getElementsByTagName('input')[0]).toHaveAttribute('value', 'ACTIVE');
    });
});
