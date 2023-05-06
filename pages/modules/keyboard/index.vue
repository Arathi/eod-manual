<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import keyboardImage from "@/assets/keyboard.png";
  import UndSection from '@/components/Section.vue';
  
  const columnNames = ['A', 'B', 'C', 'D', 'E', 'F'];
  const keySize = ref(window.innerWidth * 0.135);
  
  const XList = [153, 399, 644, 889, 1135, 1380];
  const YList = [512, 665, 817, 970, 1122, 1275, 1428];
  const Same = {
    // --- A ---
    "A1": "B2",
    "A3": "C6",
    "A5": "D4",
    "A6": "B6",
    "A7": "B3",
    // --- B ---
    "B1": "F2",
    "B4": "C3",
    "B5": "C7",
    "B7": "D6",
    // --- C ---
    "C4": "D5",
    // --- D ---
    "D1": "F1",
    "D2": "E5",
    "D3": "E3",
    "D7": "E2",
    // --- E ---
    "E1": "F5",
  };
  
  let Alias: any = {}
  for (let key in Same) {
    let value = Same[key];
    Alias[value] = key;
  }
  // Alias = {...Same, ...Alias};
  
  onMounted(() => {
    createCanvasAll();
  });
  
  function createCanvasAll() {
    for (let x = 1; x <= 6; x++) {
      for (let y = 1; y <= 7; y++) {
        createCanvas(x, y);
      }
    }
    repaintAll();
  }
  
  const canvasContexts = new Map<string, UniApp.CanvasContext>();
  function createCanvas(x: number, y: number) {
    const keyId = `${columnNames[x-1]}${y}`;
    const canvasId = `key-canvas-${keyId}`;
    // console.info(`正在创建`, canvasId);
    const ctx = uni.createCanvasContext(canvasId);
    canvasContexts.set(keyId, ctx);
  }
  
  function repaintAll() {
    for (let x = 1; x <= 6; x++) {
      for (let y = 1; y <=7; y++) {
        repaint(x, y);
      }
    }
  }
  
  function repaint(x: number, y: number) {
    const keyId = `${columnNames[x-1]}${y}`;
    const canvasId = `key-canvas-${keyId}`;
    // console.info(`正在重绘`, canvasId);
    const ctx = canvasContexts.get(keyId);
    ctx.drawImage(keyboardImage, XList[x-1], YList[y-1], 150, 150, 0, 0, keySize.value, keySize.value);
    let alpha = ctx.globalAlpha;
    
    if (isDisabled(x, y)) {
      ctx.setFillStyle('black');
      ctx.setGlobalAlpha(0.8);
      ctx.fillRect(0, 0, keySize.value, keySize.value);
    }
    
    ctx.draw();
    ctx.setGlobalAlpha(alpha);
  }
  
  function isDisabled(x: number, y: number) : boolean {
    const columnName = columnNames[x-1];
    const keyId = `${columnName}${y}`;
    return false;
  }
  
  const selected = ref<Set<string>>(new Set<string>());
  
  function onClick(x: number, y: number) {
    let keyId = `${columnNames[x-1]}${y}`;
    console.info(`点击按键 ${keyId}`);
    let index = Object.keys(Alias).findIndex((key) => key == keyId);
    if (index >= 0) {
      console.info("按键存在别名：", Alias[keyId]);
      keyId = Alias[keyId];
    }
    selected.value.add(keyId);
    repaintAll();
  }
</script>

<template>
  <und-section title="键盘" ></und-section>
  <view class="keyboard-view">
    <uni-row :gutter="24">
      <template v-for="x in 6">
        <uni-col :span="4">
          <template v-for="y in 7">
            <canvas 
              class="key-canvas"
              :canvas-id="`key-canvas-${columnNames[x-1]}${y}`"
              @click="onClick(x, y)"
            />
          </template>
        </uni-col>
      </template>
    </uni-row>
  </view>
  <und-section title="已选">
    <view v-for="keyId in selected">
      {{ keyId }}
    </view>
  </und-section>
</template>

<style scoped>
  .keyboard-view {
    margin: 10rpx;
  }
  
  .key-image {
    width: 150px;
    height: 150px;
    clip: rect(512, 304, 661, 153);
  }
  
  .key-canvas {
    width: v-bind(keySize + 'px');
    height: v-bind(keySize + 'px');
    border: solid 1px black;
  }
</style>