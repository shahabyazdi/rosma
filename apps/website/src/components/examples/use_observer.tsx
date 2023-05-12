import { useObserver, Observer } from 'rosma';

const observer = new Observer({ foo: 'bar', num1: 0, num2: 0 });

export function Example1() {
  const { foo, setFoo } = useObserver(observer);

  return (
    <div>
      <p>Foo: {foo}</p>
      <button onClick={() => setFoo(foo === 'bar' ? 'baz' : 'bar')}>
        Toggle Foo
      </button>
    </div>
  );
}

export function Example2() {
  const { foo, setFoo } = useObserver(observer);

  return (
    <div>
      <p>Foo: {foo}</p>
      <button onClick={() => setFoo((foo) => (foo === 'bar' ? 'baz' : 'bar'))}>
        Toggle Foo
      </button>
    </div>
  );
}

export function Example3() {
  const { firstName, lastName, set } = useObserver(observer);

  return (
    <div>
      <p>
        Full Name: {firstName} {lastName}
      </p>
      <button onClick={() => set({ firstName: 'John', lastName: 'Doe' })}>
        Set full name
      </button>
    </div>
  );
}

export function Example4() {
  const { num1, num2, set } = useObserver(observer);

  return (
    <div>
      <p>num1:{num1}</p>
      <p>num2:{num2}</p>
      <button
        onClick={() =>
          set(({ num1, num2 }) => ({ num1: num1 + 1, num2: num2 + 1 }))
        }
      >
        increment
      </button>
    </div>
  );
}
