import { scene } from "./initScene"
import {
  HighlightLayer,
  Mesh,
  Color3,
  Scene,
  PickingInfo,
  ExecuteCodeAction,
  ActionManager,
  Vector3,
  BoundingInfo,
  StandardMaterial,
  MeshBuilder,
  ParticleSystem,
  Texture,
  Color4,
  AbstractMesh,
  SpriteManager,
  Sprite,
} from "@babylonjs/core"
import { AudioPlayer } from "@/utils/audioPlayer"
import { getAssetUrl } from "@/utils/assetHelper"
import type { NumberArray } from "./interface"
import { experimentScore } from "@/stores/experimentStore"
import { getTexturesAssetsUrl } from "@/utils/getBabylonAssets"
const expInfo = experimentScore()
let highlightLayer = null as null | HighlightLayer

let arrowSprite = null as null | Sprite

const jumpSpeed = 0.001
const maxJumpHeight = 0.05
export function addHighlight(meshes: Mesh[]) {
  if (!scene) return
  highlightLayer = new HighlightLayer("hl1", scene)
  const arrList = [] as number[]
  // 点击时高亮
  meshes.forEach((e) => {
    highlightLayer?.addMesh(e, new Color3(151 / 255, 1, 1))
    const boundingBox = e.getBoundingInfo().boundingBox
    const height = boundingBox.maximumWorld.y - boundingBox.minimumWorld.y
    arrList.push(height)
  })
  const maxHeight = Math.max(...arrList)
  const p = meshes[0].getAbsolutePosition()

  const spriteManager = new SpriteManager(
    "arrowManager",
    getTexturesAssetsUrl("arrow_down.png"), // 替换为你的箭头图片路径
    1, // 容量
    64, // 单元格大小
    scene,
  )
  arrowSprite = new Sprite("arrowSprite", spriteManager)
  arrowSprite.size = 0.1 // 初始大小

  // 跳动动画变量
  arrowSprite.isVisible = true
  // 在渲染循环中添加跳动效果
  let jumpHeight = 0
  let jumpDirection = 1
  scene.registerBeforeRender(() => {
    if (arrowSprite && arrowSprite.isVisible) {
      // 更新跳动高度
      jumpHeight += jumpSpeed * jumpDirection
      // 改变方向当达到最高或最低点
      if (jumpHeight > maxJumpHeight) {
        jumpDirection = -1
      } else if (jumpHeight < 0) {
        jumpDirection = 1
      }
      arrowSprite.position.x = p.x
      arrowSprite.position.y = p.y + maxHeight + jumpHeight + 0.1
      arrowSprite.position.z = p.z
    }
  })
}

export function removeHighlight() {
  highlightLayer?.removeAllMeshes()
  highlightLayer?.dispose()
  highlightLayer = null
  if (arrowSprite) arrowSprite.isVisible = false
}



// 存储所有活动的点击处理器以便后续清理
// 修改类型定义以匹配 BabylonJS 的 pointer down 回调签名
const activeClickHandlers = new Map<Scene, (evt: any, pickResult: PickingInfo) => void>()

export function click(meshes: Mesh[], event: () => void, missEvent: () => void) {
  if (!scene) return

  // 先清理之前的处理器（如果存在）
  if (activeClickHandlers.has(scene)) {
    scene.onPointerDown = undefined
    activeClickHandlers.delete(scene)
  }

  const handler = (evt: any, pickResult: PickingInfo) => {
    if (!pickResult.hit || !pickResult.pickedMesh) return

    if (meshes.includes(pickResult.pickedMesh as Mesh)) {
      expInfo.tipMessage = ""
      event()
      removeHighlight()

      // 清理当前处理器
      if (scene) {
        scene.onPointerDown = undefined
        activeClickHandlers.delete(scene)
      }
    } else {
      missEvent()
      expInfo.tipMessage = "请点击" + meshes[0].name
    }
  }

  // 存储新处理器
  scene.onPointerDown = handler
  activeClickHandlers.set(scene, handler)
}
export function addClickHelper(mesh: Mesh, sizeMultiplier = 2) {
  // 创建不可见的辅助碰撞体
  const helper = MeshBuilder.CreateSphere(
    `${mesh.name}_H`,
    { diameter: mesh.getBoundingInfo().boundingSphere.radius * sizeMultiplier },
    scene,
  )

  helper.isVisible = false
  helper.isPickable = true
  helper.parent = mesh

  // 将原始mesh设为不可点击
  mesh.isPickable = false

  return helper
}
// 添加全局清理方法
export function disposeAllClickHandlers() {
  for (const [scene, _] of activeClickHandlers) {
    scene.onPointerDown = undefined
  }
  activeClickHandlers.clear()
}

const infoPanel = document.createElement("div")
document.body.appendChild(infoPanel)

