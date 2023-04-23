import { CacheData, Listener, StarOrKey } from '../types';

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

    const keys = key.map((key) => key.toString().toLowerCase());

    keys.forEach((key) => {
      this.#createCache(key);
      this.#listeners.get(listener).add(key);
      this.#cache[key].listeners.add(listener);
    });

    return () => {
      this.#listeners.delete(listener);

      keys.forEach((key) =>
        this.#cache[key.toLowerCase()].listeners.delete(listener)
      );
    };
  }

  set<StateType>(
    object: Partial<StateType | T>,
    { silent }: { silent?: boolean } = { silent: false }
  ) {
    if (typeof object !== 'object') return;

    const keys = this.#setValues(object);

    if (!silent && keys) this.#notify(keys);
  }

  #setValues(object) {
    if (typeof object !== 'object') return;

    const keys = Object.keys(object);

    keys.forEach((key) => {
      this.#createCache(key);
      this.#state[key.toLowerCase()] = object[key];
    });

    return keys;
  }

  get<K extends keyof T>(key: K | Array<K>) {
    return typeof key === 'string'
      ? this.#state?.[key.toLowerCase()]
      : Array.isArray(key)
      ? Object.fromEntries(key.map((key) => [key, observer.get(key as string)]))
      : undefined;
  }

  get state(): T {
    return this.#state as T;
  }

  #notify(keys: string[]) {
    const listeners = new Set<Listener>();

    this.#cache['*'].listeners.forEach((listener) => listeners.add(listener));

    keys.forEach((key) => {
      this.#cache[key].listeners.forEach((listener) => listeners.add(listener));
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
