<template>
  <el-dialog
    v-model="store.dialogVisible"
    title=""
    width="50%"
    align-center
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    modal-class="question-modal"
    append-to-body
  >
    <div class="question-item" v-for="(item, i) in store.myQuestionData">
      <div class="question">{{ i + 1 }}. {{ item.question }}</div>
      <template v-if="item.type === 'radio'">
        <el-radio-group class="m-l" v-model="store.mySelect[i]">
          <el-radio size="large" v-for="i2 in item.options" :value="i2.value">
            <span class="label">{{ i2.label }}</span>
            <img v-if="i2?.img" class="option-img" :src="i2.img" alt="" />
          </el-radio>
        </el-radio-group>
      </template>
      <template v-else-if="item.type === 'checkbox'">
        <el-checkbox-group class="m-l" v-model="store.mySelect[i]">
          <el-checkbox
            size="large"
            v-for="i2 in item.options"
            :value="i2.value"
            :label="i2.label"
          />
        </el-checkbox-group>
      </template>
      <div v-show="store.showTips && item.tips" class="tips">解析: {{ item.tips }}</div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="sumbitAnswer"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { questionStore } from "@/stores/expQuestionStore"
import { ElMessage } from "element-plus"
const store = questionStore()

onMounted(() => {})
const sumbitAnswer = () => {
  if (store.mySelect.length !== store.myQuestionData.length) {
    ElMessage({
      message: "请选择",
      type: "error",
      plain: true,
    })
    return
  }
  store.submitAnswer()
}
</script>

<style scoped lang="scss">

.option-img {
  width: 5rem;
  height: 5rem;
}
.question-item {
  margin-bottom: 1rem;
  .question {
    font-size: 1.2rem;
    font-weight: bold;
  }
}
.m-l {
  margin-left: 1.4rem;
}
.label {
  font-size: 1.1rem;
}
.tips {
  color: red;
  padding: 0.5rem 1rem;
}
</style>
