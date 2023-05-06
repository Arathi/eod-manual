import { defineStore } from 'pinia';
import { WireColor, ConnectPoint, WireStatus } from '@/pages/modules/wire-sequences/defines';

const StepAmount = 4;

interface State {
  step: number;
  wireColors: WireColor[];
  connectToList: ConnectPoint[];
  cuts: WireStatus[];
}

export const useWireSequencesStore = defineStore('wire-seq', {
  state: () => ({
    step: 0,
    wireColors: [],
    connectToList: [],
    cuts: [],
  }),
  
  actions: {
    init() {
      this.step = 1;
      this.wireColors = [];
      this.connectToList = [];
      this.cuts = [];
      for (let i = 0; i < 3 * StepAmount; i++) {
        this.wireColors.push(WireColor.none);
        this.connectToList.push(null);
        this.cuts.push(WireStatus.pending);
      }
    },
    
    nextStep() {
      if (this.step < 4) {
        this.step++;
      }
    },
    
    setWireColor(index: number, color: WireColor) {
      this.wireColors[index] = color;
    },
    
    setConnectPoint(index: number, connectTo: ConnectPoint) {
      this.connectToList[index] = connectTo;
    },
    
    setWireStatus(index: number, wireStatus: WireStatus) {
      this.cuts[index] = wireStatus;
    },
  },
});
