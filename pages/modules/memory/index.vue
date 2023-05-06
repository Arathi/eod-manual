<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useBombStore } from '@/stores/BombStore';
  import UndSection from '@/components/Section.vue';
  import UndRow from '@/components/UndRow.vue';

  const bombStore = useBombStore();

  interface StepData {
    display : number;
    keys : number[];
    answerIndex ?: number;
    answerValue ?: number;
  }

  const step = ref<number>(0);
  const inputIndex = ref<number>(0);
  const stepDatas = ref<StepData[]>([{
    display: 0,
    keys: [0, 0, 0, 0],
  } as StepData]);

  function inputNumber(value : number) {
    switch (inputIndex.value) {
      case 0:
        stepDatas.value[step.value].display = value;
        break;
      case 1:
      case 2:
      case 3:
      case 4:
        let keyIndex = inputIndex.value - 1;
        stepDatas.value[step.value].keys[keyIndex] = value;
        break;
    }
    inputIndex.value++;
    if (inputIndex.value >= 5) {
      // 输入结束，计算answerIndex和answerValue
      switch (step.value) {
        case 0:
          step1();
          break;
        case 1:
          step2();
          break;
        case 2:
          step3();
          break;
        case 3:
          step4();
          break;
        case 4:
          step5();
          break;
      }

      // 进入下一阶段
      const stepData = {
        display: 0,
        keys: [0, 0, 0, 0],
      } as StepData;
      stepDatas.value.push(stepData);
      step.value++;
      inputIndex.value = 0;
    }
  }

  function step1() {
    const stepData = stepDatas.value[0];
    let keyIndex = 0;
    // 如果显示的是 1 ，按下第二个位置的按钮。
    // 如果显示的是 2 ，按下第二个位置的按钮。
    // 如果显示的是 3 ，按下第三个位置的按钮。
    // 如果显示的是 4 ，按下第四个位置的按钮。
    switch (stepData.display) {
      case 1:
        keyIndex = 2;
        break;
      case 2:
        keyIndex = 2;
        break;
      case 3:
        keyIndex = 3;
        break;
      case 4:
        keyIndex = 4;
        break;
    }
    stepData.answerIndex = keyIndex;
    stepData.answerValue = stepData.keys[keyIndex - 1];
  }

  function step2() {
    const stepData = stepDatas.value[1];
    const stepData1 = stepDatas.value[0];
    let keyIndex = 0;
    // 如果显示的是 1 ，按下数字为“4”的按钮。
    // 如果显示的是 2 ，按下和阶段 1 中你所按下的按钮【位置相同】的按钮。
    // 如果显示的是 3 ，按下第一个位置的按钮。
    // 如果显示的是 4 ，按下和阶段 1 中你所按下的按钮【位置相同】的按钮。
    switch (stepData.display) {
      case 1:
        keyIndex = stepData.keys.findIndex((v) => v == 4) + 1;
        break;
      case 2:
        keyIndex = stepData1.answerIndex;
        break;
      case 3:
        keyIndex = 1;
        break;
      case 4:
        keyIndex = stepData1.answerIndex;
        break;
    }
    stepData.answerIndex = keyIndex;
    stepData.answerValue = stepData.keys[keyIndex - 1];
  }

  function step3() {
    const stepData = stepDatas.value[2];
    const stepData1 = stepDatas.value[0];
    const stepData2 = stepDatas.value[1];
    let keyIndex = 0;
    // 如果显示的是 1 ，按下和阶段 2 中你所按下的按钮【数字相同】的按钮。
    // 如果显示的是 2 ，按下和阶段 1 中你所按下的按钮【数字相同】的按钮。
    // 如果显示的是 3 ，按下第三个位置的按钮。
    // 如果显示的是 4 ，按下数字为“4”的按钮。
    switch (stepData.display) {
      case 1:
        keyIndex = stepData.keys.findIndex((v) => v == stepData2.answerValue) + 1;
        break;
      case 2:
        keyIndex = stepData.keys.findIndex((v) => v == stepData1.answerValue) + 1;
        break;
      case 3:
        keyIndex = 3;
        break;
      case 4:
        keyIndex = stepData.keys.findIndex((v) => v == 4) + 1;
        break;
    }
    stepData.answerIndex = keyIndex;
    stepData.answerValue = stepData.keys[keyIndex - 1];
  }

  function step4() {
    const stepData = stepDatas.value[3];
    const stepData1 = stepDatas.value[0];
    const stepData2 = stepDatas.value[1];
    
    let keyIndex = 0;
    // 如果显示的是 1 ，按下和阶段 1 中你所按下的按钮位置相同的按钮。
    // 如果显示的是 2 ，按下第一个位置的按钮。
    // 如果显示的是 3 ，按下和阶段 2 中你所按下的按钮位置相同的按钮。
    // 如果显示的是 4 ，按下和阶段 2 中你所按下的按钮位置相同的按钮。
    switch (stepData.display) {
      case 1:
        keyIndex = stepData1.answerIndex;
        break;
      case 2:
        keyIndex = 1;
        break;
      case 3:
        keyIndex = stepData2.answerIndex;
        break;
      case 4:
        keyIndex = stepData2.answerIndex;
        break;
    }
    
    stepData.answerIndex = keyIndex;
    stepData.answerValue = stepData.keys[keyIndex - 1];
  }
  function step5() {
    const stepData = stepDatas.value[4];
    const stepData1 = stepDatas.value[0];
    const stepData2 = stepDatas.value[1];
    const stepData3 = stepDatas.value[2];
    const stepData4 = stepDatas.value[3];
    
    let keyIndex = 0;
    // 如果显示的是 1 ，按下和阶段 1 中你所按下的按钮数字相同的按钮。
    // 如果显示的是 2 ，按下和阶段 2 中你所按下的按钮数字相同的按钮。
    // 如果显示的是 3 ，按下和阶段 4 中你所按下的按钮数字相同的按钮。
    // 如果显示的是 4 ，按下和阶段 3 中你所按下的按钮数字相同的按钮。
    switch (stepData.display) {
      case 1:
        keyIndex = stepData.keys.findIndex((v) => v == stepData1.answerValue) + 1;
        break;
      case 2:
        keyIndex = stepData.keys.findIndex((v) => v == stepData2.answerValue) + 1;
        break;
      case 3:
        keyIndex = stepData.keys.findIndex((v) => v == stepData4.answerValue) + 1;
        break;
      case 4:
        keyIndex = stepData.keys.findIndex((v) => v == stepData3.answerValue) + 1;
        break;
    }
    
    stepData.answerIndex = keyIndex;
    stepData.answerValue = stepData.keys[keyIndex - 1];
  }
