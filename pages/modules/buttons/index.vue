<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useBombStore } from '@/stores/BombStore';
  import UndSection from '@/components/Section.vue';
  import UndRow from '@/components/Row.vue';

  const bombStore = useBombStore();

  // 标签宽度
  const labelWidth = ref(180);

  enum ButtonText {
    none,
    abort, // 中止
    detonate, // 引爆
    hold, // 按住
    other, // 其他
  }
  const ButtonTextDatas = [
    { value: ButtonText.abort, text: '中止 (step1)' },
    { value: ButtonText.detonate, text: '引爆 (step2)' },
    { value: ButtonText.hold, text: '按住 (step6)' },
    { value: ButtonText.other, text: '其他' },
  ];

  enum ButtonColor {
    none,
    blue, // 蓝色 1
    white, // 白色 2
    yellow, // 黄色 5
    red, // 红色 6
    other, // 其他
  }
  const ButtonColorDatas = [
    { value: ButtonColor.blue, text: '蓝色 (step1)' },
    { value: ButtonColor.white, text: '白色 (step4)' },
    { value: ButtonColor.yellow, text: '黄色 (step5)' },
    { value: ButtonColor.red, text: '红色 (step6)' },
    { value: ButtonColor.other, text: '其他' },
  ];

  enum LightColor {
    none,
    blue, // 蓝色
    white, // 白色
    yellow, // 黄色
    other, // 其他
  }
  const LightColorDatas = [
    { value: LightColor.blue, text: '蓝色 (4)' },
    { value: LightColor.white, text: '白色 (1)' },
    { value: LightColor.yellow, text: '黄色 (5)' },
    { value: LightColor.other, text: '其他 (1)' },
  ];

  const CellAmountDatas = [
    { value: 0, text: '没有' },
    { value: 1, text: '1个' },
    { value: 2, text: '2个' },
    { value: 3, text: '3个' },
    { value: 4, text: '4个及以上' },
  ];
  
  const ActionDescClick = "按下按钮并立即松开";

  enum StepResult {
    wait,
    goon,
    goto,
    end
  }

  const buttonColor = ref<ButtonColor>(ButtonColor.none);
  const buttonText = ref<ButtonText>(ButtonText.none);
  const lightColor = ref<LightColor>(LightColor.none);
  const indicatorChecked = ref<boolean>(false);
  const step = ref<number>(0);
  const stepDesc = ref<string[]>([]);
  const finalAction = ref<string>("");

  function steps() : StepResult {
    step.value = 0;
    stepDesc.value = [];
    for (let s = 0; s < 10; s++) {
      stepDesc.value[s] = '未执行';
    }

    let result = step0();
    if (result == StepResult.wait) {
      return result;
    }

    result = step1();
    if (result == StepResult.goto) {
      return stepHold();
    }
    if (result == StepResult.wait) {
      return result;
    }

    result = step2();
    if (result == StepResult.goto) {
      return stepFinal(ActionDescClick);
    }
    if (result == StepResult.wait) {
      return result;
    }

    result = step3();
    if (result == StepResult.goto) {
      return stepHold();
    }
    if (result == StepResult.wait) {
      return result;
    }

    result = step4();
    if (result == StepResult.goto) {
      return stepFinal(ActionDescClick);
    }
    if (result == StepResult.wait) {
      return result;
    }

    result = step5();
    if (result == StepResult.goto) {
      return stepHold();
    }
    if (result == StepResult.wait) {
      return result;
    }

    result = step6();
    if (result == StepResult.goto) {
      return stepFinal(ActionDescClick);
    }
    if (result == StepResult.wait) {
      return result;
    }

    step.value = 7;
    return stepHold();
  }

  // 中止按钮 + 蓝按钮
  function step0() : StepResult {
    let result = StepResult.goon;
    let pass = true;

    if (buttonText.value == ButtonText.none) {
      result = StepResult.wait;
      pass = false;
    }
    stepDesc.value[0] = `文本（${pass ? '✓' : '╳'}）`;

    if (buttonColor.value == ButtonColor.none) {
      result = StepResult.wait;
      pass = false;
    }
    stepDesc.value[0] += ` 颜色（${pass ? '✓' : '╳'}）`;

    return result;
  }

  // 中止按钮 + 蓝按钮 + 任意光条
  function step1() : StepResult {
    step.value = 1;

    let result = StepResult.goon;
    let pass = true;

    if (buttonText.value != ButtonText.abort) {
      pass = false;
    }
    stepDesc.value[step.value] = `中止（${pass ? '✓' : '╳'}）`;

    if (buttonColor.value != ButtonColor.blue) {
      pass = false;
    }
    stepDesc.value[step.value] += ` 蓝色（${pass ? '✓' : '╳'}）`;

    if (pass) {
      result = StepResult.goto;
    }

    return result;
  }

  // 引爆按钮 + 蓝按钮 + 电池2
  function step2() : StepResult {
    step.value = 2;

    const cellAmount = bombStore.cellAmount;
    if (cellAmount < 0) {
      stepDesc.value[step.value] = `请选择电池数量`;
      return StepResult.wait;
    }

    stepDesc.value[step.value] = `电池数量（${cellAmount > 1 ? '✓' : '╳'}）`;
    const detonate = buttonText.value == ButtonText.detonate;
    stepDesc.value[step.value] += ` 引爆（${detonate ? '✓' : '╳'}）`;

    if (cellAmount > 1 && detonate) {
      return StepResult.goto;
    }

    return StepResult.goon;
  }

  // 引爆按钮 + 白按钮 + 电池1 + CAR
  function step3() : StepResult {
    step.value = 3;

    const checked = indicatorChecked.value;
    if (!checked) {
      stepDesc.value[step.value] = `请确认指示灯`;
      return StepResult.wait;
    }

    const white = buttonColor.value == ButtonColor.white;

    stepDesc.value[step.value] = `白色（${white ? '✓' : '╳'}）`;
    stepDesc.value[step.value] += ` CAR（${bombStore.CAR ? '✓' : '╳'}）`;

    if (white && bombStore.CAR) {
      return StepResult.goto;
    }

    return StepResult.goon;
  }

  // 中止按钮 + 白按钮 + 电池3 + FRK[v]
  function step4() : StepResult {
    step.value = 4;

    stepDesc.value[step.value] = `电池数量（${bombStore.cellAmount > 2 ? '✓' : '╳'}）`;
    stepDesc.value[step.value] += ` FRK（${bombStore.FRK ? '✓' : '╳'}）`;

    if (bombStore.cellAmount > 2 && bombStore.FRK) {
      return StepResult.goto;
    }

    return StepResult.goon;
  }

  // 中止按钮 + 黄按钮 + 电池3 + CAR[x] + FRK[x]
  function step5() : StepResult {
    step.value = 5;

    const yellow = buttonColor.value == ButtonColor.yellow;
    stepDesc.value[step.value] = `黄色（${yellow ? '✓' : '╳'}）`;

    if (yellow) {
      return StepResult.goto;
    }

    return StepResult.goon;
  }

  // 按住按钮 + 红按钮 + 电池3 + CAR[x] + FRK[x]
  function step6() : StepResult {
    step.value = 6;

    const hold = buttonText.value == ButtonText.hold;
    const red = buttonColor.value == ButtonColor.red;

    stepDesc.value[step.value] = `按住（${hold ? '✓' : '╳'}）`;
    stepDesc.value[step.value] += `红色（${red ? '✓' : '╳'}）`;

    if (hold && red) {
      return StepResult.goto;
    }

    return StepResult.goon;
  }

  function stepHold() : StepResult {
    step.value = 8;

    let pass : boolean = true;
    if (lightColor.value == LightColor.none) {
      pass = false;
    }
    stepDesc.value[step.value] = `检查光条（${pass ? '✓' : '╳'}）`;
    if (!pass) {
      return StepResult.wait;
    }

    let num = 1;
    switch (lightColor.value) {
      case LightColor.blue:
        num = 4;
        break;
      case LightColor.yellow:
        num = 5;
        break;
    }

    return stepFinal("继续按住按钮，并检查倒计时", `在计时器任意数位显示${num}时松开按钮`);
  }

  function stepFinal(action : string, description : string = "") : StepResult {
    step.value = 9;
    finalAction.value = action;
    stepDesc.value[step.value] = description;
    return StepResult.end;
  }

  const stepsOptions = computed(() => {
    steps();
    return [
      {
        title: "开始：选择按钮的文本与颜色",
        desc: `${stepDesc.value[0]}`
      },
      {
        title: "第一步：检查按钮文本（中止）与颜色（蓝）",
        desc: `${stepDesc.value[1]}`
      },
      {
        title: "第二步：检查电池数量（>1）与按钮文本（引爆）",
        desc: `${stepDesc.value[2]}`
      },
      {
        title: "第三步：按钮颜色（白）与指示灯（CAR）",
        desc: `${stepDesc.value[3]}`
      },
      {
        title: "第四步：检查电池数量（>2）与指示灯（FRK）",
        desc: `${stepDesc.value[4]}`
      },
      {
        title: "第五步：检查按钮颜色（黄）",
        desc: `${stepDesc.value[5]}`
      },
      {
        title: "第六步：检查按钮文本（按住）与颜色（红）",
        desc: `${stepDesc.value[6]}`
      },
      {
        title: "第七步：其他情况",
        desc: `${stepDesc.value[7]}`
      },
      {
        title: "按住：按住按钮并检查光条颜色",
        desc: `${stepDesc.value[8]}`
      },
      {
        title: "最终：" + finalAction.value,
        desc: `${stepDesc.value[9]}`
      },
    ];
  });
  
  function reset() {
    buttonColor.value = ButtonColor.none;
    buttonText.value = ButtonText.none;
    lightColor.value = LightColor.none;
    indicatorChecked.value = false;
    step.value = 0;
    stepDesc.value = [];
    finalAction.value = "";
  }
