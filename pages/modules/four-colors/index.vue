<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useBombStore } from '@/stores/BombStore';
  import UndSection from '@/components/Section.vue';
  import UndRow from '@/components/UndRow.vue';
  
  const bombStore = useBombStore();
  
  // 标签宽度
  const labelWidth = ref(180);
  
  const ErrorCountDatas = [
    { value: 0, text: "无失误" },
    { value: 1, text: "1次失误" },
    { value: 2, text: "2次失误" },
  ];
  
  const SeqVoewlDatas = [
    { value: 0, text: "不含元音" },
    { value: 1, text: "包含元音" },
  ];
  const seqHasVowel = computed({
    get() {
      return bombStore.seqHasVowel ? 1 : 0;
    },
    set(value: number) {
      bombStore._seqHasVowel = value != 0;
    }
  });
  const seqHasVowelDisabled = computed(() => bombStore.sequence.length > 0);
  
  enum BlockColor {
    blue,
    yellow,
    green,
    red
  }
  
  const screenWidth = ref(window.innerWidth);
  const blockWidth = computed(() => screenWidth.value / 4);
  const halfHeightBlockWidth = computed(() => screenWidth.value * 0.1);
  const actionBlockWidth = computed(() => (screenWidth.value - 32) / 8);
  
  // 闪光顺序
  const flashColors = ref<BlockColor[]>([]);
  
  function onClick(color: BlockColor) {
    console.info("点击按钮：", BlockColor[color]);
    flashColors.value.push(color);
  }
  
  const actions = computed(() => {
    const actionColors: BlockColor[] = [];
    for (let flashColor of flashColors.value) {
      if (bombStore.seqHasVowel) {
        //   红 蓝 绿 黄
        // 0 蓝 红 黄 绿
        if (bombStore.errorCount == 0) {
          switch (flashColor) {
            case BlockColor.red:
              actionColors.push(BlockColor.blue);
              break;
            case BlockColor.blue:
              actionColors.push(BlockColor.red);
              break;
            case BlockColor.green:
              actionColors.push(BlockColor.yellow);
              break;
            case BlockColor.yellow:
              actionColors.push(BlockColor.green);
              break;
          }
        }
        // 1 黄 绿 蓝 红
        else if (bombStore.errorCount == 1) {
          switch (flashColor) {
            case BlockColor.red:
              actionColors.push(BlockColor.yellow);
              break;
            case BlockColor.blue:
              actionColors.push(BlockColor.green);
              break;
            case BlockColor.green:
              actionColors.push(BlockColor.blue);
              break;
            case BlockColor.yellow:
              actionColors.push(BlockColor.red);
              break;
          }
        }
        // 2 绿 红 黄 蓝
        else if (bombStore.errorCount == 2) {
          switch (flashColor) {
            case BlockColor.red:
              actionColors.push(BlockColor.green);
              break;
            case BlockColor.blue:
              actionColors.push(BlockColor.red);
              break;
            case BlockColor.green:
              actionColors.push(BlockColor.yellow);
              break;
            case BlockColor.yellow:
              actionColors.push(BlockColor.blue);
              break;
          }
        }
      }
      else {
        //   红 蓝 绿 黄
        // 0 蓝 黄 绿 红
        if (bombStore.errorCount == 0) {
          switch (flashColor) {
            case BlockColor.red:
              actionColors.push(BlockColor.blue);
              break;
            case BlockColor.blue:
              actionColors.push(BlockColor.yellow);
              break;
            case BlockColor.green:
              actionColors.push(BlockColor.green);
              break;
            case BlockColor.yellow:
              actionColors.push(BlockColor.red);
              break;
          }
        }
        // 1 红 蓝 黄 绿
        else if (bombStore.errorCount == 1) {
          switch (flashColor) {
            case BlockColor.red:
              actionColors.push(BlockColor.red);
              break;
            case BlockColor.blue:
              actionColors.push(BlockColor.blue);
              break;
            case BlockColor.green:
              actionColors.push(BlockColor.yellow);
              break;
            case BlockColor.yellow:
              actionColors.push(BlockColor.green);
              break;
          }
        }
        // 2 黄 绿 蓝 红
        else if (bombStore.errorCount == 2) {
          switch (flashColor) {
            case BlockColor.red:
              actionColors.push(BlockColor.yellow);
              break;
            case BlockColor.blue:
              actionColors.push(BlockColor.green);
              break;
            case BlockColor.green:
              actionColors.push(BlockColor.blue);
              break;
            case BlockColor.yellow:
              actionColors.push(BlockColor.red);
              break;
          }
        }
      }
    }
    return actionColors;
  });
</script>

<template>
  <und-section title="全局信息">
    <und-row title="序列号元音" :title-width="labelWidth">
      <uni-data-select 
        v-model="seqHasVowel" 
        :localdata="SeqVoewlDatas" 
        :clear="false"
        :disabled="seqHasVowelDisabled"
      />
    </und-row>
    <und-row title="失误次数" :title-width="labelWidth" :margin-bottom="0">
      <uni-data-select 
        v-model="bombStore.errorCount" 
        :localdata="ErrorCountDatas" 
        :clear="false"
      />
    </und-row>
  </und-section>
  <und-section title="模块信息">
    <view class="buttons">
      <uni-row>
        <uni-col><view class="half-height-block"></view></uni-col>
      </uni-row>
      <uni-row>
        <uni-col :span="6" :offset="6">
          <view class="block block-blue" @click="onClick(BlockColor.blue)"></view>
        </uni-col>
        <uni-col :span="6">
          <view class="block block-yellow" @click="onClick(BlockColor.yellow)"></view>
        </uni-col>
      </uni-row>
      <uni-row>
        <uni-col :span="6" :offset="6">
          <view class="block block-red" @click="onClick(BlockColor.red)"></view>
        </uni-col>
        <uni-col :span="6">
          <view class="block block-green" @click="onClick(BlockColor.green)"></view>
        </uni-col>
      </uni-row>
      <uni-row>
        <uni-col><view class="half-height-block"></view></uni-col>
      </uni-row>
    </view>
  </und-section>
  <und-section title="闪光顺序" type="line">
    <uni-row :gutter="3">
      <uni-col :span="3" v-for="color in flashColors">
        <view :class="`action-block block-${BlockColor[color]}`"></view>
      </uni-col>
    </uni-row>
  </und-section>
  <und-section title="点击顺序" type="line">
    <uni-row :gutter="3">
      <uni-col :span="3" v-for="action in actions">
        <view :class="`action-block block-${BlockColor[action]}`"></view>
      </uni-col>
    </uni-row>
  </und-section>
</template>

<style scoped>
  .buttons {
    transform: rotate(45deg);
  }
  
  .block {
    height: v-bind(blockWidth + 'px');
  }
  
  .half-height-block {
    height: v-bind(halfHeightBlockWidth + 'px');
  }
  
  .action-block {
    height: v-bind(actionBlockWidth + 'px');
  }
  
  .block-blue {
    background-color: blue;
  }
  .block-yellow {
    background-color: yellow;
  }
  .block-green {
    background-color: green;
  }
  .block-red {
    background-color: red;
  }
</style>