import { useObserver, Observer } from 'rosma';

const observer = new Observer();

observer.subscribe('*', listener);

function listener({ random1, random2 }) {
  if ((random1 || random2) === undefined) return;

  alert(`Random1: ${random1},\nRandom2: ${random2}`);
}

function Component1() {
  const { random1, setrandom1 } = useObserver(observer);

  return (
    <button onClick={() => setrandom1(Math.random())}>
      {random1 || 'random1'}
    </button>
  );
}

function Component2() {
  const { random2, setrandom2 } = useObserver(observer);

  return (
    <button onClick={() => setrandom2(Math.random())}>
      {random2 || 'Random2'}
    </button>
  );
}

export function App1() {
  return (
    <>
      <Component1 />
      <Component2 />
    </>
  );
}
