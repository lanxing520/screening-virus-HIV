import { defineStore } from "pinia"
import { defaultExperimentInfo } from "./staticData"

export const useExperimentStore = defineStore(
  "experiment",
  () => {
    const name = ref("人类免疫缺陷病毒（HIV）的筛查")
    const EnglishName = ref("Screening for Human Immunodeficiency Virus (HIV)")
    const experimentInfo = shallowRef<any>(defaultExperimentInfo)
    const activeTabIndex = ref(0)
    const isSimulation = ref<number | null>(null)
    function getStepList(arr: any) {
      const empty = [] as { name: string; desc: string }[]
      if (!arr?.length) return []
      arr.forEach((e: any) => {
        if (e["步骤Name"] && e["步骤Name"].trim()) {
          empty.push({
            name: e["步骤Name"],
            desc: e["描述"],
          })
        }
      })
      return empty
    }
    const getExperiment = computed(() => {
      if (isSimulation.value === null) return []
      const simulationKeys = ["实验模拟一", "实验模拟二", "实验模拟三", "实验模拟四", "实验模拟五"]
      const arr = simulationKeys.map((key) => getStepList(experimentInfo.value[key]))
      return arr[isSimulation.value] || []
    })
    return {
      name,
      EnglishName,
      activeTabIndex,
      isSimulation,
      experimentInfo,
      getExperiment,
    }
  },
  {
    persist: {
      pick: ["activeTabIndex", "isSimulation"],
    },
  },
)
export const experimentScore = defineStore("experimentScore", () => {
  const tipMessage = ref("")
  const totalScore = ref(0)
  const report = ref<any[]>([])

  return {
    tipMessage,
    totalScore,
    report,
  }
})
