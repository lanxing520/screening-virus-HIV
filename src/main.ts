import { createApp } from "vue"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import "@/assets/base.scss"
import App from "./App.vue"
import router from "./router"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"

import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic"
// 注册loaders
registerBuiltInLoaders()
//log
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // 注入插件

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount("#app")
