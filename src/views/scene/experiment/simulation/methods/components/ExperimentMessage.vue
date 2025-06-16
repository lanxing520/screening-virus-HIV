<template>
  <div class="left-button-wrapper" :class="{ 'hide-left': isHideLeft }">
    <div ref="scrollRef" class="animation-list hide-scrollbar">
      <div
        class="animation-item text-truncate"
        :class="{ finish: i === active.index }"
        v-for="(item, i) in store.getExperiment"
        :key="i"
        :title="item.name"
        @click="stepClick(i)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="hide-button-left" :class="{ change: isHideLeft }" @click="hideLeft"></div>
  </div>
  <div class="center-bottom-desc" :class="{ 'hide-down': isHideDown }">
    <template v-if="!isHideDown">
      <div class="tips-container" v-show="expInfo.tipMessage">{{ expInfo.tipMessage }}</div>
      <div v-show="warmTips" class="warm-tips-container">
        {{ warmTips }}
      </div>
      <span>{{ active?.desc }}</span>
      <img src="@/assets/img/experiment/提示-icon.png" class="right-top-icon" />
    </template>
    <div class="hide-button-bottom" :class="{ change: isHideDown }" @click="hideDown"></div>
  </div>

  <el-button class="end-button" v-if="isFinished" @click="endExperiment">结束并提交</el-button>
  <el-dialog v-model="dialogVisible" title="" width="500" align-center>
    <span style="font-size: 20px"> 你的成绩为{{ expInfo.totalScore }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitScore"> 关闭 </el-button>
      </div>
    </template>
  </el-dialog>
  <ExpQuestion />
</template>

<script setup lang="ts">
import { useExperimentStore, experimentScore } from "@/stores/experimentStore"
import ExpQuestion from "./ExpQuestion.vue"
import { isFinished, warmTips } from "../common/stepManager"
import { upload } from "@/api/rainier.ts"

interface Step {
  index: null | number
  name: string
  desc: string
}
const model = defineModel<number>({ required: true })
const props = defineProps<{
  stepMapping: Record<string, number>
}>()
const emit = defineEmits(["stepChange"])

const store = useExperimentStore()
const expInfo = experimentScore()
const active = ref<Step>({ index: null, name: "", desc: "" })
const scrollRef = useTemplateRef("scrollRef")

const dialogVisible = ref(false)
const endExperiment = () => {
  if (expInfo?.report && expInfo?.report?.length > 0) {
    expInfo.totalScore = 0
    const arr = expInfo.report.map((item: any) => {
      const maxScore = Math.floor(100 / expInfo.report.length)
      const score =
        item.score + maxScore > 0 && item.startTime !== "" && item.endTime !== ""
          ? item.score + maxScore
          : 0
      expInfo.totalScore += score
      return {
        moduleFlag: "实验成绩",
        questionNumber: 1,
        questionStem: "学生操作成绩",
        trueOrFalse: "True",
        expectTime: 20, //步骤合理用时 秒
        evaluation: "", //实验步骤评价 200
        scoringModel: "", //考察点
        remarks: "", //备注 非必填
        startTime: item.startTime,
        endTime: item.endTime,
        score,
        maxScore,
        repeatCount: item.repeatCount,
      }
    })
    // console.log("总分", expInfo.totalScore)
    // console.log("上传数据", arr)
    upload(arr)
  }

  dialogVisible.value = true
}

const stepClick = (i: number) => {
  if (active.value.index === i) return
  active.value.index = i
  model.value = props.stepMapping[i] ?? i + 1
}
watch(
  () => model.value,
  (newVal) => {
    if (newVal === undefined) return

    // 获取对应的索引
    let mappedIndex = Object.keys(props.stepMapping).find(
      (key) => props.stepMapping[key] === newVal,
    )

    // 只有当索引确实变化时才更新
    if (mappedIndex !== undefined) {
      active.value.index = +mappedIndex
      if (typeof +mappedIndex === "number") scrollToActiveItem(+mappedIndex)
      active.value.name = store.getExperiment[+mappedIndex].name
      active.value.desc = store.getExperiment[+mappedIndex].desc
      emit("stepChange")
    }
  },
  {
    immediate: true,
  },
)

const submitScore = async () => {
  dialogVisible.value = false
  if (store.isSimulation !== null) {
    store.isSimulation = null
    store.activeTabIndex = 2
  }
}
function scrollToActiveItem(index: number) {
  if (!scrollRef.value) return
  const container = scrollRef.value
  const item = container.children[index] as HTMLDivElement
  if (item) {
    // 让元素滚动到容器可视区域中
    item.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    })
  }
}

