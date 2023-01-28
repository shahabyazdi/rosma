type Listener = (state: any) => void;

type State = {
  setter?: string;
  getter?: string;
  value?: any;
  listeners?: Set<Listener>;
};

class Observer {
  #cache: Record<string, State> = {};

  #createCache(key: string) {
    if (!this.#cache[key]) this.#cache[key] = { listeners: new Set() };
  }

  subscribe(key: string, listener: Listener = () => {}) {
    if (typeof listener !== "function") {
      warn(["listener must be a function"]);
    }

    this.#createCache(key);

    const listeners = this.#cache[key].listeners;

    listeners.add(listener);

    return () => listeners.delete(listener);
  }

  set(object: Record<string, any>) {
    if (typeof object !== "object") return;

    Object.entries(object).forEach(([key, value]) => {
      this.#createCache(key);
      this.#cache[key].value = value;
      this.#notify(key);
    });
  }

  get(key: string) {
    return this.#cache?.[key]?.value;
  }

  #notify(key: string) {
    const listeners = this.#cache[key].listeners;
    const state = this.#cache[key].value;

    listeners.forEach((listener) => listener(state));
  }

  isValid(key: string) {
    return typeof this.#cache[key] !== "undefined";
  }
}

export const observer = new Observer();

function warn(message: string[]) {
  console.warn(message.join("\n"));
}
