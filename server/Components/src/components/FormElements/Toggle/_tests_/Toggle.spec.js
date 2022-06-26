import React from 'react';
import Toggle from '../Toggle';

describe('Toggle Component', () => {
  beforeEach(() => {
    cleanup();
  });
  it('should render without errors', () => {
    const mockedOnChange = jest.fn();
    render(
      <Toggle onChange={mockedOnChange}>
        <p style={{ margin: 0 }}>React</p>
        <p style={{ margin: 0 }}>Redux</p>
        <p style={{ margin: 0 }}>Node</p>
      </Toggle>,
    );
    expect(Screen.getByRole('group')).toBeInTheDocument();
  });
  it('selects a toggle element & renders the selected element', () => {
    const mockedOnChange = jest.fn();
    render(
      <Toggle onChange={mockedOnChange}>
        <p style={{ margin: 0 }}>React</p>
        <p style={{ margin: 0 }}>Redux</p>
        <p style={{ margin: 0 }}>Node</p>
      </Toggle>,
    );
    fireEvent.click(document.getElementsByClassName('MuiToggleButtonGroup-grouped')[0]);
    expect(document.getElementsByClassName('MuiToggleButtonGroup-grouped')[0]).toHaveClass('Mui-selected');
  });
  it('should call onChange when a toggle element is selected', () => {
    const mockedOnChange = jest.fn();
    render(
      <Toggle onChange={mockedOnChange}>
        <p style={{ margin: 0 }}>React</p>
        <p style={{ margin: 0 }}>Redux</p>
        <p style={{ margin: 0 }}>Node</p>
      </Toggle>,
    );
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
    fireEvent.click(document.getElementsByClassName('MuiToggleButtonGroup-grouped')[0]);
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });
});
