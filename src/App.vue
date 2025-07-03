<script setup lang="ts">
const showFullScreenButton = ref(false)
const isFullScreen = ref(false)

// 监听鼠标移动事件
const handleMouseMove = (event: MouseEvent) => {
  const buffer = 50 // 设置右下角的检测区域大小
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  if (event.clientX > windowWidth - buffer && event.clientY > windowHeight - buffer) {
    showFullScreenButton.value = true
  } else {
    showFullScreenButton.value = false
  }
}

// 切换全屏
const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  if (isFullScreen.value) {
    enterFullScreen()
  } else {
    exitFullScreen()
  }
}

// 进入全屏
const enterFullScreen = () => {
  const element = document.documentElement
  if (element.requestFullscreen) {
    element.requestFullscreen()
  }
}

// 退出全屏
const exitFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

// 绑定和解绑事件监听器
onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove)
})

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", handleMouseMove)
})
</script>

<template>
  <main class="main">
    <router-view></router-view>
    <!-- 全屏按钮 -->
    <button v-if="showFullScreenButton" @click="toggleFullScreen" class="fullscreen-button">
      {{ isFullScreen ? "退出全屏" : "全屏" }}
    </button>
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
.fullscreen-button {
  position: fixed;
  bottom: 5px;
  right: 5px;
  z-index: 9999; /* 确保按钮在其他内容之上 */
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }
}
</style>
