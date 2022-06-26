import React from 'react';
import { FullSpaceFlexBox } from '../FullSpaceFlexBox';

describe('Full Space FlexBox', () => {
  it('renders a simple div with content center', () => {
    const { container } = render(<FullSpaceFlexBox />);
    expect(container.firstChild).toHaveStyle('align-items: center');
  });
});
