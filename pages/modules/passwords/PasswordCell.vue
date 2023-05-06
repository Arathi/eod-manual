<script setup lang="ts">
  import { computed, inject } from "vue";
  
  const DefaultHeight = 60;
  
  const props = defineProps<{
    index: number;
    letter: string;
    height?: number;
  }>();
  const words = inject<string[]>('words');
  
  const height = computed(() => {
    if (props.height != undefined) return props.height;
    return DefaultHeight;
  });
  
  const fontSize = computed(() => {
    return height.value * 0.75;
  });
  
  const bgc = computed(() => {
    const lower = props.letter.toLowerCase();
    if (lower == ' ') return 'royalblue';
    for (let word of words) {
      const c = word[props.index];
      if (c == lower) return undefined;
    }
    return 'pink';
  });
</script>

<template>
  <view class="password-cell">
    <text>{{ letter.toUpperCase() }}</text>
  </view>
</template>

<style scoped>
  .password-cell {
    border: solid 2rpx black;
    font-size: v-bind(fontSize + 'rpx');
    align-items: center;
    text-align: center;
    height: v-bind(height + 'rpx');
    background-color: v-bind(bgc);
  }
</style>