import { CacheData, Listener } from '../types';

class Observer<T = Record<string, any>> {
  #cache: Record<string, CacheData> = {};
  #listeners = new Map<Listener, Set<string>>();

  constructor(initialValues?: T) {
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

  subscribe<K extends keyof T>(key: K | K[], listener: Listener) {
    if (typeof listener !== 'function') {
      warn(['listener must be a function']);

      return () => false;
    }

    if (typeof key === 'string') key = [key];

    this.#addListener(listener);

    (key as string[]).forEach((key) => {
      this.#createCache(key);
      this.#listeners.get(listener).add(key);
      this.#cache[key].listeners.add(listener);
    });

    return () => {
      this.#listeners.delete(listener);

      (key as string[]).forEach((key) =>
        this.#cache[key].listeners.delete(listener)
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
      this.#cache[key].value = object[key];
    });

    return keys;
  }

  get<K extends keyof T>(key: K | Array<K>) {
    return typeof key === 'string'
      ? this.#cache?.[key.toLowerCase()]?.value
      : Array.isArray(key)
      ? Object.fromEntries(key.map((key) => [key, observer.get(key as string)]))
      : undefined;
  }

  #notify(keys: string[]) {
    const listeners = new Set<Listener>();

    keys.forEach((key) => {
      this.#cache[key].listeners.forEach((listener) => listeners.add(listener));
    });

    listeners.forEach((listener) => listener(this.#getValue(listener)));
  }

  #getValue(listener: Listener) {
    const keys = Array.from(this.#listeners.get(listener));

    return keys.length === 1
      ? this.#cache[keys[0]].value
      : Object.fromEntries(keys.map((key) => [key, this.#cache[key].value]));
  }

  isValid(key: string) {
    return typeof this.#cache[key] !== 'undefined';
  }
}

const observer = new Observer();

export { Observer, observer };

function warn(message: string[]) {
  console.warn(message.join('\n'));
}
