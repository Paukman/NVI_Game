import React from 'react';
import { Chip } from '../Chip';

const props = {
  label: 'Copy To',
  clickable: true,
  size: Chip.sizes[1],
  variant: Chip.variants[1],
  color: Chip.colors[1],
  dataEl: 'TestChip',
};

describe('Chip Component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Renders Chip label', () => {
    render(<Chip {...props} />);
    expect(document.querySelector(`[data-el="${props.dataEl}"] > span`).textContent).toEqual('Copy To');
  });

  it('Renders Chip close icon', () => {
    render(<Chip {...props} />);
    expect(document.querySelector(`[data-el="${props.dataEl}"] > svg`)).toBeDefined();
  });

  it('Chip clicked', () => {
    const mockedOnChange = jest.fn();

    render(<Chip {...props} onClick={mockedOnChange} />);

    fireEvent.click(document.querySelector(`[data-el="${props.dataEl}"]`));

    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });

  it('Remove Chip clicked', () => {
    const mockedOnChange = jest.fn();

    render(<Chip {...props} onDelete={mockedOnChange} />);

    fireEvent.click(document.querySelector(`[data-el="${props.dataEl}"] > svg`));

    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });
});
