# Rosma

Simple and easy-to-use global state management for React. no need for provider, reducer or nothing else!

# Installation

```bash
npm i rosma
```

# Documentation

https://rosma.dev/

## Counter app

```javascript
import { useObserver } from 'rosma';

export default function Counter() {
  const { count, setCount } = useObserver(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### No order for variables

```javascript
import { useObserver } from 'rosma';

export default function Counter() {
  const { setCount, count } = useObserver(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

The only concept that must be notice is that you must add a 'set' to the beginning of the setter name of the destructed variable.

For example if you want a setter method for the 'count' variable, you should name that setter as 'setCount'.

Also, all the destructed variables are case insensitive

```javascript
import { useObserver } from 'rosma';

export default function Counter() {
  const { CouNt, setcOunT } = useObserver(0);

  return <button onClick={() => setcOunT(Count + 1)}>{CouNt}</button>;
}
```

### Multiple destructuring

Destruct all the variables you want at once

```javascript
import { useObserver } from 'rosma';

export default function Counts() {
  const { count, setCount, count1, setCount1 } = useObserver(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <button onClick={() => setCount1(count1 + 1)}>{count1}</button>
    </>
  );
}
```

### Different initial values

In the example above, all the variables take the initial value of 0. to avoid this, one of the following methods can be used:

- Define the initial values separately

```javascript
import { useObserver } from 'rosma';

export default function Counts() {
  const { count, setCount } = useObserver(10);
  const { count1, setCount1 } = useObserver(20);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <button onClick={() => setCount1(count1 + 1)}>{count1}</button>
    </>
  );
}
```

- Define the initial values at once

If you want to set the initial values and also destruct them at once, you can set the initial values directly from the observer.

```javascript
import { observer, useObserver } from 'rosma';

observer.set({ count: 10, count1: 20 });

export default function Counts() {
  const { count, setCount, count1, setCount1 } = useObserver();

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <button onClick={() => setCount1(count1 + 1)}>{count1}</button>
    </>
  );
}
```

## Notes app

```javascript
import { useObserver } from 'rosma';

export default function Note() {
  const { note = '', setNote, notes = [], setNotes } = useObserver();

  return (
    <>
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="write something" />
      <button
        onClick={() => {
          setNotes(notes.concat(note));
          setNote('');
        }}
      >
        Add
      </button>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </>
  );
}
```

### Avoiding extra rerender

If you want the entire main component not to be re-rendered with state changes, you can easily split the elements of the main component into smaller components using the withState method.

```javascript
import { withState } from 'rosma';

const Input = withState(({ note = '', setNote }) => <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="write something" />);

const Button = withState(({ note, setNotes, setNote }) => (
  <button
    onClick={() => {
      setNotes((notes = []) => notes.concat(note));
      setNote('');
    }}
  >
    Add
  </button>
));

const List = withState(({ notes = [] }) => (
  <ul>
    {notes.map((note, index) => (
      <li key={index}>{note}</li>
    ))}
  </ul>
));

export default function Note() {
  return (
    <>
      <Input />
      <Button />
      <List />
    </>
  );
}
```

### Further optimization

To avoid extra rendering, you can read the values directly from the observer. In the example above, the Button component is re-rendered every time that the 'note' variable is changed. But you can avoid this extra rendering by reading the 'note' value from the observer.

```javascript
import { observer, withState } from 'rosma';

const Input = withState(({ note = '', setNote }) => <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="write something" />);

const Button = withState(({ setNotes, setNote }) => (
  <button
    onClick={() => {
      setNotes((notes = []) => notes.concat(observer.get('note')));
      setNote('');
    }}
  >
    Add
  </button>
));

const List = withState(({ notes = [] }) => (
  <ul>
    {notes.map((note, index) => (
      <li key={index}>{note}</li>
    ))}
  </ul>
));

export default function Note() {
  return (
    <>
      <Input />
      <Button />
      <List />
    </>
  );
}
```
