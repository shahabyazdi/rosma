import { observer, useObserver } from 'rosma';

observer.subscribe('time', listener);

function listener(time) {
  alert('The time is ' + time);
}

export function Component() {
  const { time, setTime } = useObserver();

  return (
    <div>
      <p>{time}</p>
      <button onClick={() => setTime(new Date().toLocaleTimeString())}>
        Click to update
      </button>
    </div>
  );
}
