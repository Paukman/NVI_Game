import React from 'react';
import { render, act } from '@testing-library/react';
import { ToastProvider, ToastContext } from './ToastProvider';

describe('ToastProvider hook', () => {
  it('should render children', async () => {
    let component;
    await act(async () => {
      component = render(
        <ToastProvider>
          <div />
        </ToastProvider>,
      );
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });
  it('should render children with context', async () => {
    let component;
    await act(async () => {
      component = render(
        <ToastContext.Provider value={{}}>
          <div />
        </ToastContext.Provider>,
      );
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });
});
