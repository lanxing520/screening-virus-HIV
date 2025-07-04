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
  let resolvePromise: ((val: PromiseType) => void) | null = null
  let correctCallback: (() => void) | null = null
  let errorCallback: (() => void) | null = null
  const mySelect = ref<SelectVal>([])
  let myUntilTrue = false
  const showTips = ref(false)
  const answerQuestionReport = ref<any[]>([])
  const nowId = ref("")
  const setQuestion = (
    exp: string,
    step: string,
    untilTrue = false,
    onCorrect?: () => void,
    onError?: () => void,
  ): Promise<PromiseType> => {
    myUntilTrue = untilTrue
    showTips.value = false
    mySelect.value = []
    return new Promise((resolve) => {
      const data = expQuestionData[exp][step]
      myQuestionData.value = data
      if (!answerQuestionReport.value.find((item) => item.id === exp + step)) {
        nowId.value = exp + step
        answerQuestionReport.value.push({
          id: nowId.value,
          data,
        })
      }

      dialogVisible.value = true
      resolvePromise = resolve // 存储resolve函数
      // 将回调存储到 store 中，供 submitAnswer 使用
      correctCallback = onCorrect ?? null
      errorCallback = onError ?? null
    })
  }
  // 用户提交答案
  const submitAnswer = () => {
    const obj = answerQuestionReport.value.find((item) => item.id === nowId.value)
    const correctAnswer = myQuestionData.value.map((q) => q.answer)
    const userAnswer = mySelect.value
    const boolean = arraysEqual(correctAnswer, userAnswer)
    if (obj.userAnswer === undefined) {
      obj.userAnswer = JSON.parse(JSON.stringify(mySelect.value))
    }
    if (boolean) {
      if (correctCallback) {
        correctCallback() // 执行正确回调
      }
      if (resolvePromise) {
        resolvePromise({ value: userAnswer, isCorrect: boolean }) // 解析Promise
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
        resolvePromise({ value: userAnswer, isCorrect: boolean }) // 解析Promise
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
    answerQuestionReport,
  }
})
