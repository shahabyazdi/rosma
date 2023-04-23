import { observer, useObserver } from 'rosma';

observer.subscribe(['random1', 'random2'], listener);

function listener({ random1, random2 }) {
  alert(`Random1: ${random1},\nRandom2: ${random2}`);
}

function Component1() {
  const { random1, setRandom1 } = useObserver();

  return (
    <button onClick={() => setRandom1(Math.random())}>
      {random1 || 'Random1'}
    </button>
  );
}

function Component2() {
  const { random2, setRandom2 } = useObserver();

  return (
    <button onClick={() => setRandom2(Math.random())}>
      {random2 || 'Random2'}
    </button>
  );
}

export function App() {
  return (
    <>
      <Component1 />
      <Component2 />
    </>
  );
}
