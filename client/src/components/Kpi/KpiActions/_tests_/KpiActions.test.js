import { cleanup, render, waitFor } from '@testing-library/react';
import { KpiActions } from '../KpiActions';
import React from 'react';

const props = {
  id: 'kpiactions-test-id',
  iconName: 'MoreVert',
};

describe('KpiActions', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    const mockedOnClick = jest.fn();
    render(<KpiActions {...props} onClick={mockedOnClick} />);
    expect(document.querySelector('.MuiButtonBase-root')).toBeDefined();
  });

  it('should call onClick when the first option is selected', async () => {
    const mockedOnClick = jest.fn();
    const { getByText } = render(<KpiActions {...props} onClick={mockedOnClick} />);
    const selectComponent = document.querySelector('.MuiButtonBase-root');
    expect(selectComponent).toBeDefined();
    expect(mockedOnClick).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => getByText('Make it Private'));
    fireEvent.click(getByText('Make it Private'));
    expect(mockedOnClick).toHaveBeenCalledTimes(1);
  });
});