</script>

<template>
  <und-section title="操作步骤">
    <uni-steps :options="stepsOptions" :active="step" direction="column" />
  </und-section>
  <und-section title="模块信息">
    <und-row title="按钮文本" :title-width="labelWidth">
      <uni-data-select v-model="buttonText" :localdata="ButtonTextDatas" :clear="false" />
    </und-row>
    <und-row title="按钮颜色" :title-width="labelWidth">
      <uni-data-select v-model="buttonColor" :localdata="ButtonColorDatas" :clear="false" />
    </und-row>
    <und-row title="光条颜色" :title-width="labelWidth" :margin-bottom="0">
      <uni-data-select v-model="lightColor" :localdata="LightColorDatas" :clear="false" />
    </und-row>
  </und-section>
  <und-section title="全局信息">
    <und-row title="电池数量" :title-width="labelWidth">
      <uni-data-select v-model="bombStore.cellAmount" :localdata="CellAmountDatas" :clear="false" />
    </und-row>
    <und-row title="指示灯" :title-width="labelWidth" :margin-bottom="0">
      <view class="indicators-group">
        <uni-tag text="CAR" size="small" class="indicators" @click="bombStore.toggleIndicator('CAR')"
          :type="`${bombStore.CAR ? 'success' : 'default'}`" />
        <uni-tag text="FRK" size="small" class="indicators" @click="bombStore.toggleIndicator('FRK')"
          :type="`${bombStore.FRK ? 'success' : 'default'}`" />
        <view>
          <button size="mini" @click="indicatorChecked = true">确认</button>
        </view>
      </view>
    </und-row>
    <uni-row :gutter="4">
      <uni-col :span="12" :offset="6">
        <button type="warn" @click="reset">重置</button>
      </uni-col>
    </uni-row>
  </und-section>
</template>

<style scoped>
  .indicators-group {
    display: flex;
    align-items: center;
  }
  .indicators {
    margin-right: 16rpx;
  }
</style>