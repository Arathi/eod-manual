<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { WireColor, WireStatus } from './defines';
  import { useWireSequencesStore } from '@/stores/WireSequencesStore';
  
  const labelWidth = ref(220);
  const labelMarginTop = ref(15);
  const store = useWireSequencesStore();
  
  const props = defineProps<{
    index: number;
  }>();
  
  const WireColorDatas = [
    { value: WireColor.red, text: "红色" },
    { value: WireColor.blue, text: "蓝色" },
    { value: WireColor.black, text: "黑色" },
  ];
  
  const ConnectPointDatas = [
    { value: "A", text: "A" },
    { value: "B", text: "B" },
    { value: "C", text: "C" },
  ];
  
  const wireColor = computed({
    get() {
      return store.wireColors[props.index];
    },
    set(value) {
      if (value == "") {
        value = WireColor.none;
        store.setConnectPoint(props.index, null);
        store.setWireStatus(props.index, WireStatus.pending);
      }
      store.setWireColor(props.index, value);
    }
  });
  
  const connectTo = computed({
    get() {
      return store.connectToList[props.index];
    },
    set(value) {
      if (value == "") value = null;
      store.setConnectPoint(props.index, value);
    }
  });
  
  const cut = computed(() => {
    return store.cuts[props.index];
  });
  
  const labelColor = computed(() => {
    if (cut.value == WireStatus.cut) return "cut";
    if (cut.value == WireStatus.nop) return "nop";
    return "";
  });
</script>

<template>
  <uni-forms-item>
    <uni-row :gutter="10">
      <uni-col :span="12">
        <uni-data-select 
          v-model="wireColor" 
          :localdata="WireColorDatas"
        />
      </uni-col>
      <uni-col :span="12">
        <uni-data-select 
          v-model="connectTo" 
          :localdata="ConnectPointDatas" 
          :disabled="wireColor == WireColor.none"
        />
      </uni-col>
    </uni-row>
    <template #label>
      <view class="form-label">
        <text :class="labelColor">{{ `线缆` + (index + 1) }}</text>
        <text :class="labelColor" v-if="cut == WireStatus.cut">（剪掉）</text>
        <!--
        <image class="label-icon" v-if="cut == WireStatus.cut" src="@/assets/cut.png"></image>
        <text v-if="cut == WireStatus.nop">（勿动）</text>
        -->
      </view>
    </template>
  </uni-forms-item>
</template>

<style scoped>
  .form-label {
    margin-top: v-bind(labelMarginTop + 'rpx');
    width: v-bind(labelWidth + "rpx");
  }
  
  .cut {
    color: red;
  }
  .nop {
    color: blue;
  }
  .label-icon {
    width: 16px;
    height: 16px;
  }
</style>