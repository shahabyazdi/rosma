export type Listener = (value: any) => void;

export type CacheData = {
  setter?: string;
  getter?: string;
  value?: any;
  listeners?: Set<Listener>;
};

export type Setter<T> = T | ((prev: T) => T);

export type WithSetters<T> = T extends object
  ? {
      [K in keyof T as `set${Capitalize<string & K>}`]: (
        value: Setter<T[K]>
      ) => void;
    } & T
  : T;
