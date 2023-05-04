import { defineStore } from 'pinia';

export enum SeqLastType {
  none = 0,
  odd = 1,
  even = 2,
  char = 3,
}

type Indicator =
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

  // 电池数量
  cellAmount : number;

  // 标签指示灯
  indicators : Indicator[]
}

export const useBombStore = defineStore('bomb', {
  state: () : State => ({
    // 序列号
    sequence: "",
    _seqLastType: SeqLastType.none,

    // 电池数量
    cellAmount: -1,
    
    // 标签
    indicators: ['CAR'],
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