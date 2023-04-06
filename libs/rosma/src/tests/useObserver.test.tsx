import { useObserver } from '..';
import { renderHook, act, render, fireEvent } from '@testing-library/react';

describe('useObserver', () => {
  it('should initialize the count to the provided value', () => {
    const { result } = renderHook(() => {
      const { count } = useObserver(10);

      return { count };
    });

    expect(result.current.count).toBe(10);
  });

  it('should update the count value when setCount is called', () => {
    const { result } = renderHook(() => {
      const { count, setCount } = useObserver();

      return { count, setCount };
    });

    expect(result.current.count).toBe(10);
    act(() => result.current.setCount(1));
    expect(result.current.count).toBe(1);
  });

  it('should update the count value when the button is clicked', () => {
    const { getByRole } = render(<Counter />);
    const button = getByRole('button');

    expect(button.textContent).toBe('1');

    fireEvent.click(button);

    expect(button.textContent).toBe('2');
  });
});

function Counter() {
  const { count, setCount } = useObserver();

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
