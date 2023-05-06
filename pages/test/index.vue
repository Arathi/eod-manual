<script setup lang="ts">
  import UndSection from '@/components/Section.vue';
  import UndRow from '@/components/UndRow.vue';
</script>

<template>
  <uni-section title="标题" type="line" sub-title="副标题">
    <view class="color-block"></view>
  </uni-section>
  
  <und-section title="标题" :margin-bottom="0">
    <und-row title="123" :title-width="200">
      <uni-data-select></uni-data-select>
    </und-row>
    <und-row title="456" :title-width="200">
      <uni-data-select></uni-data-select>
    </und-row>
  </und-section>
  <und-section title="标题2" sub-title="副标题2" :margin-bottom="24">
    <view class="test-content"></view>
  </und-section>
  <und-section title="标题3" sub-title="副标题3">
    <view class="test-content"></view>
  </und-section>
</template>

<style scoped>
  .color-block {
    background-color: black;
    height: 100rpx;
    margin: 50rpx;
  }
  
  .test-content {
    background-color: black;
    height: 100rpx;
  }
</style>