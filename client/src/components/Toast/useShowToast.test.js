import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useShowToast from './useShowToast';

const initialState = {
  variant: 'filled',
  elevation: 6,
  vertical: 'top',
  horizontal: 'center',
  autoHideDuration: 4000,
  severity: 'success',
  message: '',
  onClose: () => null,
  open: false,
};
describe('useShowToast hook', () => {
  it('should set the correct state ', async () => {
    const { result } = renderHook(useShowToast);
    expect(JSON.stringify(result.current.toastState)).toEqual(JSON.stringify(initialState));
    act(() => {
      result.current.showToast({
        message: 'Hello',
        horizontal: 'left',
        onClose: () => 123,
      });
    });
    expect(result.current.toastState.open).toEqual(true);
    expect(result.current.toastState.onClose).toEqual(expect.any(Function));
    expect(result.current.toastState.onClose.toString()).toEqual('() => 123');
    expect(result.current.toastState.message).toEqual('Hello');
    expect(result.current.toastState.horizontal).toEqual('left');
  });
  it('should open and close the toast', () => {
    const { result, unmount } = renderHook(useShowToast);
    act(() => {
      result.current.showToast({ message: 'Hello', autoHideDuration: 4000 });
    });
    expect(result.current.toastState.autoHideDuration).toEqual(4000);
    let onClose = jest.fn();
    act(() => {
      result.current.showToast({ message: 'Hello', onClose });
    });

    expect(result.current.toastState.open).toEqual(true);
    act(() => {
      result.current.closeToast('', 'timeout');
    });
    expect(result.current.toastState.onClose).toHaveBeenCalledTimes(1);
    expect(result.current.toastState.open).toEqual(false);
    onClose = jest.fn();
    act(() => {
      result.current.showToast({ message: 'Hello', onClose });
    });
    unmount();
    act(() => {
      result.current.closeToast('', 'timeout');
    });
    expect(result.current.toastState.onClose).toHaveBeenCalledTimes(0);
    expect(result.current.toastState.open).toEqual(true);
  });
  it('should render react elements', () => {
    const { result } = renderHook(useShowToast);
    const handleOnClick = jest.fn();
    const reactEl = (
      <button type='button' onClick={handleOnClick}>
        Hello
      </button>
    );
    act(() => {
      result.current.showToast({
        message: reactEl,
      });
    });
    result.current.toastState.message.props.onClick();
    expect(handleOnClick).toHaveBeenCalledTimes(1);
  });
});
