import React from 'react';
import { ButtonDownloadAs } from '../ButtonDownloadAs';

const props = {
  text: 'Download',
  items: [
    { label: 'CSV', value: 'csv', icon: '' },
    { label: 'Excel', value: 'excel', icon: '' },
    { label: 'PDF', value: 'pdf', icon: '' },
  ],
  iconName: 'ExpandMoreOutlined',
  exclude: ['pdf'],
};
if (Array.isArray(props.exclude)) {
  props.items = props.items.filter((e) => props.exclude.indexOf(e.value) === -1);
}
describe('ButtonDropdown', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    const mockedOnClick = jest.fn();
    render(<ButtonDownloadAs {...props} onClick={mockedOnClick} items={props.items} />);
    expect(document.querySelector('.MuiButtonBase-root')).toBeDefined();
  });

  it('should call onClick when the first option is selected', async () => {
    const mockedOnClick = jest.fn();
    const { getByText } = render(<ButtonDownloadAs {...props} onClick={mockedOnClick} items={props.items} />);
    const selectComponent = document.querySelector('.MuiButtonBase-root');
    expect(selectComponent).toBeDefined();
    expect(mockedOnClick).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => getByText('CSV'));
    fireEvent.click(getByText('CSV'));
    expect(mockedOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when the first option is selected then second option', async () => {
    const mockedOnClick = jest.fn();
    const { getByText } = render(<ButtonDownloadAs {...props} onClick={mockedOnClick} items={props.items} />);
    const selectComponent = document.querySelector('.MuiButtonBase-root');
    expect(selectComponent).toBeDefined();
    expect(mockedOnClick).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => getByText('CSV'));
    fireEvent.click(getByText('CSV'));
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => getByText('Excel'));
    fireEvent.click(getByText('Excel'));

    expect(mockedOnClick).toHaveBeenCalledTimes(2);
  });
});
