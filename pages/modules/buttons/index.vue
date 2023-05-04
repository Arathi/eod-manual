<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useBombStore } from '@/stores/BombStore';

  const bombStore = useBombStore();

  // 标签宽度
  const labelWidth = ref(90);

  enum ButtonText {
    none,
    abort, // 中止
    detonate, // 引爆
    hold, // 按住
    other, // 其他
  }
  const ButtonTextDatas = [
    { value: ButtonText.abort, text: '中止' },
    { value: ButtonText.detonate, text: '引爆' },
    { value: ButtonText.hold, text: '按住' },
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
    { value: ButtonColor.blue, text: '蓝色' },
    { value: ButtonColor.white, text: '白色' },
    { value: ButtonColor.yellow, text: '黄色' },
    { value: ButtonColor.red, text: '红色' },
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
    { value: LightColor.blue, text: '蓝色' },
    { value: LightColor.white, text: '白色' },
    { value: LightColor.yellow, text: '黄色' },
    { value: LightColor.other, text: '其他' },
  ];

  const CellAmountDatas = [
    { value: 0, text: '没有' },
    { value: 1, text: '1个' },
    { value: 2, text: '2个' },
    { value: 3, text: '3个' },
    { value: 4, text: '4个及以上' },
  ];

  const buttonColor = ref<ButtonColor>(ButtonColor.none);
  const buttonText = ref<ButtonText>(ButtonText.none);
  const lightColor = ref<LightColor>(LightColor.none);
  const indicatorChecked = ref<boolean>(false);

  const step = ref<number>(0);
  const stepDesc = ref<string[]>([]);
  
  const ActionDescClick = "按下按钮并立即松开";

  const actions = computed(() => {
    const actions : string[] = [];
    finalAction.value = "条件不足";

    // 1. 如果是写有“中止”的蓝色按钮，按住按钮，接着参考“松开按住的按钮”。
    // actions.push(`第一步：检查按钮文本（中止）与颜色（蓝）`);
    step.value = 0;
    if (buttonText.value == ButtonText.none) {
      actions.push(`请选择按钮文本`);
      return actions;
    }
    if (buttonColor.value == ButtonColor.none) {
      actions.push(`请选择按钮颜色`);
      return actions;
    }

    step.value = 1;
    if (buttonText.value == ButtonText.abort && buttonColor.value == ButtonColor.blue) {
      return actionsHold(actions);
    }

    // 2. 如果炸弹上有不止1个电池，同时按钮上写着“引爆”，按下按钮并立即松开。
    step.value = 2;
    // actions.push(`第二步：检查电池数量（>1）与按钮文本（引爆）`);
    if (bombStore.cellAmount < 0) {
      actions.push(`请选择电池数量`);
      return actions;
    }
    let cellAmountText = `${bombStore.cellAmount}`;
    if (bombStore.cellAmount >= 4) {
      cellAmountText += "+";
    }
    actions.push(`电池数量：${cellAmountText}`);
    if (bombStore.cellAmount > 1 && buttonText.value == ButtonText.detonate) {
      return actionsClick(actions);
    }

    // 3. 如果按钮是白色的，同时炸弹上有个写着CAR的指示灯亮，按住按钮，接着参考“松开按住的按钮”。
    step.value = 3;
    // actions.push(`第三步：按钮颜色（白）与指示灯（CAR）`);
    if (buttonColor.value == ButtonColor.white && bombStore.CAR) {
      return actionsHold(actions);
    }

    // 4. 如果炸弹上有不止2个电池，也有写着FRK的指示灯亮，按下按钮并立即松开。
    step.value = 4;
    // actions.push(`第四步：检查电池数量（>2）与指示灯（FRK）`);
    if (bombStore.cellAmount > 2 && bombStore.FRK) {
      return actionsClick(actions);
    }

    // 5. 如果按钮是黄色的，按住按钮，接着参考“松开按住的按钮”。
    step.value = 5;
    // actions.push(`第五步：检查按钮颜色（黄）`);
    if (buttonColor.value == ButtonColor.yellow) {
      return actionsHold(actions);
    }

    // 6. 如果是写有“按住”的红色按钮，按下按钮并立即松开。
    step.value = 6;
    // actions.push(`第六步：检查按钮文本（按住）与颜色（红）`);
    if (buttonText.value == ButtonText.hold && buttonColor.value == ButtonColor.red) {
      return actionsClick(actions);
    }

    // 7. 如果不满足上述任一情况，按住按钮，接着参考“松开按住的按钮”。
    step.value = 7;
    // actions.push(`第七步：其他情况`);
    return actionsHold(actions);
  });

  function actionsHold(actions : string[]) {
    step.value = 8;
    actions.push("按住按钮，检查模块右侧彩色光条");
    if (lightColor.value == LightColor.none) {
      actions.push(`请选择灯条颜色`);
      finalAction.value = "请选择灯条颜色";
      return actions;
    }

    actions.push(`灯条颜色：${LightColor[lightColor.value]}`);
    actions.push(`检查计时器，观察任意位数出现的数字`);
    let num = 1;
    switch (lightColor.value) {
      case LightColor.blue:
        num = 4;
        break;
      case LightColor.yellow:
        num = 5;
        break;
    }
    actions.push(`在计时器任意数位显示${num}时松开`);
    step.value = 9;
    finalAction.value = `在计时器任意数位显示${num}时松开`;

    return actions;
  }

  function actionsClick(actions : string[]) {
    step.value = 9;
    actions.push(`按下按钮并立即松开`);
    finalAction.value = `按下按钮并立即松开`;
    return actions;
  }

  const finalAction = ref<string>("");
  
  enum StepResult {
    wait,
    goon,
    goto,
    end
  }

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
    
    let pass: boolean = true;
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
  
  function stepFinal(action: string, description: string = "") : StepResult {
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
</script>

<template>
  <uni-section title="模块信息" type="line" class="section">
    <uni-forms-item label="按钮文本" :label-width="labelWidth">
      <uni-data-select v-model="buttonText" :localdata="ButtonTextDatas" :clear="false" />
    </uni-forms-item>
    <uni-forms-item label="按钮颜色" :label-width="labelWidth">
      <uni-data-select v-model="buttonColor" :localdata="ButtonColorDatas" :clear="false" />
    </uni-forms-item>
    <uni-forms-item label="光条颜色" :label-width="labelWidth">
      <uni-data-select v-model="lightColor" :localdata="LightColorDatas" :clear="false" />
    </uni-forms-item>
  </uni-section>
  <uni-section title="全局信息" type="line" class="section">
    <uni-forms-item label="电池数量" :label-width="labelWidth">
      <uni-data-select v-model="bombStore.cellAmount" :localdata="CellAmountDatas" :clear="false" />
    </uni-forms-item>
    <uni-forms-item label="指示灯" :label-width="labelWidth">
      <view>
        <uni-tag text="CAR" size="small" class="indicators" @click="bombStore.toggleIndicator('CAR')"
          :type="`${bombStore.CAR ? 'success' : 'default'}`" />
        <uni-tag text="FRK" size="small" class="indicators" @click="bombStore.toggleIndicator('FRK')"
          :type="`${bombStore.FRK ? 'success' : 'default'}`" />
        <button size="mini" @click="indicatorChecked = true">确认</button>
      </view>
    </uni-forms-item>
  </uni-section>
  <uni-section title="操作" type="line" class="section">
    <uni-steps :options="stepsOptions" :active="step" direction="column" />
    <!--
    <view v-for="action in actions" class="actions">
      <text>{{ action }}</text>
    </view>
    -->
  </uni-section>
</template>

<style scoped>
  .indicators {
    margin-right: 8rpx;
  }
</style>