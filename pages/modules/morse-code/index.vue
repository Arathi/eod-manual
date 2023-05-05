<script setup lang="ts">
  import { ref, computed } from 'vue';
  
  const words = {
    shell: 3.505,
    halls: 3.515,
    slick: 3.522,
    trick: 3.532,
    boxes: 3.535,
    leaks: 3.542,
    strobe: 3.545,
    bistro: 3.552,
    flick: 3.555,
    bombs: 3.565,
    break: 3.572,
    brick: 3.575,
    steak: 3.582,
    sting: 3.592,
    vector: 3.595,
    beats: 3.600
  };
  
  const alphabetToMorseCode = {
    // A-G
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    // H-N
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    // O-T
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    // U-Z
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
  };
  
  console.info("生成 摩斯电码-字母 码表如下：");
  const morseCodeToAlphabet: any = {};
  for (let key in alphabetToMorseCode) {
    let code = alphabetToMorseCode[key];
    morseCodeToAlphabet[code] = key.toLowerCase();
    console.info(`${code} => ${key.toLowerCase()}`);
  }
  
  type MorseCodeSymbol = "." | "-";
  
  const currentCode = ref<string>("");
  const currentWord = ref<string>("");
  
  const currentCodeDisplay = computed(() => {
    let display = "";
    for (let c of currentCode.value) {
      if (c == '.') {
        display += "·";
      }
      else if (c == '-') {
        display += "—";
      }
    }
    return display;
  });
  
  const currentChar = computed(() => {
    const char = morseCodeToAlphabet[currentCode.value];
    return char;
  });
  
  function input(mcs: MorseCodeSymbol) {
    currentCode.value += mcs;
  }
  
  function nextCode() {
    currentWord.value += currentChar.value;
    currentCode.value = "";
  }
  
  function skipCode() {
    currentWord.value += ".";
    currentCode.value = "";
  }
  
  function clear() {
    currentWord.value = "";
    currentCode.value = "";
  }
  
  const results = computed(() => {
    let results: string[] = [];
    let regex = new RegExp(currentWord.value);
    for (let word in words) {
      let matcher = regex.exec(word);
      if (matcher != null) {
        results.push(word);
      }
    }
    return results;
  });
</script>

<template>
  <uni-section title="摩斯电码输入" type='line'>
    <uni-row :gutter="4">
      <uni-col :span="4" :offset="2">
        <button size="mini" style="width: 100%;" @click="input('.')">·</button>
      </uni-col>
      <uni-col :span="4">
        <button size="mini" style="width: 100%;" @click="input('-')">—</button>
      </uni-col>
      <uni-col :span="4">
        <button size="mini" @click="nextCode">确认</button>
      </uni-col>
      <uni-col :span="4">
        <button size="mini" @click="skipCode">跳过</button>
      </uni-col>
      <uni-col :span="4">
        <button size="mini" @click="clear">清空</button>
      </uni-col>
    </uni-row>
  </uni-section>
  <uni-section title="当前编码" type='line'>
    <uni-row :gutter="4">
      <uni-col :span="11">
        <view class="morse-code">
          <text v-for="ccd in currentCodeDisplay"><span>{{ ccd }}</span><span>&ThinSpace;&ThinSpace;</span></text>
        </view>
      </uni-col>
      <uni-col :span="11">
        <view>{{ currentChar }}</view>
      </uni-col>
    </uni-row>
  </uni-section>
  <uni-section title="当前单词" type='line'>
    {{ currentWord }}
  </uni-section>
  <uni-section title="筛选结果" type='line'>
    <uni-row v-for="result in results">
      <uni-col :span="12">{{ result }}</uni-col>
      <uni-col :span="12">{{ words[result] + 'MHz' }}</uni-col>
    </uni-row>
  </uni-section>
</template>

<style scoped>
  .morse-code {
    height: 32rpx;
  }
</style>