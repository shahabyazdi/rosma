export type State<T> = T & Record<string, any>;
export type Listener = (value: any) => void;

export type CacheData = {
  setter?: string;
  getter?: string;
  value?: any;
  listeners?: Set<Listener>;
};
