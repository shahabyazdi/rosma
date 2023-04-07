import { HTMLAttributes } from 'react';
import { observer, useObserver } from 'rosma';

export function DisplayTime() {
  const { time, setTime } = useObserver('');

  return (
    <div>
      <p>Time is: {time}</p>
      <Button onClick={() => setTime(getTime())}>
        Update time with setter method
      </Button>
      <Button onClick={() => observer.set({ time: getTime() })}>
        Update time with observer.set
      </Button>
      <Button
        onClick={() => observer.set({ time: getTime() }, { silent: true })}
      >
        Update time silently
      </Button>
    </div>
  );
}

function getTime() {
  return new Date().toLocaleTimeString();
}

function Button(props: HTMLAttributes<HTMLButtonElement>) {
  return <button {...props} style={{ display: 'block' }} />;
}
