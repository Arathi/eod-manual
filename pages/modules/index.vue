<script setup lang="ts">
</script>

<template>
  <uni-section title="常规模块" type="line" class="section">
    <view class="module-group">
      <uni-grid :column="4">
        <navigator url="wires/index">
          <uni-grid-item>
            <view>线路模块</view>
          </uni-grid-item>
        </navigator>
        <uni-grid-item>
          <view>按钮模块</view>
        </uni-grid-item>
        <uni-grid-item>
          <view>键盘模块</view>
        </uni-grid-item>
        <uni-grid-item>
          <view>四色方块</view>
        </uni-grid-item>
        <uni-grid-item>
          <view>他叫什么</view>
        </uni-grid-item>
        <uni-grid-item>
          <view>记忆模块</view>
        </uni-grid-item>
        <uni-grid-item>
          <view>摩斯电码</view>
        </uni-grid-item>
        <uni-grid-item>
          <view>复杂模块</view>
        </uni-grid-item>
        <uni-grid-item>
          <view>顺序线路</view>
        </uni-grid-item>
        <uni-grid-item>
          <view>迷宫模块</view>
        </uni-grid-item>
        <uni-grid-item>
          <view>密码模块</view>
        </uni-grid-item>
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