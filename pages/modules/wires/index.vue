<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useBombStore, SeqLastType } from '@/stores/BombStore';

  const bombStore = useBombStore();

  // 标签宽度
  const labelWidth = ref(90);

  // 线路数量
  const wireAmount = ref(3);
  const WireAmountDatas = computed(() => {
    const datas : any = [];
    for (let amount = 3; amount <= 6; amount++) {
      datas.push({
        value: amount,
        text: `${amount}`
      });
    }
    return datas;
  });

  // 线路颜色
  // 红 白 蓝 黄 黑 
  enum WireColor {
    none = 0,
    red,
    white,
    blue,
    yellow,
    black,
    other = 99
  }
  const wireColors = ref<WireColor[]>([
    WireColor.none,
    WireColor.none,
    WireColor.none,
    WireColor.none,
    WireColor.none,
    WireColor.none,
  ]);
  const WireColorDatas = [
    { value: WireColor.red, text: "红色" },
    { value: WireColor.white, text: "白色" },
    { value: WireColor.blue, text: "蓝色" },
    { value: WireColor.yellow, text: "黄色" },
    { value: WireColor.black, text: "黑色" },
    { value: WireColor.other, text: "其他" },
  ];

  const seqLastType = computed({
    get() {
      return bombStore.seqLastType;
    },
    set(value : number) {
      bombStore._seqLastType = value;
    }
  });
  const seqLastTypeDisabled = computed(() => bombStore.sequence.length > 0);
  const SeqLastTypeDatas = [
    { value: SeqLastType.odd, text: "奇数" },
    { value: SeqLastType.even, text: "偶数" },
    { value: SeqLastType.char, text: "字符" },
  ];

  const actions = computed(() => {
    if (wireAmount.value == 3) {
      return getActions3Wires();
    }
    if (wireAmount.value == 4) {
      return getActions4Wires();
    }
    if (wireAmount.value == 5) {
      return getActions5Wires();
    }
    if (wireAmount.value == 6) {
      return getActions6Wires();
    }
    return ["请选择正确的线路数量"];
  });

  function getActions3Wires() {
    const actions : string[] = [];

    // 3-1 如果没有红线，则剪断第二根线。
    // 白 白 白
    let redAmount = 0;
    let blueAmount = 0;
    actions.push("检查红线数量");
    for (let wireIndex = 1; wireIndex <= wireAmount.value; wireIndex++) {
      const wireColor = wireColors.value[wireIndex - 1];
      if (wireColor == WireColor.none) {
        actions.push(`请选择线路${wireIndex}的颜色`);
        return actions;
      }
      if (wireColor == WireColor.red) redAmount++;
      if (wireColor == WireColor.blue) blueAmount++;
    }
    actions.push(`红线数量：${redAmount}`);
    if (redAmount == 0) {
      actions.push(`3-1 剪断第二根线`);
      return actions;
    }

    // 3-2 否则，当最后一根线为白线时，剪断最后一根线。
    // 红 白 白
    actions.push("检查最后一根线是否为白色");
    const lastWireIndex = wireAmount.value;
    const lastWireColor = wireColors.value[lastWireIndex - 1];
    if (lastWireColor == WireColor.white) {
      actions.push(`3-2 剪断最后一根线`);
      return actions;
    }

    // 3-3 否则，当有不止一根蓝线的时候，剪断最后一根蓝线。
    // 红 蓝 蓝
    actions.push(`检查蓝线数量：${blueAmount}`);
    if (blueAmount > 1) {
      actions.push(`3-3 剪断最后一根蓝线`);
      return actions;
    }

    // 3-E 否则，剪断最后一根线。
    // 红 蓝 黄
    actions.push("3-E 剪断最后一根线");
    return actions;
  }

  function getActions4Wires() {
    const actions : string[] = [];

    // 4-1 如果有不止一根红线且序列号末位为奇数，则剪断最后一根红线。
    // 奇 红 红 - -
    actions.push("检查红线数量");
    let redAmount = 0;
    for (let wireIndex = 1; wireIndex <= wireAmount.value; wireIndex++) {
      const wireColor = wireColors.value[wireIndex - 1];
      if (wireColor == WireColor.red) redAmount++;
    }

    actions.push(`红线数量：${redAmount}`);
    if (redAmount > 1) {
      actions.push(`检查序列号末位`);
      if (seqLastType.value == SeqLastType.none) {
        actions.push(`请选择序列号末位类型`);
        return actions;
      }
      actions.push(`序列号末位：${SeqLastType[seqLastType.value]}`);
      if (seqLastType.value == SeqLastType.odd) {
        actions.push(`4-1 剪断最后一根红线`);
        return actions;
      }
    }

    let blueAmount = 0;
    let yellowAmount = 0;
    for (let wireIndex = 1; wireIndex <= wireAmount.value; wireIndex++) {
      const wireColor = wireColors.value[wireIndex - 1];
      if (wireColor == WireColor.none) {
        actions.push(`请选择线路${wireIndex}的颜色`);
        return actions;
      }
      if (wireColor == WireColor.blue) blueAmount++;
      if (wireColor == WireColor.yellow) yellowAmount++;
    }

    // 4-2 否则，当没有红线且最后一根线是黄线时，剪断第一根线。
    // 奇 白 白 白 黄
    if (redAmount == 0) {
      actions.push("检查最后一根线是否为黄色");
      const lastWireIndex = wireAmount.value;
      const lastWireColor = wireColors.value[lastWireIndex - 1];
      if (lastWireColor == WireColor.yellow) {
        actions.push("4-2 剪断第一根线");
        return actions;
      }
    }

    // 4-3 否则，当有且仅有一根蓝线时，剪断第一根线。
    // 奇 白 白 白 蓝
    actions.push(`检查蓝线数量：${blueAmount}`);
    if (blueAmount == 1) {
      actions.push("4-3 剪断第一根线");
      return actions;
    }

    // 4-4 否则，当有不止一根黄线时，剪断最后一根线。
    // 奇 白 黄 黄 白
    if (yellowAmount > 1) {
      actions.push("4-4 剪断最后一根线");
      return actions;
    }

    // 4-E 否则，剪断第二根线。
    // 奇 白 白 黄 白
    actions.push("4-E 剪断第二根线");
    return actions;
  }

  function getActions5Wires() {
    const actions : string[] = [];

    // 5-1 如果最后一根线是黑线且序列号末位为奇数，则剪断第四根线。
    // 奇 - - - - 黑
    actions.push("检查最后一根线是否为黑色");
    const lastWireIndex = wireAmount.value;
    const lastWireColor = wireColors.value[lastWireIndex - 1];
    if (lastWireColor == WireColor.none) {
      actions.push("请选择最后一根线的颜色");
      return actions;
    }
    if (lastWireColor == WireColor.black) {
      actions.push(`检查序列号末位`);
      if (seqLastType.value == SeqLastType.none) {
        actions.push(`请选择序列号末位类型`);
        return actions;
      }
      actions.push(`序列号末位：${SeqLastType[seqLastType.value]}`);
      if (seqLastType.value == SeqLastType.odd) {
        actions.push(`5-1 剪断第四根线`);
        return actions;
      }
    }

    // 5-2 否则，当有且仅有一根红线，且黄线不止一根时，剪断第一根线。
    // 偶 红 黄 黄 蓝 蓝
    let redAmount = 0;
    let yellowAmount = 0;
    let blackAmount = 0;
    for (let wireIndex = 1; wireIndex <= wireAmount.value; wireIndex++) {
      const wireColor = wireColors.value[wireIndex - 1];
      if (wireColor == WireColor.none) {
        actions.push(`请选择线路${wireIndex}的颜色`);
        return actions;
      }
      if (wireColor == WireColor.red) redAmount++;
      if (wireColor == WireColor.yellow) yellowAmount++;
      if (wireColor == WireColor.black) blackAmount++;
    }
    if (redAmount == 1 && yellowAmount > 1) {
      actions.push(`5-2 剪断第一根线`);
      return actions;
    }

    // 5-3 否则，当没有黑线时，剪断第二根线。
    // 偶 红 黄 蓝 蓝 蓝
    if (blackAmount == 0) {
      actions.push(`5-3 剪断第二根线`);
      return actions;
    }
    
    // 5-E 否则，剪断第一根线。
    // 偶 红 黄 蓝 黑 蓝
    actions.push("5-E 剪断第一根线");
    return actions;
  }
  
  function getActions6Wires() {
    const actions : string[] = [];
    // 6-1 如果没有黄线且序列号末位为奇数，则剪断第三根线。
    // 奇 蓝 蓝 蓝 蓝 蓝 蓝
    let redAmount = 0;
    let yellowAmount = 0;
    let blackAmount = 0;
    let whiteAmount = 0;
    for (let wireIndex = 1; wireIndex <= wireAmount.value; wireIndex++) {
      const wireColor = wireColors.value[wireIndex - 1];
      if (wireColor == WireColor.none) {
        actions.push(`请选择线路${wireIndex}的颜色`);
        return actions;
      }
      if (wireColor == WireColor.red) redAmount++;
      if (wireColor == WireColor.yellow) yellowAmount++;
      if (wireColor == WireColor.black) blackAmount++;
      if (wireColor == WireColor.white) whiteAmount++;
    }
    if (yellowAmount == 0) {
      actions.push(`检查序列号末位`);
      if (seqLastType.value == SeqLastType.none) {
        actions.push(`请选择序列号末位类型`);
        return actions;
      }
      actions.push(`序列号末位：${SeqLastType[seqLastType.value]}`);
      if (seqLastType.value == SeqLastType.odd) {
        actions.push(`6-1 剪断第三根线`);
        return actions;
      }
    }
    
    // 6-2 否则，当有且仅有一根黄线，且白线不止一根时，剪断第四根线。
    // 偶 黄 白 白 蓝 蓝 蓝
    if (yellowAmount == 1 && whiteAmount > 1) {
      actions.push(`6-2 剪断第四根线`);
      return actions;
    }
    
    // 6-3 否则，当没有红线时，剪断最后一根线。
    // 偶 黄 白 蓝 蓝 蓝 蓝
    if (redAmount == 0) {
      actions.push(`6-3 剪断最后一根线`);
      return actions;
    }
    
    // 6-E 否则，剪断第四根线。
    // 偶 黄 白 红 蓝 蓝 蓝
    actions.push("6-E 剪断第四根线");
    return actions;
  }
