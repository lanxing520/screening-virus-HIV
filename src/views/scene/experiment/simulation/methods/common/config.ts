import { HavokPlugin, Vector3 } from "@babylonjs/core/Legacy/legacy"
import { scene, engine } from "./initScene"
import HavokPhysics from "@babylonjs/havok"
import { ref } from "vue"
import { watchPoint } from "../s4/itemData"

export const config = {
  frameRate: 30,
  showFps: false,
  debugger: false,
  HavokPhysics: false,
  sceneOptimize: true,
  watchPoint: [3.5,1.2,-3.3]
}

export const fps = ref<string>("")
export default async () => {
  if (!scene) return
  if (config.showFps) {
    scene?.onAfterRenderObservable.add(() => {
      if (!engine) return
      fps.value = engine.getFps().toFixed()
    })
  }
  if (config.debugger) {
    // 调试用
    scene?.debugLayer.show({
      overlay: true, // 显示覆盖层（包含 FPS）
      embedMode: true,
    })
  }
  if (config.HavokPhysics) {
    const havokInstance = await HavokPhysics()
    const hk = new HavokPlugin(true, havokInstance)
    scene?.enablePhysics(new Vector3(0, -9.8, 0), hk)
    // scene?.enablePhysics()
  }
  if (config.sceneOptimize) {
    scene.autoClear = false // Color buffer
    scene.freezeActiveMeshes()
    scene.blockMaterialDirtyMechanism = true
    scene.blockfreeActiveMeshesAndRenderingGroups = true
    //激进性能模式,会禁用鼠标事件
    // scene.performancePriority = ScenePerformancePriority.Aggressive
  }
}
