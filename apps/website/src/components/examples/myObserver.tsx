import { Observer, useObserver } from 'rosma';

type State = { random: string | number };

const myObserver = new Observer({
  random: 'Click Generate to generate random number',
});

export function MyObserver() {
  const { random, setRandom } = useObserver<State>(myObserver);

  return (
    <>
      <p>{random}</p>
      <button onClick={() => setRandom(Math.trunc(Math.random() * 1000))}>
        Generate
      </button>
    </>
  );
}
