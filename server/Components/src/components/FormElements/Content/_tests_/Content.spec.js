import React from 'react';
import Content from '../Content';
import '@testing-library/jest-dom';

describe('Test Content', () => {
  it('should apply maring correctly', () => {
    const { getByText } = render(
      <Content mt={5} ml={-10}>
        <span>Test</span>
      </Content>,
    );
    expect(getByText('Test').closest('div')).toHaveStyle('margin: 5px 0 0 -10px ');
    expect(getByText('Test').closest('div')).toHaveStyle('padding: 0 0 0 0');
  });

  it('should apply padding correctly', () => {
    const { getByText } = render(
      <Content pt={5} pl={-10} git>
        <span>Test</span>
      </Content>,
    );
    expect(getByText('Test').closest('div')).toHaveStyle('margin: 0 0 0 0');
    expect(getByText('Test').closest('div')).toHaveStyle('padding: 5px 0 0 -10px');
  });
});
