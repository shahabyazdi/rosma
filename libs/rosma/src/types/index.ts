export type Listener = (value: any) => void;

export type CacheData = {
  setter?: string;
  getter?: string;
  value?: any;
  listeners?: Set<Listener>;
};

export type WithSetters<T> = T extends object
  ? {
      [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
    } & T
  : T;
