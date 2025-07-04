<template>
  <div class="simulation-page">
    <div class="tab-container" v-if="store.isSimulation === null">
      <div class="tab normal-title" v-for="(item, i) in list" :key="i" @click="goTo(i)">
        {{ item }}
      </div>
    </div>

    <SimulationScene v-if="store.isSimulation !== null" :simulationIndex="store.isSimulation" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef, computed, watch } from "vue"
import type { Component } from "vue"
import { useExperimentStore } from "@/stores/experimentStore"
import SimulationScene from "./SimulationScene.vue"

const store = useExperimentStore()

const list = computed(() => {
  return store.experimentInfo["实验模拟"].map((e: any) => {
    return e["实验原理Name"]
  })
})

const goTo = (i: number) => {
  store.simulatiuonName = list.value[i]
  store.isSimulation = i
}

onMounted(() => {})
</script>

<style scoped lang="scss">
.simulation-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .tab-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .tab {
      width: 30rem;
      height: 5rem;
      line-height: 5rem;
      text-align: center;
      background: no-repeat center url("@/assets/img/little-tab.png");
      background-size: 100% 100%;
      font-size: 3rem;
      cursor: pointer;
      font-weight: normal;

      color: #1c8bbe;
      &:hover {
        color: #21f0f5;
        background-image: url("@/assets/img/little_tab_active.png") !important;
      }
    }
  }
}
</style>
