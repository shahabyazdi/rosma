import {
  CacheData,
  Listener,
  ObserverValues,
  SetOptions,
  StarOrKey,
  BindObserver,
  GlobalState,
  GlobalStatics,
} from '../types';

class Observer<T = Record<string, any>, S = Record<string, any>> {
  #cache: Record<string, CacheData> = {};
  #listeners = new Map<Listener, Set<string>>();
  #state = {};
  statics = {} as S;

  constructor(initialValues?: T, statics?: BindObserver<S, T>) {
    this.#createCache('*');
    this.#setValues(initialValues);
    this.setStatics(statics);
  }

  setStatics(statics?: BindObserver<S, T>) {
    if (typeof statics === 'object') {
      Object.entries(statics).forEach(([key, value]) => {
        if (typeof value === 'function') {
          this.statics[key] = value.bind(this);
        } else {
          this.statics[key] = value;
        }
      });
    }
  }

  #createCache(key: string) {
    if (!this.#cache[key]) this.#cache[key] = { listeners: new Set() };
  }

  #addListener(listener: Listener) {
    if (!this.#listeners.has(listener)) {
      this.#listeners.set(listener, new Set());
    }
  }

  subscribe<StateType extends T>(
    key: StarOrKey<keyof StateType> | Array<keyof StateType>,
    listener: Listener
  ) {
    if (typeof listener !== 'function') {
      warn(['listener must be a function']);

      return () => false;
    }

    const list = Array.isArray(key)
      ? Array.from(new Set(key)).filter((key) => key !== '*')
      : [key];

    this.#addListener(listener);

    const keys = list.map(toLowerCase);

    keys.forEach((key) => {
      this.#createCache(key);
      this.#listeners.get(listener).add(key);
      this.#cache[key].listeners.add(listener);
    });

    return () => {
      this.#listeners.delete(listener);

      keys.forEach((key) => this.#cache[key].listeners.delete(listener));
    };
  }

  set<StateType>(
    values: ObserverValues<StateType, T>,
    { silent }: SetOptions = { silent: false }
  ) {
    if (typeof values === 'function') values = values(proxy(this.#state));
    if (typeof values !== 'object') return;

    const keys = this.#setValues(values);

    if (!silent && keys) this.#notify(keys);
  }

  #setValues(object) {
    if (typeof object !== 'object') return;

    const originalKeys = Object.keys(object).filter((i) => !this.statics[i]);
    const keys = originalKeys.map(toLowerCase);

    keys.forEach((key, index) => {
      this.#createCache(key);
      this.#state[key] = object[originalKeys[index]];
    });

    return keys;
  }

  get<StateType extends T & S>(key: keyof StateType | Array<keyof StateType>) {
    const getValue = (key: string | number | symbol) => {
      key = key.toString();

      return this.statics[key] || this.#state[key.toLowerCase()];
    };

    return typeof key === 'string'
      ? getValue(key)
      : Array.isArray(key)
      ? Object.fromEntries(key.map((key) => [key, getValue(key)]))
      : undefined;
  }

  get state(): T {
    return proxy(this.#state);
  }

  #notify(keys: string[]) {
    const listeners = new Set<Listener>();

    this.#cache['*'].listeners.forEach((listener) => listeners.add(listener));

    keys.forEach((key) => {
      this.#cache[key.toLowerCase()].listeners.forEach((listener) =>
        listeners.add(listener)
      );
    });

    listeners.forEach((listener) => listener(this.#getValue(listener)));
  }

  #getValue(listener: Listener) {
    if (this.#cache['*'].listeners.has(listener)) return this.state;

    const keys = Array.from(this.#listeners.get(listener));

    return keys.length === 1
      ? this.#state[keys[0]]
      : Object.fromEntries(keys.map((key) => [key, this.#state[key]]));
  }

  isValid(key: string) {
    return typeof this.#cache[key.toLowerCase()] !== 'undefined';
  }
}

const observer = new Observer<GlobalState, GlobalStatics>();

export { Observer, observer };

function warn(message: string[]) {
  console.warn(message.join('\n'));
}

function proxy(object) {
  return new Proxy(object, {
    get(target, prop) {
      return target[toLowerCase(prop)];
    },
    set(target, prop, value) {
      target[toLowerCase(prop)] = value;

      return true;
    },
  });
}

function toLowerCase(string) {
  return string.toString().toLowerCase();
}
