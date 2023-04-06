import { memo } from 'react';
import { useObserver } from './use_observer';
import { Observer } from '../observer';

export function withState<T extends Record<string, any>>(
  callback,
  observer?: Observer
) {
  function Element(props) {
    const state = useObserver<T>(observer);

    Object.defineProperties(
      state,
      Object.fromEntries(
        Object.entries(props).map(([key, value]) => [key, { value }])
      )
    );

    return callback(state);
  }

  return memo<T>(Element);
}
