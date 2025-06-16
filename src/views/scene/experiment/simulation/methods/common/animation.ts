import {
  AbstractMesh,
  Vector3,
  Mesh,
  Animation,
  AnimationEvent,
  AnimationGroup,
  Quaternion,
} from "@babylonjs/core/Legacy/legacy"
import { scene } from "./initScene"
import { config } from "../common/config"
import type { NumberArray, AnimationItem, AnimationKey } from "./interface"
import { posTranslate } from "./action"

const frameRate = config.frameRate
const PI = Math.PI

export function createAnimeGroup(groupName: string, animationList: AnimationItem[], option?: any) {
  const animeGroup = new AnimationGroup(groupName)
  animationList.forEach((e: AnimationItem, i) => {
    animeGroup.addTargetedAnimation(e.animation, e.mesh)
  })
  return animeGroup
}
type PathPoint = NumberArray | { pause: number } | number

/**
 * 生成关键帧动画数组
 * @param {Array} pathList - 动画步骤，可以是位置或 { pause: 秒 }
 * @param {number} [step=0.5] - 间隔 单位都是frameRate:30
 * @param {number} [start=0] - 起始 单位都是frameRate:30
 * @returns {Array} 关键帧数组，格式 [{ frame, value }]
 */
export function createKeyframes(pathList: PathPoint[], step = 0.5, start = 0) {
  const keyframes = [] as AnimationKey[]
  const frameRate = 30
  let currentFrame = (start - step) * frameRate

  pathList.forEach((point, i) => {
    if (typeof point === "object" && "pause" in point) {
      if (i === 0) return
      // 处理暂停 { pause: 0.5 }
      currentFrame += point.pause * frameRate
      keyframes.push({
        frame: currentFrame,
        value: pathList[i - 1] as number | number[],
      })
    } else {
      currentFrame += step * frameRate
      // 处理位置关键帧
      keyframes.push({
        frame: currentFrame,
        value: point,
      })
    }
  })

  return keyframes
}

/**
 * 改变目标大小
 * @param targetProperty  目标属性
 * @param key 关键帧
 * @returns 动画
 */
export function changeSizeAni(targetProperty: string, key: AnimationKey[]) {
  const changeSize = new Animation(
    "changeSize",
    targetProperty,
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
  )

  changeSize.setKeys(getKey(key))
  return changeSize
}
export function addWaterAni() {
  // 2. 液体高度动画
  const changeSize = new Animation(
    "changeSize",
    "scaling.y",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
  )

  changeSize.setKeys([
    { frame: 0, value: 0.01 },
    { frame: frameRate * 4, value: 0.01 },
    { frame: frameRate * 6, value: 1 },
  ])
  return changeSize
}

/**
 * 移动目标物体位置
 * @param targetProperty  目标属性
 * @param key 关键帧
 * @returns 动画
 */

export function moveAni(targetProperty: string, key: AnimationKey[]) {
  const movein = new Animation(
    "move",
    targetProperty,
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
  )

  movein.setKeys(getKey(key))
  return movein
}
/**
 * 旋转目标物体
 * @param targetProperty  目标属性
 * @param key 关键帧
 * @returns 动画
 */
export function rotateAni(targetProperty: string, key: AnimationKey[]) {
  const rotate = new Animation(
    "rotate",
    targetProperty,
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
  )
  rotate.setKeys(getKey(key))
  return rotate
}

export function customRotate(mesh: any, axis: number[]) {
  if (!scene) return
  // 1. 定义自定义旋转轴（例如[1, 1, 0]）
  const customAxis = new Vector3(...axis).normalize()

  // // 1. 创建不可见的父容器作为旋转中心
  // const pivot = new TransformNode("pivot");
  // pivot.position = new Vector3(2, 3, 4); // 设置旋转中心点坐标

  // // 2. 将mesh设为pivot的子对象，并调整mesh位置使其相对旋转中心正确
  // mesh.parent = pivot;
  // mesh.position = mesh.position.subtract(pivot.position); // 使mesh相对于pivot定位

  // // 3. 旋转父容器
  // scene.registerBeforeRender(() => {
  //     pivot.rotate(Axis.Y, 0.01, Space.WORLD); // 围绕世界Y轴旋转
  //     // 或围绕自定义轴：
  //     // pivot.rotate(customAxis, 0.01, Space.WORLD);
  // });

  // 2. 创建动画
  const animationDuration = 5 // 动画持续时间(秒)
  const totalFrames = frameRate * animationDuration

  // 创建旋转动画
  const animation = new Animation(
    "customRotation",
    "rotationQuaternion",
    frameRate,
    Animation.ANIMATIONTYPE_QUATERNION,
    Animation.ANIMATIONLOOPMODE_CYCLE,
  )

  // 3. 创建关键帧
  const keys = []
  for (let frame = 0; frame <= totalFrames; frame++) {
    // 计算当前角度（完整旋转2π）
    const angle = (frame / totalFrames) * 2 * Math.PI

    // 创建四元数旋转
    const rotationQuaternion = Quaternion.RotationAxis(customAxis, angle)

    keys.push({
      frame: frame,
      value: rotationQuaternion,
    })
  }

  // 设置关键帧
  animation.setKeys(keys)

  // 4. 确保mesh有rotationQuaternion
  if (!mesh.rotationQuaternion) {
    mesh.rotationQuaternion = Quaternion.FromEulerAngles(
      mesh.rotation.x,
      mesh.rotation.y,
      mesh.rotation.z,
    )
  }

  // 5. 添加并运行动画
  mesh.animations = [animation]
  scene.beginAnimation(mesh, 0, totalFrames, true)
}

