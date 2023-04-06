import { useState, useEffect, useRef } from 'react';
import { Observer, observer as globalObserver } from '../observer';
import { WithSetters } from '../types';

export function useObserver<T = Record<string, any>>(
  input = undefined
): WithSetters<T> {
  const isObserverInstance = input instanceof Observer,
    initialValue = isObserverInstance ? undefined : input,
    observer = isObserverInstance ? input : globalObserver,
    state = useState({}),
    ref = useRef({ keys: new Set<string>() });

  useEffect(() => {
    const { keys } = ref.current;

    if (keys.size === 0) return;

    const unsubscribe = observer.subscribe(Array.from(keys), listener);

    function listener(value) {
      state[1]({ value });
    }

    return () => unsubscribe();
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
  ) as WithSetters<T>;

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
