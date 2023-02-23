import { CacheData, Listener } from '../types';

class Observer {
  #cache: Record<string, CacheData> = {};

  #createCache(key: string) {
    if (!this.#cache[key]) this.#cache[key] = { listeners: new Set() };
  }

  subscribe(key: string, listener: Listener) {
    if (typeof listener !== 'function') {
      warn(['listener must be a function']);

      return () => false;
    }

    this.#createCache(key);

    const listeners = this.#cache[key].listeners;

    listeners.add(listener);

    return () => listeners.delete(listener);
  }

  set<T>(
    object: T | Record<string, any>,
    { silent }: { silent?: boolean } = { silent: false }
  ) {
    if (typeof object !== 'object') return;

    Object.entries(object).forEach(([key, value]) => {
      this.#createCache(key);
      this.#cache[key].value = value;

      if (!silent) this.#notify(key);
    });
  }

  get(key: string | string[]) {
    return typeof key === 'string'
      ? this.#cache?.[key.toLowerCase()]?.value
      : Array.isArray(key)
      ? Object.fromEntries(key.map((key) => [key, observer.get(key)]))
      : undefined;
  }

  #notify(key: string) {
    const listeners = this.#cache[key].listeners;
    const value = this.#cache[key].value;

    listeners.forEach((listener) => listener(value));
  }

  isValid(key: string) {
    return typeof this.#cache[key] !== 'undefined';
  }
}

export const observer = new Observer();

function warn(message: string[]) {
  console.warn(message.join('\n'));
}
