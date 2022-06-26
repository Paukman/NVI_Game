import React from 'react';
import Visible from '../Visible';

describe('Visible', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: true,
        media: '(min-width: 768px)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  it('Renders the visible component with props', () => {
    render(
      <Visible on={['md']}>
        <p className='baseVisibleClass' data-testid='visible_component_test_element'></p>
      </Visible>,
    );
    expect(Screen.getByTestId('visible_component_test_element')).toHaveClass('baseVisibleClass');
  });
});
