import { memo, ReactElement } from 'react';
import { useObserver } from './use_observer';
import { Observer } from '../observer';
import { WithSetters, GlobalState, GlobalStatics } from '../types';

export function withState<
  StateProps = GlobalState,
  ComponentProps extends Record<string, any> = Record<string, any>,
  StaticProps = GlobalStatics
>(
  callback: (
    state?: WithSetters<StateProps> & ComponentProps & StaticProps
  ) => ReactElement,
  observer?: Observer<StateProps, StaticProps>
) {
  function Element(props) {
    const state = useObserver<StateProps>(observer);

    Object.defineProperties(
      state,
      Object.fromEntries(
        Object.entries(props).map(([key, value]) => [key, { value }])
      )
    );

    return callback(
      state as WithSetters<StateProps> & ComponentProps & StaticProps
    );
  }

  return memo<ComponentProps>(Element);
}
