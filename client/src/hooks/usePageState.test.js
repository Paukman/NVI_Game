import { renderHook } from '@testing-library/react-hooks';
import usePageState from './usePageState';

describe('Testing usePageState', () => {
  const pageState = {
    ERROR: { state: 'ERROR' },
    MESSAGE: { state: 'MESSAGE', message: 'Message for message' },
    LOADING: { state: 'LOADING' },
    DEFAULT: { state: 'MESSAGE', message: 'Message for default' },
  };

  it('should return proper mapping', async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => usePageState(pageState));
    });

    const { result } = hook;

    let mappedState;

    mappedState = result.current.updatePageState(pageState.ERROR);
    expect(mappedState).toEqual({ ERROR: true, LOADING: false, MESSAGE: false });

    mappedState = result.current.updatePageState(pageState.DEFAULT);
    expect(mappedState).toEqual({
      ERROR: false,
      LOADING: false,
      MESSAGE: 'Message for default',
    });

    mappedState = result.current.updatePageState(pageState.LOADING);
    expect(mappedState).toEqual({
      ERROR: false,
      LOADING: true,
      MESSAGE: false,
    });

    mappedState = result.current.updatePageState(pageState.MESSAGE);
    expect(mappedState).toEqual({
      ERROR: false,
      LOADING: false,
      MESSAGE: 'Message for message',
    });

    mappedState = result.current.updatePageState(pageState.MESSAGE, 'Some custom message');
    expect(mappedState).toEqual({
      ERROR: false,
      LOADING: false,
      MESSAGE: 'Some custom message',
    });
  });

  it('should hanlde bad input', async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => usePageState(pageState));
    });

    const { result } = hook;

    let mappedState;

    mappedState = result.current.updatePageState('something');
    expect(mappedState).toEqual({
      ERROR: false,
      LOADING: false,
      MESSAGE: false,
    });
    mappedState = result.current.updatePageState(null, 'message');
    expect(mappedState).toEqual({
      ERROR: false,
      LOADING: false,
      MESSAGE: false,
    });
    mappedState = result.current.updatePageState(undefined, null);
    expect(mappedState).toEqual({
      ERROR: false,
      LOADING: false,
      MESSAGE: false,
    });
  });

  it('should hanlde bad state - null state', async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => usePageState(null));
    });
    const { result } = hook;
    const mappedState = result.current.updatePageState('something');
    expect(mappedState).toEqual({});
  });
  it('should hanlde bad state - wrong state', async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => usePageState({ message: { state: null } }));
    });
    const { result } = hook;
    const mappedState = result.current.updatePageState('something');
    expect(mappedState).toEqual({});
  });

  it('should hanlde bad state - single state', async () => {
    let hook;
    const someState = {
      MINE: { state: 'MINE' },
    };
    await act(async () => {
      hook = renderHook(() => usePageState(someState));
    });
    const { result } = hook;

    let mappedState = null;
    await act(async () => {
      mappedState = result.current.updatePageState(someState.MINE);
    });
    console.log(mappedState);
    expect(mappedState).toEqual({ MINE: true });
  });
});
