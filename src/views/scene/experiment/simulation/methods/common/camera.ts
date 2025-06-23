import {
  ArcRotateCamera,
  Vector3,
  Animation,
  SineEase,
  EasingFunction,
} from "@babylonjs/core/Legacy/legacy"
import { config } from "./config"
import type { NumberArray } from "./interface"
import { scene } from "./initScene"
const { watchPoint } = config

export class CreateCamera {
  private camera: ArcRotateCamera | null = null
  private animationInProgress: boolean = false
  constructor(
    canvasDom: HTMLCanvasElement,
    option?: { alpha?: number; beta?: number; radius?: number; target?: Vector3 },
  ) {
    this.camera = new ArcRotateCamera(
      "camera",
      option?.alpha ?? 2,
      option?.beta ?? 0.95,
      option?.radius ?? 2,
      option?.target ?? new Vector3(...watchPoint),
      scene,
    )
    // 调整滚轮缩放灵敏度 (默认值为3.0)
    this.camera.wheelPrecision = 200 // 值越大，缩放越慢；值越小，缩放越快

    // 可选：限制缩放距离
    this.camera.lowerRadiusLimit = 0 // 最小距离
    this.camera.upperRadiusLimit = 10 // 最大距离
    this.camera.minZ = 0.0 // 最小近裁剪面（避免穿模）
    this.camera.maxZ = 100 // 远裁剪面（根据场景调整）
    // this.camera.lowerBetaLimit = 0.5 // 最小垂直角度(避免完全垂直向下看)
    this.camera.upperBetaLimit = 2 // 最大垂直角度(π/2是水平视角)
    this.camera.attachControl(canvasDom, true)
  }

  /**
   * 平滑聚焦到目标位置
   * @param position 目标位置
   * @param option 可选参数
   * @param duration 过渡时间（秒），默认1秒
   */
  public focusOn(
    position: NumberArray,
    option?: {
      alpha?: number
      beta?: number
      radius?: number
    },
    duration: number = 0.5,
  ) {
    if (!this.camera || this.animationInProgress) return

    this.animationInProgress = true
    const target = new Vector3(...position)

    // 创建动画组
    const animations: Animation[] = []

    // 目标位置动画
    const targetAnimation = new Animation(
      "cameraTargetAnimation",
      "target",
      60,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    )

    const targetKeys = [
      { frame: 0, value: this.camera.target.clone() },
      { frame: 60 * duration, value: target },
    ]
    targetAnimation.setKeys(targetKeys)
    animations.push(targetAnimation)

    // Alpha旋转动画
    if (option?.alpha !== undefined) {
      const alphaAnimation = new Animation(
        "cameraAlphaAnimation",
        "alpha",
        60,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )

      const alphaKeys = [
        { frame: 0, value: this.camera.alpha },
        { frame: 60 * duration, value: option.alpha },
      ]
      alphaAnimation.setKeys(alphaKeys)
      animations.push(alphaAnimation)
    }

    // Beta角度动画
    if (option?.beta !== undefined) {
      const betaAnimation = new Animation(
        "cameraBetaAnimation",
        "beta",
        60,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )

      const betaKeys = [
        { frame: 0, value: this.camera.beta },
        { frame: 60 * duration, value: option.beta },
      ]
      betaAnimation.setKeys(betaKeys)
      animations.push(betaAnimation)
    }

    // 半径动画
    if (option?.radius !== undefined) {
      const radiusAnimation = new Animation(
        "cameraRadiusAnimation",
        "radius",
        60,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )

      const radiusKeys = [
        { frame: 0, value: this.camera.radius },
        { frame: 60 * duration, value: option.radius },
      ]
      radiusAnimation.setKeys(radiusKeys)
      animations.push(radiusAnimation)
    }

    // 使用缓动函数使动画更平滑
    const easingFunction = new SineEase()
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)

    animations.forEach((anim) => {
      anim.setEasingFunction(easingFunction)
    })
    if (!scene) return
    // 开始动画
    scene.beginDirectAnimation(this.camera, animations, 0, 60 * duration, false, 1, () => {
      // 动画完成回调
      this.animationInProgress = false
    })
  }

  public resetCamera() {
    if (!this.camera) return
    this.camera.setTarget(new Vector3(...watchPoint))
    this.camera.alpha = 2
    this.camera.beta = 0.95
    this.camera.radius = 2
  }

  public dispose() {
    this.camera?.dispose()
    this.camera = null
  }
}
