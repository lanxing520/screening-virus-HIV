<template>
  <div class="experiment-report">
    <div id="pdf-content">
      <h2 class="title">川北医学院虚拟仿真实验报告</h2>
      <div class="report-name">{{ store.name }} - {{ store.simulatiuonName }}</div>
      <el-table :data="tableData" style="font-size: 23px; width: 100%">
        <el-table-column
          v-for="item in colomnList"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item?.width"
        />
      </el-table>
      <div class="score">你的成绩为{{ totalScore }}</div>
    </div>

    <div class="get-pdf-btn">
      <el-button type="primary" @click="pdf">生成PDF</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { exportToPdf } from "@/utils/pdfExport"
import type { PdfTableData } from "@/interface/index"
import { useExperimentStore } from "@/stores/experimentStore"
const store = useExperimentStore()
const props = defineProps<{
  tableData: PdfTableData[]
}>()

const colomnList = [
  { prop: "question", label: "问题" },
  { prop: "answer", label: "答案", width: 150 },
  { prop: "userAnswer", label: "用户答案", width: 150 },
  { prop: "reduceScore", label: "扣分", width: 100 },
]
const totalScore = computed(() => {
  let score = 100
  props.tableData.forEach((item) => {
    score -= item.reduceScore
  })
  return score
})
onMounted(() => {})

const pdf = () => {
  const date = new Date()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  exportToPdf("pdf-content", `我的实验报告${month}${day}${hour}${minute}`)
}
</script>

<style scoped lang="scss">
.experiment-report {
  .get-pdf-btn {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
}

#pdf-content {
  padding:2rem 1rem;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 25px;

  h1 {
    color: #333;
    font-size: 30px;
    margin-bottom: 20px;
  }
  .score {
    font-size: 25px;
    text-align: center;
    margin-top: 1rem;
  }

  p {
    color: #666;
    font-size: 25px;
    line-height: 1.6;
  }
  .title {
    text-align: center;
    margin-bottom: 1rem;
  }
  .report-name {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}
</style>
