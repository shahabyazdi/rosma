import { useObserver, withState } from 'rosma';

type State = {
  count: number;
  setCount: (count: number) => void;
};

export function Index() {
  const { setCount } = useObserver<State>(0);

  const Button = withState(({ count }) => (
    <button onClick={() => setCount(count + 1)}>{count}</button>
  ));

  return <Button />;
}

export default Index;
