import { observer, useObserver } from 'rosma';

const unsubscribe = observer.subscribe('myVar', listener);

function listener(myVar) {
  alert('myVar changed! ' + myVar);
}

export function ObserverTest() {
  const { setMyVar } = useObserver();

  return (
    <>
      <button onClick={() => setMyVar(new Date())}>Click me</button>
      <button onClick={unsubscribe}>Unsubscribe</button>
    </>
  );
}
