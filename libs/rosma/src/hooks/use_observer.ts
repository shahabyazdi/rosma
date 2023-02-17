import { useState, useEffect, useRef } from 'react';
import { observer } from '../observer';
import { State } from '../types';

export function useObserver<T>(initialValue = undefined): State<T> {
  const state = useState({});
  const ref = useRef({ keys: new Set<string>() });

  useEffect(() => {
    const { keys } = ref.current;

    if (keys.size === 0) return;

    const array = [];

    keys.forEach((key) => array.push(observer.subscribe(key, listener)));

    function listener(value) {
      state[1]({ value });
    }

    return () => {
      array.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return new Proxy(
    {},
    {
      get(target, prop: string) {
        const { keys } = ref.current;

        prop = prop.toLowerCase();

        if (prop.startsWith('set')) {
          const key = prop.replace('set', '');

          if (typeof initialValue !== 'undefined') setValue(key);

          return (value) => {
            observer.set({ [key]: getValue(value, key) });
          };
        } else {
          if (target[prop]) return target[prop];

          keys.add(prop);

          return setValue(prop);
        }
      },
    }
  ) as State<T>;

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
