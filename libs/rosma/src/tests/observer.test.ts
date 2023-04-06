import { observer, useObserver } from '..';
import { renderHook, act } from '@testing-library/react';

describe('observer', () => {
  it('should set the initial state of the observer', () => {
    observer.set({ count: 10 });

    const { result } = renderHook(() => useObserver());

    expect(result.current.count).toBe(10);
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
});
