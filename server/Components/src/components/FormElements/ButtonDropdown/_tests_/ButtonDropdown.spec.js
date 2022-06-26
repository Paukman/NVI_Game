import React from 'react';
import { ButtonDropdown } from '../ButtonDropdown';

const props = {
  text: 'ButtonDropdown',
  items: [
    { label: 'Email', icon: 'search' },
    { label: 'Inbox', icon: 'search' },
  ],
  iconName: 'ExpandMoreOutlined',
};

describe('ButtonDropdown', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    const mockedOnClick = jest.fn();
    render(<ButtonDropdown {...props} onClick={mockedOnClick} />);
    expect(document.querySelector('.MuiButtonBase-root')).toBeDefined();
  });

  it('should call onClick when the first option is selected', async () => {
    const mockedOnClick = jest.fn();
    const { getByText } = render(<ButtonDropdown {...props} onClick={mockedOnClick} />);
    const selectComponent = document.querySelector('.MuiButtonBase-root');
    expect(selectComponent).toBeDefined();
    expect(mockedOnClick).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => getByText('Email'));
    fireEvent.click(getByText('Email'));
    expect(mockedOnClick).toHaveBeenCalledTimes(1);
  });
  it('should call onClick when the first option is selected then second option', async () => {
    const mockedOnClick = jest.fn();
    const { getByText } = render(<ButtonDropdown {...props} onClick={mockedOnClick} />);
    const selectComponent = document.querySelector('.MuiButtonBase-root');
    expect(selectComponent).toBeDefined();
    expect(mockedOnClick).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => getByText('Email'));
    fireEvent.click(getByText('Email'));
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => getByText('Inbox'));
    fireEvent.click(getByText('Inbox'));

    expect(mockedOnClick).toHaveBeenCalledTimes(2);
  });
});
