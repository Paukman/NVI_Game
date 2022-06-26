import { cleanup, render, waitFor } from '@testing-library/react';
import { IJActions } from '../IJActions';
import React from 'react';

const props = {
  id: 'ijactions-test-id',
  iconName: 'MoreVert',
};

describe('IJActions', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    const mockedOnClick = jest.fn();
    render(<IJActions {...props} onClick={mockedOnClick} />);
    expect(document.querySelector('.MuiButtonBase-root')).toBeDefined();
  });

  it('should call onClick when the first option is selected', async () => {
    const mockedOnClick = jest.fn();
    const { getByText } = render(<IJActions {...props} onClick={mockedOnClick} />);
    const selectComponent = document.querySelector('.MuiButtonBase-root');
    expect(selectComponent).toBeDefined();
    expect(mockedOnClick).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => getByText('Add Row'));
    fireEvent.click(getByText('Add Row'));
    expect(mockedOnClick).toHaveBeenCalledTimes(1);
  });
});
