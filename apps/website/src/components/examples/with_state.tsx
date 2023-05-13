import { useState } from 'react';
import { withState, Observer, WithSetters } from 'rosma';

function CountNumbers({ number = 0, setNumber }) {
  return <button onClick={() => setNumber(number + 1)}>{number}</button>;
}

export default withState(CountNumbers);

const ComponentA = withState(
  ({
    number = 0,
    setNumber,
    strTime,
  }: WithSetters<{ number?: number; strTime?: string }>) => (
    <div style={{ backgroundColor: '#efefef', padding: '5px' }}>
      <p style={{ fontWeight: 'bold' }}>Component A</p>
      <button onClick={() => setNumber(number + 1)}>Count is: {number}</button>
      <p>Time is: {strTime}</p>
    </div>
  )
);

export function ComponentB() {
  const [strTime, setStrTime] = useState('');

  return (
    <>
      <ComponentA strTime={strTime} />
      <div style={{ backgroundColor: '#e2e2e2', padding: '5px' }}>
        <p style={{ fontWeight: 'bold' }}>Component B</p>
        <button onClick={() => setStrTime(new Date().toLocaleTimeString())}>
          click to update time
        </button>
      </div>
    </>
  );
}

const observer = new Observer({ number: 10 });

export const CountNumber = withState(
  ({ number, setNumber }) => (
    <button onClick={() => setNumber(number + 1)}>Number is :{number}</button>
  ),
  observer
);
