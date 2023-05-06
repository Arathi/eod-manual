<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue';
  import { WireColor, ConnectPoint, WireStatus } from './defines';
  import WireConnect from './WireConnect.vue';
  import { useWireSequencesStore } from '@/stores/WireSequencesStore';

  const store = useWireSequencesStore();
  
  onMounted(() => {
    store.init();
  });

  const actions = ref<string[]>([
    '',
    '',
    '',
    ''
  ]);

  function actionRedWire(index : number, count : number, connectTo : ConnectPoint) : string | null {
    let cut = false;
    switch (count) {
      case 1:
        if (connectTo == "C") cut = true;
        break;
      case 2:
        if (connectTo == "B") cut = true;
        break;
      case 3:
        if (connectTo == "A") cut = true;
        break;
      case 4:
        if (connectTo == "A" || connectTo == "C") cut = true;
        break;
      case 5:
        if (connectTo == "B") cut = true;
        break;
      case 6:
        if (connectTo == "A" || connectTo == "C") cut = true;
        break;
      case 7:
        if (connectTo == "A" || connectTo == "B" || connectTo == "C") cut = true;
        break;
      case 8:
        if (connectTo == "A" || connectTo == "B") cut = true;
        break;
      case 9:
        if (connectTo == "B") cut = true;
        break;
    }

    if (cut) {
      console.warn(`${index + 1}号线，第${count}根红线，连接到${connectTo}，剪断`);
      store.setWireStatus(index, WireStatus.cut);
      return `剪断${index + 1}`;
    }

    store.setWireStatus(index, WireStatus.nop);
    return null;
  }

  function actionBlueWire(index : number, count : number, connectTo : ConnectPoint) : string | null {
    let cut = false;
    switch (count) {
      case 1:
        if (connectTo == "B") cut = true;
        break;
      case 2:
        if (connectTo == "A" || connectTo == "C") cut = true;
        break;
      case 3:
        if (connectTo == "B") cut = true;
        break;
      case 4:
        if (connectTo == "A") cut = true;
        break;
      case 5:
        if (connectTo == "B") cut = true;
        break;
      case 6:
        if (connectTo == "B" || connectTo == "C") cut = true;
        break;
      case 7:
        if (connectTo == "C") cut = true;
        break;
      case 8:
        if (connectTo == "A" || connectTo == "C") cut = true;
        break;
      case 9:
        if (connectTo == "A") cut = true;
        break;
    }

    if (cut) {
      console.warn(`${index + 1}号线，第${count}根蓝线，连接到${connectTo}，剪断`);
      store.setWireStatus(index, WireStatus.cut);
      return `剪断${index + 1}`;
    }

    store.setWireStatus(index, WireStatus.nop);
    return null;
  }

  function actionBlackWire(index : number, count : number, connectTo : ConnectPoint) : string | null {
    let cut = false;
    switch (count) {
      case 1:
        if (connectTo == "A" || connectTo == "B" || connectTo == "C") cut = true;
        break;
      case 2:
        if (connectTo == "A" || connectTo == "C") cut = true;
        break;
      case 3:
        if (connectTo == "B") cut = true;
        break;
      case 4:
        if (connectTo == "A" || connectTo == "C") cut = true;
        break;
      case 5:
        if (connectTo == "B") cut = true;
        break;
      case 6:
        if (connectTo == "B" || connectTo == "C") cut = true;
        break;
      case 7:
        if (connectTo == "A" || connectTo == "B") cut = true;
        break;
      case 8:
        if (connectTo == "C") cut = true;
        break;
      case 9:
        if (connectTo == "C") cut = true;
        break;
    }

    if (cut) {
      console.warn(`${index + 1}号线，第${count}根黑线，连接到${connectTo}，剪断`);
      store.setWireStatus(index, WireStatus.cut);
      return `剪断${index + 1}`;
    }

    store.setWireStatus(index, WireStatus.nop);
    return null;
  }
  
  const generateDisabled = computed(() => {
    for (let moduleIndex = 1; moduleIndex <= store.step; moduleIndex++) {
      for (let wiom = 0; wiom < 3; wiom++) {
        const wireIndex = (moduleIndex - 1) * 3 + wiom;
        const wireColor = store.wireColors[wireIndex];
        const connectTo = store.connectToList[wireIndex];
        if (wireColor != WireColor.none && connectTo == null) {
          return true;
        }
      }
    }
    return false;
  });

  function generateActions() {
    let redCounter = 0;
    let blueCounter = 0;
    let blackCounter = 0;

    for (let moduleIndex = 1; moduleIndex <= store.step; moduleIndex++) {
      let actionList : string[] = [];
      for (let wiom = 0; wiom < 3; wiom++) {
        const wireIndex = (moduleIndex - 1) * 3 + wiom;
        const wireColor = store.wireColors[wireIndex];

        let action : string | null = null;
        switch (wireColor) {
          case WireColor.red:
            redCounter++;
            action = actionRedWire(wireIndex, redCounter, store.connectToList[wireIndex]);
            if (action != null) actionList.push(action);
            break;
          case WireColor.blue:
            blueCounter++;
            action = actionBlueWire(wireIndex, blueCounter, store.connectToList[wireIndex]);
            if (action != null) actionList.push(action);
            break;
          case WireColor.black:
            blackCounter++;
            action = actionBlackWire(wireIndex, blackCounter, store.connectToList[wireIndex]);
            if (action != null) actionList.push(action);
            break;
        }
      }

      let merged = actionList.join(",");
      if (merged.length == 0) {
        merged = "跳过";
      }
      actions.value[moduleIndex - 1] = merged;
    }

    store.nextStep();
  }
  
  function reset() {
    store.init();
  }
</script>

<template>
  <uni-section title="模块信息" type="line">
    <view class="module">
      <template v-for="i in store.step">
        <wire-connect :index="(i-1)*3+0" />
        <wire-connect :index="(i-1)*3+1" />
        <wire-connect :index="(i-1)*3+2" />
        <!--
        <uni-forms-item :label="`模块${i}操作：`" :label-width="labelWidth">
          <view>{{ actions[i-1] }}</view>
        </uni-forms-item>
        -->
        <view class="divider" />
      </template>
      
      <uni-row :gutter="10">
        <uni-col :span="12">
          <button @click="reset" type="warn">重置</button>
        </uni-col>
        <uni-col :span="12">
          <button 
            @click="generateActions" 
            type="primary"
            :disabled="generateDisabled"
          >
            确定线序
          </button>
        </uni-col>
      </uni-row>
    </view>
  </uni-section>
</template>

<style scoped>
  .module {
    margin: 16rpx;
  }

  .uni-forms-item {
    margin-bottom: 4rpx;
  }
  
  .divider {
    background-color: #e0e3da;
    width: 100%;
    height: 1rpx;
    margin: 7rpx;
  }
</style>