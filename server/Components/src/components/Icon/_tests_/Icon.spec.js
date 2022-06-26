import React from 'react';
import Icon from '../Icon';

describe('Testing Icon component', () => {
  it('Renders Icon with attribute size', () => {
    const props = {
      name: 'search',
      size: '30',
    };
    const { container } = render(<Icon {...props} />);
    expect(container.firstChild).toHaveAttribute('size', '30');
  });

  it('Renders icon with attribue color', () => {
    const props = {
      name: 'search',
      color: '#333',
    };
    const { container } = render(<Icon {...props} />);
    expect(container.firstChild).toHaveAttribute('color', '#333');
  });
});
