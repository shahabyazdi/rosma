import { memo, ReactElement } from 'react';
import { useObserver } from './use_observer';
import { Observer } from '../observer';
import { WithSetters } from '../types';

export function withState<
  StateProps extends Record<string, any>,
  ComponentProps extends Record<string, any> = Record<string, any>
>(
  callback: (state?: WithSetters<StateProps> & ComponentProps) => ReactElement,
  observer?: Observer
) {
  function Element(props) {
    const state = useObserver<StateProps>(observer);

    Object.defineProperties(
      state,
      Object.fromEntries(
        Object.entries(props).map(([key, value]) => [key, { value }])
      )
    );

    return callback(state as WithSetters<StateProps> & ComponentProps);
  }

  return memo<ComponentProps>(Element);
}
