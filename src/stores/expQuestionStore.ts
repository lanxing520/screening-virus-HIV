import { expQuestionData } from "./staticData"
import type { QuestionData } from "@/interface/index"
import { arraysEqual } from "@/utils/common-methods"
import { ElMessage } from "element-plus"

type SelectVal = string[] | string[][]
type PromiseType = {
  value: SelectVal
  isCorrect: boolean
}
export const questionStore = defineStore("expQuestion", () => {
  const dialogVisible = ref(false)
  const myQuestionData = ref<QuestionData[]>([
    {
      question: "请选择正确的选项",
      answer: "1",
      type: "radio",
      options: [
        {
          label: "1",
          value: "1",
        },
        {
          label: "2",
          value: "2",
        },
      ],
    },
  ])
  const showTips = ref(false)
  let resolvePromise: ((val: PromiseType) => void) | null = null
  let correctCallback: (() => void) | null = null
  let errorCallback: (() => void) | null = null
  const mySelect = ref<SelectVal>([])
  let myUntilTrue = false
  const setQuestion = (
    exp: string,
    step: string,
    untilTrue = false,
    onCorrect?: () => void,
    onError?: () => void,
  ): Promise<PromiseType> => {
    myUntilTrue = untilTrue
    mySelect.value = []
    showTips.value = false
    return new Promise((resolve) => {
      myQuestionData.value = expQuestionData[exp][step]
      dialogVisible.value = true
      resolvePromise = resolve // 存储resolve函数
      // 将回调存储到 store 中，供 submitAnswer 使用
      correctCallback = onCorrect ?? null
      errorCallback = onError ?? null
    })
  }
  // 用户提交答案
  const submitAnswer = () => {
    const correctAnswer = myQuestionData.value.map((q) => q.answer)
    const userAnswer = mySelect.value
    const isCorrect = arraysEqual(correctAnswer, userAnswer)
    if (isCorrect) {
      if (correctCallback) {
        correctCallback() // 执行正确回调
      }
      if (resolvePromise) {
        resolvePromise({ value: userAnswer, isCorrect }) // 解析Promise
        resolvePromise = null
      }
      dialogVisible.value = false
    } else {
      ElMessage({
        message: "错误,请重新选择",
        type: "error",
        plain: true,
      })
      showTips.value = true
      if (errorCallback) {
        errorCallback() // 执行错误回调
      }
      if (!myUntilTrue && resolvePromise) {
        resolvePromise({ value: userAnswer, isCorrect }) // 解析Promise
        resolvePromise = null
        dialogVisible.value = false
      }
    }
  }
  return {
    showTips,
    dialogVisible,
    myQuestionData,
    mySelect,
    setQuestion,
    submitAnswer,
  }
})
