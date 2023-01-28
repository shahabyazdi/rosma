import { ElementType, ReactNode, useState, useEffect, useRef } from 'react';
import { observer } from '../observer';

export type State<T> = {
  withChange: (callback: (state: T & State<T>) => ReactNode) => ElementType;
} & Record<string, any>;

export function useObserver<T>(initialValue = undefined): T & State<T> {
  const state = useState();
  const ref = useRef({ keys: new Set<string>() });

  useEffect(() => {
    const { keys } = ref.current;

    if (keys.size === 0) return;

    const array = [];

    keys.forEach((key) => array.push(observer.subscribe(key, state[1])));

    return () => {
      array.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return new Proxy(
    {},
    {
      get(_, prop: string) {
        const { keys } = ref.current;

        prop = prop.toLowerCase();

        if (/^set[a-z](.+)?/.test(prop)) {
          const key = prop.replace(/^set./, (w) => w.charAt(3).toLowerCase());

          setValue(key);

          return (value) => {
            observer.set({ [key]: getValue(value, key) });
          };
        } else if (/^withchange$/.test(prop)) {
          return function (callback) {
            return function Element() {
              return callback(useObserver());
            };
          };
        } else {
          keys.add(prop);

          return setValue(prop);
        }
      },
    }
  ) as T & State<T>;

  function setValue(key: string) {
    let value = observer.get(key);

    if (!observer.isValid(key)) {
      value = getValue(initialValue, key);

      observer.set({ [key]: value });
    }

    return value;
  }

  function getValue(value, key: string) {
    return typeof value === 'function' ? value(observer.get(key)) : value;
  }
}
