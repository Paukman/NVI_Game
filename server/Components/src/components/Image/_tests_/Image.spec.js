import React from 'react';
import Image from '../Image';

describe('Testing Image component', () => {
  it('Renders Image with attribute width', () => {
    const props = {
      src: 'https://kitsforacause.com/wp-content/uploads/Back-to-School-Kits.jpg',
      width: '200px',
    };
    const { container } = render(<Image {...props} />);
    expect(container.firstChild).toHaveStyle('width: 200px');
  });

  it('Renders Image with attribute height', () => {
    const props = {
      src: 'https://kitsforacause.com/wp-content/uploads/Back-to-School-Kits.jpg',
      height: '200px',
    };
    const { container } = render(<Image {...props} />);
    expect(container.firstChild).toHaveStyle('height: 200px');
  });
});
