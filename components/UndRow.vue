<script setup lang="ts">
  import { computed } from "vue";
  const props = defineProps<{
    title ?: string;
    titleWidth ?: number;
    marginBottom ?: number;
  }>();
  
  const DefaultTitleWidth = 80;
  const DefaultMarginBottom = 8;

  const titleWidth = computed(() => {
    if (props.titleWidth != undefined) return props.titleWidth;
    return DefaultTitleWidth;
  });
  
  const marginBottom = computed(() => {
    if (props.marginBottom != undefined) return props.marginBottom;
    return DefaultMarginBottom;
  });
</script>

<template>
  <view class="container">
    <view class="title">
      <text>{{title}}</text>
    </view>
    <view class="content">
      <slot></slot>
    </view>
  </view>
</template>

<style scoped>
  .container {
    display: flex;
    align-items: center;
    margin-bottom: v-bind(marginBottom + 'rpx');
  }

  .title {
    width: v-bind(titleWidth + 'rpx');
  }

  .content {
    flex: 1;
  }
</style>