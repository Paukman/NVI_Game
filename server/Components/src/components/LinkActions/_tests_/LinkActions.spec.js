import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { LinkActions } from '../LinkActions';

const items = [
  {
    text: 'Edit',
    iconName: 'calendar',
  },
  {
    text: 'Delete',
    iconName: 'dashboard',
  },
];

let props = {
  hasFont: false,
  items: items,
  disabled: false,
  iconName: 'dashboard',
};

describe('LinkActions', () => {
  it('Renders with style display:flex', () => {
    const { container } = render(<LinkActions {...props} />);
    expect(container.firstChild).toHaveStyle('display: flex');
  });
  it('Should contain two child elements', () => {
    const { container } = render(<LinkActions {...props} />);
    expect(container.firstChild.childElementCount).toEqual(2);
  });
});
