import { useEffect, useRef, useState } from 'react';
import { observer as globalObserver, Observer } from '../observer';
import { GlobalState, GlobalStatics } from '../types';

export function useSelector<
  StateProps = GlobalState,
  StaticProps = GlobalStatics,
  Selected = unknown
>(
  selector: (state: StateProps) => Selected,
  observer: Observer<StateProps, StaticProps> = globalObserver as Observer<
    StateProps,
    StaticProps
  >
) {
  const [state, setState] = useState<Selected>(selector(observer.state));

  const ref = useRef<{
    selector: typeof selector;
    observer: typeof observer;
  }>();

  ref.current = { selector, observer };

  useEffect(() => {
    const { selector, observer } = ref.current;

    return observer.subscribe('*', (state) => setState(selector(state)));
  }, []);

  return state;
}
