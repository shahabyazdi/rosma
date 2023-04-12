import { observer, useObserver } from '..';
import { renderHook, act } from '@testing-library/react';

describe('observer', () => {
  it('should set the initial state of the observer', () => {
    observer.set({ count: 10 });

    const { result } = renderHook(() => useObserver());

    expect(result.current.count).toBe(10);
    expect(observer.state.count).toBe(10);
    expect(observer.get('count')).toBe(10);
    expect(observer.get(['count'])).toMatchObject({ count: 10 });
  });

  it('should update the state of the observer', () => {
    const { result } = renderHook(() => useObserver());

    act(() => observer.set({ count: 20 }));
    expect(result.current.count).toBe(20);
  });

  it('should update the state of the observer when using setCount', () => {
    const { result } = renderHook(() => useObserver());

    act(() => result.current.setCount(30));
    expect(observer.get('count')).toBe(30);
  });

  it('should subscribe for the state change', () => {
    const { result } = renderHook(() => useObserver());
    const { setCount } = result.current;
    const listener = jest.fn();

    observer.subscribe('count', listener);

    setCount(1);
    setCount(2);
    setCount(3);

    expect(observer.get('count')).toBe(3);
    expect(observer.state.count).toBe(3);
    expect(listener).toBeCalledTimes(3);
  });

  it('should subscribe for every state changes', () => {
    const { result } = renderHook(() => useObserver());
    const listener = jest.fn();

    observer.subscribe('*', listener);

    act(() => result.current.setCount(1));
    act(() => result.current.setCount2(1));
    act(() => observer.set({ count3: 1 }));

    expect(observer.get('count')).toBe(1);
    expect(observer.get('count2')).toBe(1);
    expect(observer.get('count3')).toBe(1);
    expect(listener).toBeCalledTimes(3);

    expect(listener.mock.lastCall[0]).toMatchObject({
      count: 1,
      count2: 1,
      count3: 1,
    });
  });

  it('should not subscribe for every state changes', () => {
    const { result } = renderHook(() => useObserver());
    const listener = jest.fn();

    const unsubscribe = observer.subscribe('*', listener);

    unsubscribe();

    act(() => result.current.setCount(1));
    act(() => result.current.setCount2(1));
    act(() => observer.set({ count3: 1 }));

    expect(observer.get('count')).toBe(1);
    expect(observer.get('count2')).toBe(1);
    expect(observer.get('count3')).toBe(1);
    expect(listener).toBeCalledTimes(0);
    expect(listener.mock.calls.length).toBe(0);
  });
});
