import React from 'react';
import { Header, HeaderItem } from '../index';
import theme from '../../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

describe('Testing Header component', () => {
  it('Renders Header with style bgColor', () => {
    const props = {
      bgColor: `${colors.blue}`,
    };
    const { container } = render(<Header {...props} />);
    expect(container.firstChild).toHaveStyle(`background-color: ${colors.blue}`);
  });

  it('Renders Header with style color', () => {
    const props = {
      color: `${colors.blue}`,
    };
    const { container } = render(<Header {...props} />);
    expect(container.firstChild).toHaveStyle(`color: ${colors.blue}`);
  });

  it('Should contain three child elements', () => {
    const props = {
      bgColor: colors.blue,
    };
    const { container } = render(
      <Header {...props}>
        <HeaderItem>1</HeaderItem>
        <HeaderItem>2</HeaderItem>
        <HeaderItem>3</HeaderItem>
      </Header>,
    );
    expect(container.firstChild.childElementCount).toEqual(3);
  });
});