</script>

<template>
  <uni-section title="模块信息" type="line" class="section">
    <uni-forms-item label="线路数量" :label-width="labelWidth">
      <uni-data-select v-model="wireAmount" :localdata="WireAmountDatas" :clear="false" />
    </uni-forms-item>
    <template v-for="wireIndex in wireAmount">
      <uni-forms-item :label="`线路${wireIndex}颜色`" :label-width="labelWidth">
        <uni-data-select v-model="wireColors[wireIndex-1]" :localdata="WireColorDatas" :clear="false"
          placeholder="请选择颜色" />
      </uni-forms-item>
    </template>
  </uni-section>
  <uni-section title="全局信息" type="line" class="section">
    <uni-forms-item label="序列号末位" :label-width="labelWidth" v-if="wireAmount >= 4">
      <uni-data-select v-model="seqLastType" :localdata="SeqLastTypeDatas" :clear="false"
        :disabled="seqLastTypeDisabled" />
    </uni-forms-item>
  </uni-section>
  <uni-section title="操作" type="line" class="section">
    <view v-for="action in actions" class="actions">
      <text>{{ action }}</text>
    </view>
  </uni-section>
</template>

<style scoped>
  .section {
    margin: 0 16rpx 16rpx 16rpx;
  }

  .actions {
    width: 100%;
  }
</style>