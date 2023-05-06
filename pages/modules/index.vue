<script setup lang="ts">
  import Module from '@/components/GridItem.vue';
</script>

<template>
  <uni-section title="常规模块" type="line" class="section">
    <view class="module-group">
      <uni-grid :column="4">
        <module url="wires/index" text="线路模块" />
        <module url="buttons/index" text="按钮模块" />
        <module url="keyboard/index" text="键盘模块" />
        <module url="four-colors/index" text="四色方块" />
        <module url="memory/index" text="记忆模块" />
        <module url="morse-code/index" text="摩斯电码" />
        <module url="wire-sequences/index" text="顺序线路" />
        <module url="mazes/index" text="迷宫模块" />
        <module url="passwords/index" text="密码模块" />
      </uni-grid>
    </view>
  </uni-section>
  <uni-section title="特需模块" type="line" class="section">
    <view class="module-group">
      <uni-grid :column="4">
        <uni-grid-item>
          <view>排气模块</view>
        </uni-grid-item>
        <uni-grid-item>
          <view>电容放电</view>
        </uni-grid-item>
        <uni-grid-item>
          <view>旋钮模块</view>
        </uni-grid-item>
      </uni-grid>
    </view>
  </uni-section>
</template>

<style scoped>
  .section {
    margin: 0 16rpx 16rpx 16rpx;
  }

  .module-group {
    margin: 0 16rpx 16rpx 16rpx;
  }
</style>