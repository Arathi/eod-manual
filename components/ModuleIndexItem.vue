<script setup lang="ts">
  const props = defineProps<{
    url?: string;
    icon?: string;
    text: string;
  }>();
</script>

<template>
  <navigator :url="props.url">
    <uni-grid-item>
      <view class="icon" v-if="props.icon != undefined">
        <image :src="props.icon"></image>
      </view>
      <view class="text">{{ props.text }}</view>
    </uni-grid-item>
  </navigator>
</template>

<style scoped>
</style>