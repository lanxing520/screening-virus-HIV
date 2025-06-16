<template>
  <div class="experiment-introduction">
    <div class="exp-intro">{{ store?.experimentInfo?.["实验简介"]?.[0]?.ExpArticlesText }}</div>
    <div class="bottom-pic-wrapper">
      <img src="@/assets/img/experiment/one/图片1.png" alt="" />
      <img src="@/assets/img/experiment/one/图片2.jpg" alt="" />
      <img src="@/assets/img/experiment/one/图片3.jpg" alt="" />
    </div>

    <img
      class="go-next"
      @click="store.activeTabIndex = 1"
      src="@/assets/img/experiment/标题原理开.png"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { useExperimentStore } from "@/stores/experimentStore"

const store = useExperimentStore()

onMounted(() => {})
</script>

<style scoped lang="scss">
.experiment-introduction {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  .exp-intro {
    width: 70%;
    height: 40%;
    background: no-repeat center url("@/assets/img/experiment/实验介绍1.png");
    background-size: 100% 100%;
    margin: 2rem auto;
    padding: 3rem 1.5rem 1.5rem 1.5rem;
    font-size: 1.2rem;
    text-indent: 2.4rem;
  }
  .bottom-pic-wrapper {
    display: flex;
    justify-content: space-between;
    width: 70%;
    height: 55%;
    background: no-repeat center url("@/assets/img/experiment/实验介绍2.png");
    background-size: 100% 100%;
    padding: 3rem 1.5rem 1.5rem 1.5rem;
    img {
      width: 30%;
      height: 100%;
    }
  }

  .go-next {
    position: absolute;
    right: -1rem;
    bottom: -2rem;
  }
}
</style>
