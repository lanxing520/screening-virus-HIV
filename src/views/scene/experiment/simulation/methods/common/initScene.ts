import {
  Scene,
  AbstractEngine,
  Light,
  Vector3,
  EngineFactory,
  DirectionalLight,
  HemisphericLight,
  ImportMeshAsync,
} from "@babylonjs/core/Legacy/legacy"

import { disposeAllModle } from "./loadModle"
import { ref } from "vue"
import applyConfig from "./config"
import { disposeAllClickHandlers } from "./action"
import { CreateCamera } from "./camera"
import { getModelAssetsUrl } from "@/utils/getBabylonAssets.ts"
export let scene: Scene | undefined
export let engine: AbstractEngine | null
export let camera: CreateCamera | null
export let light: Light | null

export const loading = ref(false)

interface ILoadingScreen {
  //What happens when loading starts
  displayLoadingUI: () => void
  //What happens when loading stops
  hideLoadingUI: () => void
}
class CustomLoadingScreen implements ILoadingScreen {
  constructor(
    public loadingUIText: string,
    public loadingUIBackgroundColor: string,
  ) {}
  public displayLoadingUI() {
    loading.value = true
  }
  public hideLoadingUI() {
    loading.value = false
  }
}
export async function initScene(
  canvasDom: HTMLCanvasElement,
  option?: {
    camera?: {
      alpha?: number
      beta?: number
      radius?: number
      target?: Vector3
    }
  },
) {
  if (engine && scene) return
  loading.value = true
  // registerBuiltInLoaders()
  // 1. 初始化引擎和场景
  engine = await EngineFactory.CreateAsync(canvasDom, {
    GPUPowerPreference: "high-performance",
    stencil: true,
  })
  var loadingScreen = new CustomLoadingScreen("loading!!", "#23272e")
  // replace the default loading screen
  engine.loadingScreen = loadingScreen
  // show the loading screen
  engine.displayLoadingUI()
  scene = new Scene(engine)

  await applyConfig()
  // 2. 设置相机和灯光
  camera = new CreateCamera(canvasDom, option?.camera)

  light = new DirectionalLight("DirectionalLight", new Vector3(-1, -1, 0), scene)
  const light0 = new HemisphericLight("HemiLight", new Vector3(0, 1.5, 0), scene)

  light0.intensity = 1.5
  light.intensity = 1
  // 3. 加载实验室
  await loadLab()

  console.log(scene)

  // hide the loading screen when you want to
  engine.hideLoadingUI()

  // 4. 启动渲染循环
  engine.runRenderLoop(() => {
    if (scene) {
      scene.render()
    }
  })

  // 窗口大小调整
  window.addEventListener("resize", resize)
}

export async function loadLab() {
  if (!scene) return
  try {
    const modelPath = getModelAssetsUrl("scene/lab")
    const labRes = await ImportMeshAsync(modelPath, scene)
    labRes.meshes.forEach((mesh) => {
      mesh.isPickable = false
    })
    // mesh.meshes[0].scaling = new Vector3(3,3,3)
  } catch (error) {
    console.error("场景加载失败:", error)
  }
}

export function dispose() {
  engine?.stopRenderLoop()
  if (!scene) return

  scene.stopAllAnimations()

  // 场景清理时

  engine?.wipeCaches(true) // 强制清理GPU缓存

  // 销毁所有网格
  scene.meshes.forEach((mesh) => mesh.dispose())
  // 销毁所有材质
  scene.materials.forEach((material) => material.dispose())
  // 销毁所有灯光
  scene.lights.forEach((light) => light.dispose())
  // 销毁所有纹理
  scene.textures.forEach((texture) => texture.dispose())
  scene.transformNodes.forEach((node) => node.dispose())
  scene.animationGroups.forEach((group) => group.dispose())
  // 销毁所有粒子系统
  scene.particleSystems.forEach((ps) => ps.dispose())
  //销毁所有导入的glb的mesh 和 鼠标移入显示信息事件
  disposeAllModle()
  //销毁点击事件
  disposeAllClickHandlers()
  //销毁音频

  engine?.dispose()
  camera?.dispose()
  light?.dispose()
  scene.dispose()
  // console.log("销毁完成",engine,scene);

  scene = undefined
  engine = null
  camera = null
  light = null
  window.removeEventListener("resize", resize)
  location.reload()
}

const resize = () => {
  if (engine) {
    engine.resize()
  }
}
