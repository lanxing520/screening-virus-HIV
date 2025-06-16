<template>
  <div class="read-excel">
    <input type="file" class="m-b" accept=".xlsx, .xls" @change="handleFileUpload" />
    <div class="tab-container">
      <div v-for="(item, i) in tabList" class="tab-item" :key="i" @click="switchTab(item)">
        {{ item }}
      </div>
    </div>

    <el-table :data="tableData" height="350">
      <el-table-column :prop="item" :label="item" v-for="(item, i) in tableColum" :key="i" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { readExcelFile } from "@/utils/readExcel.ts"

const emit = defineEmits(["file-upload"])
const excelData = ref<any>({})
const tabList = ref<string[]>([])
const activeTab = ref("")
const tableData = ref([])

const handleFileUpload = async (event: any) => {
  if (!event?.target?.files?.[0]) return
  const file = event.target.files[0]

  try {
    const data = (await readExcelFile(file)) as any[]
    excelData.value = data[0]
    tabList.value = Object.keys(excelData.value) as string[]
    activeTab.value = tabList.value[0]
    tableData.value = excelData.value[tabList.value[0]]
    emit("file-upload", data[0])
  } catch (error) {
    console.error("解析Excel失败:", error)
    // alert('文件解析失败，请检查文件格式')
  }
}

const tableColum = computed(() => {
  const s = excelData?.value?.[activeTab.value]?.[0]
  if (s) {
    return Object.keys(s)
  }
  return []
})

const switchTab = (item: string) => {
  activeTab.value = item
  tableData.value = excelData.value[item]
}
</script>
<style lang="scss" scoped>
.read-excel {
  height: 450px;

  .tab-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    .tab-item {
      padding: 3px;
      border: 1px solid #aeaeae;
      background: #aeaeae;
      cursor: pointer;
      &:hover {
        color: aqua;
      }
    }
  }

  .m-b {
    margin-bottom: 1rem;
  }
}
</style>
