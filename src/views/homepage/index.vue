<template>
  <div class="homepage">
    <img src="@/assets/img/homepage/enter_button.png" class="tab" @click="enter" />

    <template v-if="isDev">
      <div class="file-button" @click="dialogVisible = true">获取excel</div>
      <el-dialog v-model="dialogVisible" title="读取文件" align-center width="90%">
        <ReadExcel class="excel" @file-upload="getFileData" />
        <template #footer>
          <el-button @click="onConfirm">确定</el-button>
        </template>
      </el-dialog>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router"
import { useExperimentStore } from "@/stores/experimentStore"
import ReadExcel from "@/components/ReadExcel.vue"

const store = useExperimentStore()
const router = useRouter()

const enter = () => {
  store.activeTabIndex = 0
  store.isSimulation = null
  store.simulatiuonName = ""
  router.push("/experiment-page")
}

const dialogVisible = ref(false)
const fileData = ref<any>([])

if (store.experimentInfo) {
  fileData.value = store.experimentInfo
}

const getFileData = (data: any) => {
  fileData.value = data
}
const onConfirm = () => {
  dialogVisible.value = false
  // store.saveExperimentInfo(fileData.value)
}

const isDev = computed(() => {
  return import.meta.env.DEV
})
</script>
<style scoped lang="scss">
.homepage {
  position: relative;
  width: 100%;
  height: 100vh;
  background: no-repeat center url("@/assets/img/homepage/bg.png");
  background-size: 100% 100%;

  .tab {
    position: absolute;
    left: 14%;
    bottom: 20%;
    width: 17vw;
    height: 10vh;
    line-height: 5rem;
    text-align: center;
    cursor: pointer;
  }

  .file-button {
    position: absolute;
    left: 0;
    top: 0;
    padding: 5px;
    border: 1px solid #aeaeae;
    background: rgba(0, 255, 255, 0.2);
    cursor: pointer;
    z-index: 9;
  }
}
</style>
