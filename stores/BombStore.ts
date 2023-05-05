import { defineStore } from 'pinia';

export enum SeqLastType {
  none = 0,
  odd = 1,
  even = 2,
  char = 3,
}

export type Indicator =
  "SND" |
  "CLR" |
  "CAR" |
  "IND" |
  "FRQ" |
  "SIG" |
  "NSA" |
  "MSA" |
  "TRN" |
  "BOB" |
  "FRK";

interface State {
  // 序列号
  sequence : string;
  _seqLastType : SeqLastType;
  _seqHasVowel: boolean;

  // 电池数量
  cellAmount : number;

  // 标签指示灯
  indicators : Indicator[];
  
  // 失误次数
  errorCount: number;
}

export const useBombStore = defineStore('bomb', {
  state: () : State => ({
    // 序列号
    sequence: "",
    _seqLastType: SeqLastType.none,
    _seqHasVowel: false,

    // 电池数量
    cellAmount: -1,
    
    // 标签
    indicators: [],
    
    // 失误次数
    errorCount: 0,
  }),

  getters: {
    seqLastType: (state : State) => {
      if (state.sequence.length > 0) {
        const lastChar = state.sequence[state.sequence.length - 1];
        const num = Number(lastChar);
        if (!isNaN(num)) {
          if (num % 2 == 0) return SeqLastType.even;
          return SeqLastType.odd;
        }
        return SeqLastType.char;
      }
      return state._seqLastType;
    },
    
    seqHasVowel: (state: State) => {
      if (state.sequence.length > 0) {
        const upper = state.sequence.toUpperCase();
        let index = upper.indexOf('A');
        if (index >= 0) return true;
        index = upper.indexOf('E');
        if (index >= 0) return true;
        index = upper.indexOf('I');
        if (index >= 0) return true;
        index = upper.indexOf('O');
        if (index >= 0) return true;
        index = upper.indexOf('U');
        if (index >= 0) return true;
        return false;
      }
      return state._seqLastType;
    },
    
    CAR: (state: State) => {
      const index = state.indicators.findIndex((label: Indicator) => label == 'CAR');
      return index >= 0;
    },
    FRK: (state: State) => {
      const index = state.indicators.findIndex((label: Indicator) => label == 'FRK');
      return index >= 0;
    },
  },
  
  actions: {
    toggleIndicator(indicator: Indicator) {
      const index = this.indicators.findIndex((i: Indicator) => i == indicator);
      if (index >= 0) {
        this.indicators.splice(index, 1);
      }
      else {
        this.indicators.push(indicator);
      }
    }
  }
});