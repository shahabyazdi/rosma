export type Listener = (value: any) => void;

export type PartialValues<S, T> = Partial<S extends object ? S : T>;

export type ValuesSetter<S, T> = (
  state: S extends object ? S : T
) => PartialValues<S, T>;

export type ObserverValues<S, T> = PartialValues<S, T> | ValuesSetter<S, T>;

export type SetOptions = { silent?: boolean };

export type CacheData = {
  setter?: string;
  getter?: string;
  value?: any;
  listeners?: Set<Listener>;
};

export type Setter<T> = T | ((prev: T) => T);

export type StarOrKey<T> = '*' | T;

export type WithSetters<T> = T extends object
  ? {
      [K in keyof T as `set${Capitalize<string & K>}`]: (
        value: Setter<T[K]>
      ) => void;
    } & T & {
        set?: (
          values: ObserverValues<T, Record<string, any>>,
          options?: SetOptions
        ) => void;
      }
  : T;