export function addMouseOverInfo(mesh: any, meshName?: string) {
  if (!scene) return
  // 防止重复注册
  if (mesh.hasMouseOverAction) return
  // 确保mesh有名称
  mesh.name = meshName || mesh.name || "未命名Mesh"

  // 初始化ActionManager
  mesh.actionManager = mesh.actionManager || new ActionManager(scene)

  //高亮效果

  mesh.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, function () {
      if (!scene) return
      // 高亮效果
      // hl.addMesh(mesh, new Color3(151 / 255, 1, 1))
      // 显示信息
      showMeshInfo(mesh, scene.pointerX, scene.pointerY)
    }),
  )

  // 鼠标移出事件
  mesh.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
      // 隐藏信息
      hideMeshInfo()
    }),
  )

  function showMeshInfo(mesh: any, x: number, y: number) {
    infoPanel.style.position = "absolute"
    infoPanel.style.backgroundColor = "rgba(0,0,0,0.7)"
    infoPanel.style.color = "white"
    infoPanel.style.padding = "10px"
    infoPanel.style.borderRadius = "5px"
    infoPanel.style.pointerEvents = "none"
    infoPanel.style.zIndex = "1000"
    infoPanel.style.maxWidth = "300px"

    // 收集mesh信息
    const info = `<strong>${mesh.name || "未命名对象"}</strong>`
    infoPanel.style.left = x + 10 + "px"
    infoPanel.style.top = y + 10 + "px"
    infoPanel.innerHTML = info
    infoPanel.style.display = "block"
  }

  function hideMeshInfo() {
    infoPanel.style.display = "none"
  }
}

export function disposeMouseOverInfo(mesh: Mesh) {
  if (mesh.actionManager) {
    mesh.actionManager.unregisterAction(mesh.actionManager.actions[0]) // 可更精细控制
    mesh.actionManager = null
  }
}

export function move(mesh: any, position: NumberArray) {
  if (!mesh || position?.length < 3) return
  mesh.position = new Vector3(...position)
}
export function rotate(mesh: any, rotation: NumberArray) {
  if (!mesh || !rotation || rotation?.length < 3) return
  mesh.rotation = new Vector3(...rotation)
}
export function scale(mesh: any, scale: NumberArray | number) {
  if (Array.isArray(scale)) {
    mesh.scaling = new Vector3(...scale)
  } else if (typeof scale === "number") {
    mesh.scaling = new Vector3(scale, scale, scale)
  }
}
export function posTranslate(position: NumberArray, translate: NumberArray): NumberArray {
  return [position[0] + translate[0], position[1] + translate[1], position[2] + translate[2]]
}
function addBoundingBox(mesh: Mesh) {
  mesh.showBoundingBox = true
  let sphereMin = mesh.getBoundingInfo().boundingBox.minimum
  let sphereMax = mesh.getBoundingInfo().boundingBox.maximum
  console.log(sphereMin, sphereMax)
  const min = new Vector3(sphereMin.x - 0.02, sphereMin.y - 0.02, sphereMin.z - 0.02) // 扩大最小边界
  const max = new Vector3(sphereMax.x + 0.02, sphereMax.y + 0.02, sphereMax.z + 0.02) // 扩大最大边界
  mesh.setBoundingInfo(new BoundingInfo(min, max))
}

let animationId: number | null = null

export function animate(item: any, duration: number) {
  if (!scene) return

  const startTime = performance.now()

  function animateStep() {
    if (!scene) return

    const currentTime = performance.now()
    const elapsedTime = currentTime - startTime

    if (elapsedTime < duration) {
      // 更新动画
      item.mesh.position.y = Math.sin(elapsedTime / 1000) * 2

      animationId = requestAnimationFrame(animateStep)
    } else {
      // 动画完成时停止
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null

        // 添加生成血液的逻辑
        if (item && item.bloodTube) {
          generateBlood(item.bloodTube)
        }
      }
    }
  }

  animationId = requestAnimationFrame(animateStep)
}

// 修改后的生成血液函数：模拟红色液体流入瓶子
function generateBlood(bottle: any) {
  if (!scene || !bottle) return

  const boundingInfo = bottle.getBoundingInfo()
  const boundingBox = boundingInfo.boundingBox
  const height = boundingBox.maximum.y - boundingBox.minimum.y
  const diameter = boundingBox.maximum.x - boundingBox.minimum.x

  // 创建液体材质
  const liquidMaterial = new StandardMaterial("liquidMat", scene)
  liquidMaterial.diffuseColor = new Color3(1, 0, 0) // 红色
  liquidMaterial.alpha = 0.8 // 半透明

  // 创建初始液面
  let liquidHeight = 0
  const liquid = MeshBuilder.CreateCylinder(
    "liquid",
    {
      height: liquidHeight,
      diameter: diameter * 0.9, // 略小于瓶子直径
      tessellation: 32,
    },
    scene,
  )
  liquid.material = liquidMaterial
  liquid.position.y = boundingBox.minimum.y + liquidHeight / 2 // 液面从底部开始

  // 将液体设置为瓶子的子对象
  liquid.setParent(bottle)

  // 模拟液体逐渐升高的动画
  const fillSpeed = 0.01 // 液面上升速度
  const targetLiquidHeight = height * 0.8 // 液体填充到瓶子高度的80%

  function updateLiquid() {
    if (liquidHeight < targetLiquidHeight) {
      liquidHeight += fillSpeed
      liquid.scaling.y = liquidHeight // 调整液面高度
      liquid.position.y = boundingBox.minimum.y + liquidHeight / 2 // 更新液面位置

      requestAnimationFrame(updateLiquid)
    }
  }

  updateLiquid()
}

