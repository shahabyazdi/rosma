export type Modal = {
  id?: number;
  title: string;
  body: string;
};

type State = {
  modals: Array<Modal>;
  time: string;
  time2: string;
  myVar: Date;
  random1: number;
  random2: number;
  translate: (key: string) => string;
  isSidebarActive: boolean;
  lang: 'js' | 'ts';
};

type Statics = {
  newModal: (modal: Modal) => void;
  closeModal: (id: number) => void;
};

declare module 'rosma' {
  interface GlobalState extends State {}
  interface GlobalStatics extends Statics {}
}
