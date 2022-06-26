import React from 'react';
import { TagsSelector } from '../TagsSelector';
import { allTags, selectedTags } from '../data';

const props = {
  label: 'Copy To',
  errorMsg: 'Some Error Message',
  value: selectedTags,
  items: allTags,
  dataEl: 'TestTagsSelector',
};

describe('TagsSelector Component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Renders TagsSelector label', () => {
    render(<TagsSelector {...props} />);
    expect(document.querySelector(`[data-el="${props.dataEl}-label"]`).textContent).toEqual('Copy To');
  });

  it('Renders TagsSelector with tags', () => {
    render(<TagsSelector {...props} />);
    expect(document.querySelector(`[data-el="${props.dataEl}-tags"]`).childElementCount).toEqual(6);
  });

  it('Renders TagsSelector error', () => {
    render(<TagsSelector {...props} />);
    expect(document.querySelector(`[data-el="${props.dataEl}-error"]`).textContent).toEqual('Some Error Message');
  });

  it('Remove Tag clicked', () => {
    const mockedOnChange = jest.fn();

    render(<TagsSelector {...props} onChange={mockedOnChange} />);

    fireEvent.click(document.querySelector(`[data-el="${props.dataEl}-1"] > svg`));

    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });
});
