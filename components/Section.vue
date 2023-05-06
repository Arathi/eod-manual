<script setup lang="ts">
  import { computed } from 'vue';
  
  const defaultBodyPadding = 16;
  const defaultMarginBottom = 24;
  
  const props = defineProps<{
    title?: string;
    subTitle?: string;
    bodyPadding?: number;
    marginBottom?: number;
  }>();
  
  const bodyPadding = computed(() => {
    if (props.bodyPadding != undefined) {
      return props.bodyPadding;
    }
    return defaultBodyPadding;
  });
  
  const marginBottom = computed(() => {
    if (props.marginBottom != undefined) {
      return props.marginBottom;
    }
    return defaultMarginBottom;
  });
</script>

<template>
  <uni-section :title="title" :sub-title="subTitle" type="line">
    <view class="section-body">
      <slot></slot>
    </view>
  </uni-section>
</template>

<style scoped>
  .section-shell {
  }
  
  .section-body {
    padding-top: 0;
    padding-right: v-bind(bodyPadding + 'rpx');
    padding-bottom: v-bind(bodyPadding + 'rpx');
    padding-left: v-bind(bodyPadding + 'rpx');
    margin-bottom: v-bind(marginBottom + 'rpx');
    background-color: white;
  }
</style>