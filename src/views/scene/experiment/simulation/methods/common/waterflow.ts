import {
  ParticleSystem,
  Texture,
  Color4,
  Color3,
  MeshBuilder,
  Vector3,
  Scene,
  AnimationGroup,
  AnimationEvent,
} from "@babylonjs/core"
import { scene } from "./initScene"
import type { NumberArray } from "./interface"
import { getTexturesAssetsUrl } from "@/utils/getBabylonAssets.ts"
export function createVerticalWaterStream(emitterPosition: NumberArray, duration = 1) {
  // 创建粒子系统用于模拟水流
  const waterParticles = new ParticleSystem("waterStream", 2000, scene as Scene)

  // 设置粒子纹理（水滴或液体贴图）
  waterParticles.particleTexture = new Texture(getTexturesAssetsUrl("water.png"), scene)

  // 设置发射器为一个不可见的平面（用于控制发射方向）
  const emitter = MeshBuilder.CreateDisc(
    "emitter",
    {
      radius: 0.1,
      tessellation: 16,
    },
    scene,
  )
  emitter.position = new Vector3(...emitterPosition)
  emitter.isVisible = false

  waterParticles.emitter = emitter // 设置发射器位置
  waterParticles.minEmitBox = new Vector3(-0.05, 0, -0.05) // 发射区域范围
  waterParticles.maxEmitBox = new Vector3(0.05, 0, 0.05)

  // 粒子颜色渐变
  waterParticles.color1 = new Color4(0.6, 0.8, 1.0, 1.0)
  waterParticles.color2 = new Color4(0.7, 0.9, 1.0, 0.8)
  waterParticles.colorDead = new Color4(0.5, 0.7, 1.0, 0.0)

  // 粒子大小范围
  waterParticles.minSize = 0.05
  waterParticles.maxSize = 0.15

  // 生命周期控制
  waterParticles.minLifeTime = 1.0
  waterParticles.maxLifeTime = 2.0

  // 发射速率和频率
  waterParticles.emitRate = 200
  waterParticles.updateSpeed = 0.01

  // 重力影响（向下加速）
  waterParticles.gravity = new Vector3(0, -1.0, 0)

  // 初始速度方向（垂直向下）
  waterParticles.direction1 = new Vector3(0, -1, 0)
  waterParticles.direction2 = new Vector3(0, -1, 0)

  // 启动粒子系统
  waterParticles.start()

  const startAlpha = 1
  const targetAlpha = 0
  const startTime = performance.now()

  const updateAlpha = () => {
    const now = performance.now()
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const currentAlpha = startAlpha + (targetAlpha - startAlpha) * progress

    // 修改粒子颜色透明度
    waterParticles.color1.a = currentAlpha
    waterParticles.color2.a = currentAlpha
    waterParticles.colorDead.a = 0 // 最终完全透明

    if (progress < 1) {
      requestAnimationFrame(updateAlpha)
    } else {
      waterParticles.stop() // 完全透明后停止系统
    }
  }

  updateAlpha()
  return waterParticles
}
