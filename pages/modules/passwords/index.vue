<script setup lang="ts">
  import { computed, ref, provide } from 'vue';
  import UndSection from '@/components/Section.vue';
  import UndRow from '@/components/Row.vue';
  import PasswordColumn from './PasswordColumn.vue';

  const words = [
    "about", "after", "again", "below", "could",
    "every", "first", "found", "great", "house",
    "large", "learn", "never", "other", "place",
    "plant", "point", "right", "small", "sound",
    "spell", "still", "study", "their", "there",
    "these", "thing", "think", "three", "water",
    "where", "which", "world", "would", "write",
  ];
  provide('words', words);

  const inputsVertical = ref(true);
  const inputs = ref<string[]>([
    "", "", "", "", ""
  ]);
  
  const matched = computed(() => {
    let pattern = "";
    for (let input of inputs.value) {
      if (input.trim() == "") {
        pattern += "[a-z]";
      }
      else {
        pattern += `[${input}]`;
      }
    }
    let regex = new RegExp(pattern);
    
    let results = [];
    for (let wordIndex in words) {
      const word = words[wordIndex];
      let result = regex.exec(word) != null;
      results.push(result);
    }
    return results;
  });
</script>

<template>
  <und-section title="模块信息">
    <template v-if="!inputsVertical">
      <template v-for="i in 5">
        <und-row :title="`第${i}格：`" :title-width="120" class="input-row">
          <uni-easyinput v-model="inputs[i-1]" type="text" maxlength="6" trim="all" />
        </und-row>
      </template>
    </template>
    
    <template v-if="inputsVertical">
      <view class="input-row">
        <view v-for="i in 5" class="input-col">
          <uni-easyinput 
            v-model="inputs[i-1]" 
            type="text" 
            maxlength="6"
            trim="all"
            :clearable="false"
          />
        </view>
      </view>
    </template>
  </und-section>
  <und-section title="筛选器">
    <uni-row :gutter="16">
      <template v-for="i in 5">
        <uni-col :span="4" :offset="(i == 1) ? 2 : 0">
          <password-column 
            :index="i-1"
            :letters="inputs[i-1]"
          />
        </uni-col>
      </template>
    </uni-row>
  </und-section>
  <und-section title="筛选结果">
    <uni-row>
      <uni-col 
        v-for="(word, index) in words" 
        :offset="index % 5 == 0 ? 2 : 0"
        :span="4"
      >
        <view :class="matched[index] ? '' : 'deleted'">{{ word }}</view>
      </uni-col>
    </uni-row>
  </und-section>
</template>

<style scoped>
  .input-row:last-child {
    margin-bottom: 0;
  }
  
  .results {
    display: flex;
  }
  
  .result {
    flex: 1;
  }
  
  .deleted {
    text-decoration: line-through;
  }
  
  .input-row {
    display: flex;
  }
  .input-col {
    flex: 1;
    padding: 2rpx;
  }
</style>