const audioPlayer = new AudioPlayer()
// 在用户交互事件中加载和播放音频
let volume = 1
export async function playAudio(index: number, onEndCallback?: () => void) {
  try {
    const url = getAssetUrl(`audio/${index}.mp3`)
    if (onEndCallback) {
      audioPlayer.setOnEnded(onEndCallback)
    }
    audioPlayer.play(url)
    audioPlayer.setVolume(volume)
  } catch (error) {
    console.error("音频播放错误", error)
  }
}
export function stopAudio() {
  audioPlayer.stop()
}

export function switchAudioVolume(status: boolean) {
  volume = status ? 1 : 0
  audioPlayer.setVolume(volume)
}
export function createLiquid(
  bottle: any,
  height = 0.12,
  diameter = 0.03,
  transformY = 0.05,
  color = [1, 0, 0],
  alpha = 1,
): Mesh | undefined {
  if (!scene) return
  // 创建圆柱体作为液体
  const liquid = MeshBuilder.CreateCylinder(
    "liquid",
    {
      height,
      diameter,
      tessellation: 32,
    },
    scene,
  )

  // 将轴心点移动到圆柱体底部
  liquid.setPivotPoint(new Vector3(0, -height / 2, 0))
  // 对齐到瓶子底部
  liquid.parent = bottle
  liquid.position.y = transformY // 调整Y轴位置

  // 设置半透明材质
  const mat = new StandardMaterial("liquidMat", scene)
  mat.diffuseColor = new Color3(...color) // 红色
  mat.alpha = alpha
  liquid.material = mat

  return liquid
}

/**
 * 创建沙粒效果的粒子系统
 * @param position 起始位置
 * @param color 颗粒颜色（默认为沙土色）
 * @param particleCount 粒子数量（默认1000）
 * @param duration 持续时间（默认1秒）
 * @returns 配置好的粒子系统
 */
export function createWaterFlow(
  position: NumberArray,
  color = [0.1, 0.9, 0.9],
  particleCount: number = 100,
  duration: number = 1, // 新增参数：持续时间
) {
  if (!scene) return
  // 创建粒子系统
  const particleSystem = new ParticleSystem("particles", particleCount, scene)

  // 配置粒子属性
  const p = new Vector3(...position)

  //Texture of each particle
  particleSystem.particleTexture = new Texture(getTexturesAssetsUrl("water.png"), scene)

  // Where the particles come from
  particleSystem.emitter = p
  // Colors of all particles
  particleSystem.color1 = new Color4(0.4, 1.5, 0.3, 1.0)
  particleSystem.color2 = new Color4(0.4, 1.5, 0.3, 1.0)
  particleSystem.colorDead = new Color4(0.4, 1.5, 0.3, 1.0)
  // Size of each particle (random between...
  particleSystem.minSize = 0.05
  particleSystem.maxSize = 0.06

  // Life time of each particle (random between...
  particleSystem.minLifeTime = 0.1
  particleSystem.maxLifeTime = 0.1

  // Emission rate
  particleSystem.emitRate = 500

  /******* Emission Space ********/
  particleSystem.createPointEmitter(new Vector3(0, -1, 0), new Vector3(0, -1, 0))

  // Speed
  particleSystem.minEmitPower = 1
  particleSystem.maxEmitPower = 2
  particleSystem.updateSpeed = 0.005

  const fluidRenderer = scene.enableFluidRenderer()
  fluidRenderer?.addParticleSystem(particleSystem)
  if (fluidRenderer) fluidRenderer.targetRenderers[0].fluidColor = new Color3(...color)

  // Start the particle system
  particleSystem.start()

  // 新增基于requestAnimationFrame的定时逻辑
  if (duration > 0) {
    const startTime = performance.now()
    let animationFrameId: number

    const checkDuration = () => {
      const elapsedTime = (performance.now() - startTime) / 1000 // 转换为秒
      if (elapsedTime >= duration || !particleSystem.isStarted) {
        if (particleSystem && particleSystem.isStarted()) {
          particleSystem.stop()
        }
        // 清理动画帧请求
        if (animationFrameId) {
          particleSystem.dispose()
          fluidRenderer?.dispose()
          cancelAnimationFrame(animationFrameId)
        }
      } else {
        animationFrameId = requestAnimationFrame(checkDuration)
      }
    }

    // 启动检查循环
    animationFrameId = requestAnimationFrame(checkDuration)
  }

  return particleSystem
}
export function showMeshes(meshes: AbstractMesh[] = [], state = true) {
  meshes.forEach((e) => {
    e.setEnabled(state)
  })
}
