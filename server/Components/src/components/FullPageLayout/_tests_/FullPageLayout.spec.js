import React from 'react';
import FullPageLayout from '../FullPageLayout';

let props = {
  id: 'fullPageLayout',
  bgColor: 'green',
};

describe('Full Page Layout', () => {
  it('Check bgColor apply to full Page Layout', () => {
    const { container } = render(<FullPageLayout {...props} />);
    expect(container.firstChild).toHaveStyle('background-color: #66AB46');
  });
  it('Check bgImage apply to full Page Layout', () => {
    const props = {
      bgImage: 'https://images.pexels.com/photos/3890376/pexels-photo-3890376.jpeg',
    };
    const { container } = render(<FullPageLayout {...props} />);
    expect(container.firstChild).toHaveStyle(
      'background-image: url(https://images.pexels.com/photos/3890376/pexels-photo-3890376.jpeg)',
    );
  });
});
