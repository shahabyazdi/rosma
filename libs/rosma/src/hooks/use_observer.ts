import { useState, useEffect, useRef } from 'react';
import { Observer, observer as globalObserver } from '../observer';
import {
  ObserverValues,
  SetOptions,
  WithSetters,
  GlobalState,
  GlobalStatics,
} from '../types';

export function useObserver<T = GlobalState, Statics = GlobalStatics>(
  input = undefined
): WithSetters<T> & Statics {
  const isObserverInstance = input instanceof Observer,
    initialValue = isObserverInstance ? undefined : input,
    observer = isObserverInstance ? input : globalObserver,
    [state, setState] = useState({ value: {} }),
    ref = useRef({ keys: new Set<string>() });

  useEffect(() => {
    const keys = Array.from(ref.current.keys);

    if (keys.length === 0) return;

    const value = observer.get(keys);

    setState((prev) => {
      if (
        Object.entries(value).some(([key, value]) => prev.value[key] !== value)
      ) {
        return { value };
      }

      return prev;
    });

    return observer.subscribe(keys, (value) => setState({ value }));
  }, []);

  return new Proxy(
    {},
    {
      get(target, key: string) {
        if (observer.statics[key]) return observer.statics[key];

        const { keys } = ref.current;

        const prop = key.toLowerCase();

        if (prop === 'set') {
          return (...args) => {
            observer.set(
              ...(args as [ObserverValues<T, Record<string, any>>, SetOptions])
            );
          };
        } else if (prop.startsWith('set')) {
          const key = prop.replace('set', '');

          if (typeof initialValue !== 'undefined') setValue(key);

          return (value) => {
            observer.set({ [key]: getValue(value, key) });
          };
        } else {
          if (target[key]) return target[key];

          keys.add(prop);

          return setValue(prop);
        }
      },
      defineProperty(target, prop, attributes) {
        target[prop] = attributes.value;

        return true;
      },
    }
  ) as WithSetters<T> & Statics;

  function setValue(key: string) {
    let value = observer.get(key);

    if (!observer.isValid(key)) {
      value = getValue(initialValue, key);

      observer.set({ [key]: value });
    }

    state.value[key] = value;

    return value;
  }

  function getValue(value, key: string) {
    return typeof value === 'function' ? value(observer.get(key)) : value;
  }
}
