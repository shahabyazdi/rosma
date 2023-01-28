import { useObserver } from 'rosma';

type State = {
  count: number;
  setCount: (count: number) => void;
};

export function Index() {
  const { setCount, withChange } = useObserver<State>(0);

  const Button = withChange(({ count }) => (
    <button onClick={() => setCount(count + 1)}>{count}</button>
  ));

  return <Button />;
}

export default Index;
