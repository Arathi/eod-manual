<script setup lang="ts">
  import { computed, inject } from "vue";
  import PasswordCell from "./PasswordCell.vue";
  
  const LettersLength = 6;
  
  const props = defineProps<{
    index: number;
    letters?: string;
  }>();
  const words = inject('words');
  
  const letterList = computed(() => {
    let letters = '';
    if (props.letters != undefined) {
      let padding = LettersLength - props.letters.length;
      if (padding < 0) padding = 0;
      if (padding > LettersLength) padding = LettersLength;
      letters = props.letters + " ".repeat(padding);
    }
    else {
      letters = " ".repeat(LettersLength);
    }
    return letters.split("");
  });
</script>

<template>
  <password-cell 
    v-for="i in LettersLength" 
    :index="props.index"
    :letter="letterList[i-1]" 
    :height="40"
  />
</template>

<style scoped>
</style>