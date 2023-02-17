import { memo } from 'react';
import { useObserver } from './use_observer';
import { State } from '../types';

export function withState<T>(callback) {
  function Element(props) {
    const state = useObserver<State<T>>();

    Object.defineProperties(
      state,
      Object.fromEntries(
        Object.entries(props).map(([key, value]) => [key, { value }])
      )
    );

    return callback(state);
  }

  return memo<State<T>>(Element);
}
