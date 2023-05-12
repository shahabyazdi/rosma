import {
  CacheData,
  Listener,
  ObserverValues,
  SetOptions,
  StarOrKey,
} from '../types';

class Observer<T = Record<string, any>> {
  #cache: Record<string, CacheData> = {};
  #listeners = new Map<Listener, Set<string>>();
  #state = {};

  constructor(initialValues?: T) {
    this.#createCache('*');
    this.#setValues(initialValues);
  }

  #createCache(key: string) {
    if (!this.#cache[key]) this.#cache[key] = { listeners: new Set() };
  }

  #addListener(listener: Listener) {
    if (!this.#listeners.has(listener)) {
      this.#listeners.set(listener, new Set());
    }
  }

  subscribe<K extends keyof T>(
    key: StarOrKey<K> | Array<StarOrKey<K>>,
    listener: Listener
  ) {
    if (typeof listener !== 'function') {
      warn(['listener must be a function']);

      return () => false;
    }

    if (!Array.isArray(key)) key = [key];

    this.#addListener(listener);

    const keys = key.map(toLowerCase);

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

    const originalKeys = Object.keys(object);
    const keys = originalKeys.map(toLowerCase);

    keys.forEach((key, index) => {
      this.#createCache(key);
      this.#state[key] = object[originalKeys[index]];
    });

    return keys;
  }

  get<K extends keyof T>(key: K | Array<K>) {
    return typeof key === 'string'
      ? this.#state[key.toLowerCase()]
      : Array.isArray(key)
      ? Object.fromEntries(
          key.map((key) => [key, this.#state[toLowerCase(key)]])
        )
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

const observer = new Observer();

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