const isHideLeft = ref(false)
const hideLeft = () => {
  isHideLeft.value = !isHideLeft.value
}
const isHideDown = ref(false)
const hideDown = () => {
  isHideDown.value = !isHideDown.value
}
</script>

<style scoped lang="scss">
.score-container {
  position: absolute;
  right: 0;
  top: 0;
  color: #000;
}
.time {
  position: absolute;
  top: 1.5rem;
  right: 0;
  color: #000;
}
.end-button {
  position: absolute;
  right: 1rem;
  bottom: 2rem;
}

.left-button-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 17rem;
  height: 55%;
  transition: width 0.5s ease-in-out;

  .animation-list {
    width: 100%;
    height: 100%;
    overflow: hidden auto;

    .animation-item {
      width: 17rem;
      height: 4rem;
      line-height: 4rem;
      text-align: center;
      background: no-repeat center url("@/assets/img/experiment/步骤.png");
      background-size: 100% 100%;
      color: #fff;
      cursor: pointer;
      border-radius: 15px;
      margin-bottom: 1rem;
      letter-spacing: 2px;
      font-size: 1.5rem;
      &.finish {
        background-image: url("@/assets/img/experiment/步骤finish.png");
      }
    }
  }
}
.hide-button-left {
  position: absolute;
  width: 3rem;
  height: 3rem;
  right: -3rem;
  top: 50%;
  background: no-repeat center url("@/assets/img/experiment/arrow_left.png");
  background-size: 100% 100%;
  cursor: pointer;

  &.change {
    transform: rotate(180deg);
  }
}
.hide-left {
  width: 0 !important;
}

.center-bottom-desc {
  position: absolute;
  left: 50%;
  width: 70%;
  bottom: 1rem;
  min-height: 8rem;
  transform: translateX(-50%);
  background: no-repeat center url("@/assets/img/experiment/文本框.png");
  background-size: 100% 100%;
  padding: 2rem 1rem;
  color: #fff;
  transition:
    min-height,
    0.5s ease-in-out;
  .tips-container {
    position: absolute;
    bottom: calc(100% + 1rem);
    right: 0;
    min-width: 20rem;
    padding: 2rem 1.5rem 1rem 1.5rem;
    background: no-repeat center url("@/assets/img/experiment/提示.png");
    background-size: 100% 100%;
  }
  .warm-tips-container {
    position: absolute;
    bottom: calc(100% + 1rem);
    right: 0;
    min-width: 26rem;
    padding: 2rem 1.5rem 1rem 1.5rem;
    background-size: 100% 100%;
    background: no-repeat center url("@/assets/img/experiment/温馨提醒.png");
    z-index: 99;
  }

  .right-top-icon {
    display: block;
    position: absolute;
    right: 0.1rem;
    top: 0.1rem;
    scale: 0.8;
  }
}

.hide-button-bottom {
  position: absolute;
  width: 3rem;
  height: 3rem;
  top: -3rem;
  left: 50%;
  background: no-repeat center url("@/assets/img/experiment/arrow_down.png");
  background-size: 100% 100%;
  cursor: pointer;

  &.change {
    transform: rotate(180deg);
  }
}
.hide-down {
  // display: none;
  padding: 0;
  height: 0;
  min-height: 0;
}
</style>