</script>

<template>
  <und-section title="模块信息">
    <view class="memoryModule">
      <uni-row>
        <uni-col :offset="4" :span="16">
          <view class="display">{{stepDatas[step].display}}</view>
        </uni-col>
      </uni-row>
      <uni-row :gutter="4">
        <uni-col :offset="4" :span="4">
          <view class="keys">
            {{stepDatas[step].keys[0]}}
          </view>
        </uni-col>
        <uni-col :span="4">
          <view class="keys">
            {{stepDatas[step].keys[1]}}
          </view>
        </uni-col>
        <uni-col :span="4">
          <view class="keys">
            {{stepDatas[step].keys[2]}}
          </view>
        </uni-col>
        <uni-col :span="4">
          <view class="keys">
            {{stepDatas[step].keys[3]}}
          </view>
        </uni-col>
      </uni-row>
    </view>
  </und-section>
  <und-section title="数据输入">
    <view class="memoryModule">
      <uni-row :gutter="4">
        <uni-col :span="4" :offset="4">
          <button @click="inputNumber(1)">1</button>
        </uni-col>
        <uni-col :span="4">
          <button @click="inputNumber(2)">2</button>
        </uni-col>
        <uni-col :span="4">
          <button @click="inputNumber(3)">3</button>
        </uni-col>
        <uni-col :span="4">
          <button @click="inputNumber(4)">4</button>
        </uni-col>
      </uni-row>
    </view>
  </und-section>
  <und-section title="历史">
    <uni-row :gutter="2">
      <uni-col :span="3">步骤</uni-col>
      <uni-col :span="3">显示</uni-col>
      <uni-col :span="3">按键1</uni-col>
      <uni-col :span="3">按键2</uni-col>
      <uni-col :span="3">按键3</uni-col>
      <uni-col :span="3">按键4</uni-col>
      <uni-col :span="3">位置</uni-col>
      <uni-col :span="3">数值</uni-col>
    </uni-row>
    <template v-for="(stepData, index) in stepDatas">
      <uni-row :gutter="2">
        <uni-col :span="3">{{index+1}}</uni-col>
        <uni-col :span="3">
          {{stepData.display > 0 ? stepData.display : ""}}
        </uni-col>
        <uni-col :span="3">
          {{stepData.keys[0] > 0 ? stepData.keys[0] : ""}}
        </uni-col>
        <uni-col :span="3">
          {{stepData.keys[1] > 0 ? stepData.keys[1] : ""}}
        </uni-col>
        <uni-col :span="3">
          {{stepData.keys[2] > 0 ? stepData.keys[2] : ""}}
        </uni-col>
        <uni-col :span="3">
          {{stepData.keys[3] > 0 ? stepData.keys[3] : ""}}
        </uni-col>
        <uni-col :span="3">
          {{stepData.answerIndex != undefined ? stepData.answerIndex : ""}}
        </uni-col>
        <uni-col :span="3">
          {{stepData.answerValue != undefined ? stepData.answerValue : ""}}
        </uni-col>
      </uni-row>
    </template>
  </und-section>
</template>

<style scoped>
  .memoryModule {
    margin: 16rpx;
  }

  .display {
    background-color: black;
    color: white;
    text-align: center;
    font-size: 150rpx;
    height: 200rpx;
    margin-bottom: 5rpx;
  }

  .keys {
    border: solid 2px black;
    text-align: center;
    font-size: 75rpx;
    height: 100rpx;
  }
</style>