<script setup lang="ts">
const routerList = [
  { name: "首页", route: "/" },
  { name: "实验", route: "/experiment-page" },
]
const router = useRouter()
const goTo = (route: string) => {
  router.push(route)
}
</script>

<template>
  <main class="main">
    <!-- <div  class="top-container">
      <el-button
        type="primary"
        v-for="(item, i) in routerList"
        :key="i"
        @click="goTo(item.route)"
        >{{ item.name }}</el-button
      >
    </div> -->
    <router-view></router-view>
  </main>
</template>
<style scoped lang="scss">
.main {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .top-container {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    top: 0;
    left: 0;
  }
}
</style>
