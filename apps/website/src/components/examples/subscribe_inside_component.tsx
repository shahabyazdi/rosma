import { useEffect } from 'react';
import { observer, useObserver } from 'rosma';

export function Component2() {
  const { time2, setTime2 } = useObserver();

  useEffect(() => {
    const unsubscribe = observer.subscribe('time2', listener);

    function listener(time) {
      alert('The time is ' + time);
    }

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <p>{time2}</p>
      <button onClick={() => setTime2(new Date().toLocaleTimeString())}>
        Click to update
      </button>
    </div>
  );
}