function getKey(key: AnimationKey[]) {
  return key.map((e) => {
    if (Array.isArray(e.value)) {
      return {
        frame: e.frame,
        value: new Vector3(...e.value),
      }
    } else if (e.value instanceof Vector3) {
      // 如果已经是 Vector3，直接返回
      return {
        frame: e.frame,
        value: e.value,
      }
    }
    return e
  })
}

/**
 * 移动瓶盖
 * @param mesh  目标
 * @param translate 相对位移位置
 * @param start 开始时间
 * @param pause 瓶盖离开时间
 * @returns 动画
 */

export function moveLid(mesh: Mesh | AbstractMesh, translate: NumberArray, start = 0, pause = 5) {
  const position = mesh.position.clone()
  return {
    mesh,
    animation: moveAni(
      "position",
      createKeyframes(
        [
          [position.x, position.y, position.z],
          [position.x, position.y + 0.2, position.z],
          [position.x + translate[0], position.y + translate[1], position.z + translate[2]],
          { pause },
          [position.x, position.y + 0.2, position.z],
          [position.x, position.y, position.z],
        ],
        0.5,
        start,
      ),
    ),
  }
}

export function translateMove(
  mesh: Mesh | AbstractMesh,
  translate: NumberArray,
  speed = 1,
  start = 0,
) {
  const position = mesh.position.clone()

  return {
    mesh,
    animation: moveAni(
      "position",
      createKeyframes(
        [
          [position.x, position.y, position.z],
          [position.x + translate[0], position.y + translate[1], position.z + translate[2]],
        ],
        speed,
        start,
      ),
    ),
  }
}
export function moveAnimation(
  mesh: Mesh | AbstractMesh,
  pathList: PathPoint[],
  step = 0.5,
  start = 0,
) {
  return {
    mesh,
    animation: moveAni("position", createKeyframes(pathList, step, start)),
  }
}
export function createPositionKey(position: NumberArray, up = 0.3, down = 0.05, pause = 0.5) {
  return [
    posTranslate(position, [0, up, 0]),
    posTranslate(position, [0, down, 0]),
    { pause },
    posTranslate(position, [0, up, 0]),
  ]
}
export function rotateAnimation(
  mesh: Mesh | AbstractMesh,
  axis: string,
  pause?: number,
  start = 0,
  angle = PI / 2,
) {
  const key = [0, angle] as any
  if (pause !== undefined) {
    key.push({ pause })
    key.push(0)
  }
  return {
    mesh: mesh,
    animation: rotateAni("rotation." + axis, createKeyframes(key, 1, start)),
  }
}

export function rotateAllAnimation(mesh: Mesh | AbstractMesh, range: PathPoint[], start = 0) {
  const key = createKeyframes(range, 1, start)
  const rotate = new Animation(
    "rotation",
    "rotation",
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CYCLE,
  )
  rotate.setKeys(getKey(key))

  return {
    mesh: mesh,
    animation: rotate,
  }
}

/**
 * 移动瓶盖
 * @param mesh  目标
 * @param targetProperty 根据x或y或z轴缩小
 * @param sizeChange 大小变化范围 [0,1]
 * @param start 开始时间
 * @returns 动画
 */
export function changeSizeAnimation(
  mesh: Mesh | AbstractMesh,
  targetProperty: string,
  sizeChange: number[],
  start?: number,
) {
  return {
    mesh: mesh,
    animation: changeSizeAni("scaling." + targetProperty, createKeyframes(sizeChange, 1, start)),
  }
}

/**
 * 控制动画组播放并绑定帧事件
 * @param animationGroup 动画组对象
 * @param handlerList 帧事件列表
 * @param speedRatio 播放速度比例，默认为 0.2
 */
export function controlAnimationGroup(
  animationGroup: AnimationGroup,
  handlerList: {
    frame: number
    handler: (currentFrame: number) => void
  }[],
  speedRatio = 0.2,
) {
  // 参数校验
  if (!animationGroup) {
    console.warn("controlAnimationGroup: animationGroup is null or undefined")
    return
  }

  // 获取目标动画对象
  const targetAnimation = animationGroup.children?.[0].animation

  if (!targetAnimation) {
    console.warn("controlAnimationGroup: target animation is missing")
    return
  }

  // 绑定事件
  if (handlerList.length) {
    handlerList.forEach((item) => {
      try {
        const evt = new AnimationEvent(item.frame, item.handler, true)
        targetAnimation.addEvent(evt)
      } catch (error) {
        console.error("controlAnimationGroup: failed to create AnimationEvent", error)
      }
    })
  }

  // 启动动画
  animationGroup.start()
  animationGroup.speedRatio = speedRatio
}
