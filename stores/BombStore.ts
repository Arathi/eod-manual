import { defineStore } from 'pinia';

export enum SeqLastType {
  none = 0,
  odd = 1,
  even = 2,
  char = 3,
}

interface State {
  sequence: string;
  _seqLastType: SeqLastType;
}

export const useBombStore = defineStore('bomb', {
  state: (): State => ({
    sequence: "",
    _seqLastType: SeqLastType.none,
  }),
  
  getters: {
    seqLastType: (state: State) => {
      if (state.sequence.length > 0) {
        const lastChar = state.sequence[state.sequence.length-1];
        const num = Number(lastChar);
        if (!isNaN(num)) {
          if (num % 2 == 0) return SeqLastType.even;
          return SeqLastType.odd;
        }
        return SeqLastType.char;
      }
      return state._seqLastType;
    }
  },
});
