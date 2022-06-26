import React from 'react';
import Card from '../Card';

describe('Testing Card component', () => {
  it('renders sample card which has flex-grow: 1', () => {
    const { container } = render(<Card />);
    expect(container.firstChild).toHaveStyle('flex-grow: 1');
  });

  it('renders a simple div with width 100%', () => {
    const { container } = render(<Card />);
    expect(container.firstChild).toHaveStyle('width: 100%');
  });

  it('scrollable renders a boolean value', () => {
    const props = { noPadding: false, scrollable: false };
    const { container } = render(<Card id='card' {...props} />);
    expect(container).toBeInTheDocument();
    expect(props).toEqual(
      expect.objectContaining({
        scrollable: false,
      }),
    );
  });
});
