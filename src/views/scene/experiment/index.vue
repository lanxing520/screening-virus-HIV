<template>
  <ExperimentLayout>
    <div class="experiment-page">
      <ExperimentIntroduction v-show="store.activeTabIndex === 0" />
      <ExperimentalPrinciple v-show="store.activeTabIndex === 1" />
      <Simulation v-if="store.activeTabIndex === 2" />

      <div class="fps">{{ fps }}</div>
    </div>
  </ExperimentLayout>
</template>
<script setup lang="ts">
import ExperimentLayout from "@/components/ExperimentLayout.vue"
import ExperimentIntroduction from "./ExperimentIntroduction.vue"
import ExperimentalPrinciple from "./ExperimentalPrinciple.vue"
import Simulation from "./simulation/index.vue"
import { fps } from "./simulation/methods/common/config.ts"
import { useExperimentStore } from "@/stores/experimentStore"

const store = useExperimentStore()
</script>
<style scoped lang="scss">
.experiment-page {
  position: relative;
  height: calc(100vh - 5rem);

  .fps {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 2rem;
    z-index: 9999;
  }
}
</style>
