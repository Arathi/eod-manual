<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import MazeCell from './MazeCell.vue';
  import { MazeCellData, MazeCellType, MazeSize } from './defines';

  const cells = ref<MazeCellData[]>([]);

  onMounted(() => {
    cells.value = [];
    for (let y = 0; y < MazeSize; y++) {
      for (let x = 0; x < MazeSize; x++) {
        cells.value.push({
          x: x,
          y: y,
          type: MazeCellType.none,
          eastPassable: Math.random() > 0.5,
          southPassable: Math.random() > 0.5,
        } as MazeCellData);
      }
    }
  });
</script>

<template>
  <view class="maze-view">
    <uni-row>
      <template v-for="mcd in cells">
        <uni-col :span="4">
          <MazeCell :data="mcd"></MazeCell>
        </uni-col>
      </template>
    </uni-row>
  </view>
</template>

<style scoped>
  .maze-view {
    margin: 12rpx;
    border: solid 10rpx black;
  }
</style>