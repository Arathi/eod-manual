<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { MazeCellData, MazeCellType, MazeSize } from './defines';
  
  const props = defineProps<{
    data: MazeCellData;
  }>();
  
  const spaceColor = ref("gray");
  const wallColor = ref("black");
  
  const borderRight = computed(() => {
    let display = false;
    if (!props.data.eastPassable) display = true;
    if (props.data.x + 1 >= MazeSize) {
      display = false;
    }
    return `solid 1rpx ${display ? wallColor.value : spaceColor.value}`;
  });
  
  const borderBottom = computed(() => {
    let display = false;
    if (!props.data.southPassable) display = true;
    if (props.data.y + 1 >= MazeSize) {
      display = false;
    }
    return `solid 1rpx ${display ? wallColor.value : spaceColor.value}`;
  });
</script>

<template>
  <view class="maze-cell">
    {{ props.data.x }}, {{ props.data.y }}
  </view>
</template>

<style scoped>
  .maze-cell {
    background-color: v-bind(spaceColor);
    height: 120rpx;
    border-right: v-bind(borderRight);
    border-bottom: v-bind(borderBottom);
  }
</style>