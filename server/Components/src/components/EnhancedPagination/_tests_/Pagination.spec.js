import React from 'react';
import EnhancedPagination from '../EnhancedPagination';
//import { render, screen } from '@testing-library/react';

const props = {
  count: 10,
  onChange: () => {},
  page: 1,
};

describe('EnhancedPagination', () => {
  it('should renter initial props', () => {
    render(<EnhancedPagination {...props} />);
    expect(Screen.getByText('1 of 10')).toBeDefined();
  });

  // it('should navigate pagination with icons', async () => {
  //   const { container } = render(<EnhancedPagination {...props} />);
  //   const lastIcon = container.querySelector("div[data-el='lastPageIcon']");
  //   const firstIcon = container.querySelector("div[data-el='firstPageIcon']");
  //   const previousIcon = container.querySelector("div[data-el='chevronLeftIcon']");
  //   const nextIcon = container.querySelector("div[data-el='chevronRightIcon']");

  //   await fireEvent.click(lastIcon);
  //   expect(Screen.getByText('10 of 10')).toBeDefined();

  //   await fireEvent.click(previousIcon);
  //   expect(Screen.getByText('9 of 10')).toBeDefined();

  //   await fireEvent.click(firstIcon);
  //   expect(Screen.getByText('1 of 10')).toBeDefined();

  //   await fireEvent.click(nextIcon);
  //   expect(Screen.getByText('2 of 10')).toBeDefined();
  // });

  // it('should jump to desired page', async () => {
  //   const { container } = render(<EnhancedPagination {...props} />);
  //   const goToPageInput = Screen.getByTestId('goToPage');
  //   await fireEvent.change(goToPageInput, { target: { value: 5 } });
  //   // should not be done like this, icon should have identifier
  //   const pageSearchIcon = container.querySelector("div[data-el='searchPageIcon']");
  //   await fireEvent.click(pageSearchIcon);
  //   expect(Screen.getByText('5 of 10')).toBeDefined();
  // });
});
