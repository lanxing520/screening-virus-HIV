import { item, resetItems } from "../common/loadModle"
import { itemData1, tubePoints, models } from "./itemData"
import { scene, camera } from "../common/initScene"
import {
  ImportMeshAsync,
  StandardMaterial,
  Mesh,
  Color3,
  MeshBuilder,
  Vector3,
  AbstractMesh,
  AnimationGroup,
  AnimationEvent,
} from "@babylonjs/core"
import type { ISceneLoaderAsyncResult } from "@babylonjs/core"
import { AnimationStepManager } from "../common/stepManager"
import {
  changeSizeAni,
  moveAni,
  moveAnimation,
  rotateAni,
  translateMove,
} from "../common/animation"
import { createBezierPath } from "../common/curvePath"
import { createTube } from "./tube"
import {
  move,
  rotate,
  scale,
  addMouseOverInfo,
  playAudio,
  createLiquid,
  showMeshes,
  posTranslate,
} from "../common/action"

import { stepIndex } from "../common/stepManager"
import { config } from "../common/config"
import type { NumberArray } from "../common/interface"
import { questionStore } from "@/stores/expQuestionStore"

const frameRate = config.frameRate
const PI = Math.PI

let person = null as null | ISceneLoaderAsyncResult
let anim: AnimationGroup | null = null
async function loadTester() {
  if (!scene) return
  if (person) return

  const stool = await ImportMeshAsync(`${import.meta.env.BASE_URL}/model/scene/凳子.glb`, scene)
  stool.meshes[0].position = new Vector3(3.3, 0.05, -3.5)
  person = await ImportMeshAsync(`${import.meta.env.BASE_URL}/model/item/HIV测试者.glb`, scene)
  person.meshes[0].position = new Vector3(3.2, 0.28, -3.5)
  person.meshes[0].rotation = new Vector3(0, -PI / 2, 0)
  anim = person.animationGroups[0]
  anim.speedRatio = 0.05
  // anim.stop() // 停止动画
  anim.to = 4.8
  anim.onAnimationGroupLoopObservable.add(() => {
    anim?.pause()
    anim?.goToFrame(4.8)
  })
}
let animationId: number | null = null
let segments: Mesh[] = []
let tube: Mesh | null = null
const mq = itemData1.sterileSwab
let mq2: AbstractMesh | null = null
let zxd: AbstractMesh | null | undefined = null
let zxdOriginPosition: Vector3
let needle1: AbstractMesh | null = null
let needle2: AbstractMesh | null = null
const xds = itemData1.disinfectant
const wwt = itemData1.wasteBucket
let dcxq: Mesh | undefined //待测血清
let stepManager: AnimationStepManager | null = null
const stroe = questionStore()
export async function initStep1() {
  await loadTester()
  stepManager = new AnimationStepManager()
  dcxq = createLiquid(item.bloodTube.meshes[0], 0.05)
  if (dcxq) dcxq.scaling.y = 0
  // 注册模型
  Object.keys(itemData1).forEach((key) => {
    stepManager?.registerModel(key, item[key].meshes)
  })
  zxd = person?.meshes[3]

  if (zxd) {
    zxd.setParent(null)
    stepManager?.registerModel("zxd", [zxd])
    zxdOriginPosition = new Vector3(3.384, 1.21, -3.3)
  }
  await createMyNeedle()
  if (tube) stepManager?.registerModel("tube", [tube])
  mq2 = item.sterileSwab.meshes[1].clone("棉签2", null, true)

  if (mq2) {
    mq2.setParent(null)
    mq2.position = new Vector3(mq.position[0], mq.position[1], mq.position[2] - 0.05)
    addMouseOverInfo(mq2)
    stepManager?.registerModel("mq2", [mq2])
  }

  const bottleCaps = item?.disinfectant?.meshes?.[2]
  bottleCaps.setParent(null)
  // 步骤1,棉签消毒
  stepManager.addStep({
    models: {
      sterileSwab: {
        position: mq.position,
      },
    },
    interactions: [
      {
        modelName: "sterileSwab",
        onClick: async () => {
          await stroe.setQuestion(
            "exp1",
            "step1",
            true,
            () => {},
            () => {
              stepManager?.reduceStepScore(1)
            },
          )
          playAudio(6)
        },
        animations: [
          //移动消毒水瓶盖
          {
            mesh: bottleCaps,
            animation: moveAni("position", [
              {
                frame: 0,
                value: xds.position,
              },
              {
                frame: 0.5 * frameRate,
                value: [xds.position[0], xds.position[1] - 0.18, xds.position[2] - 0.1],
              },
            ]),
          },
          //移动棉签
          {
            mesh: item.sterileSwab.meshes[0],
            animation: moveAni("position", [
              {
                frame: 0.5 * frameRate,
                value: mq.position,
              },
              {
                frame: 1 * frameRate,
                value: [xds.position[0], xds.position[1] + 0.5, xds.position[2]],
              },
              {
                frame: 1.5 * frameRate,
                value: [xds.position[0], xds.position[1] + 0.2, xds.position[2]],
              },
              {
                frame: 2 * frameRate,
                value: [xds.position[0], xds.position[1] + 0.5, xds.position[2]],
              },
              {
                frame: 2.5 * frameRate,
                value: [3.62, 1.175, -3.28],
              },
              {
                frame: 5.5 * frameRate,
                value: [3.63, 1.17, -3.28],
              },
              {
                frame: 6.5 * frameRate,
                value: [wwt.position[0] + 0.1, wwt.position[1] + 0.4, wwt.position[2]],
              },
            ]),
          },
          {
            mesh: item.sterileSwab.meshes[0],
            animation: rotateAni("rotation.z", [
              {
                frame: 0.5 * frameRate,
                value: PI / 2,
              },
              {
                frame: 0.8 * frameRate,
                value: PI,
              },
              {
                frame: 2 * frameRate,
                value: PI,
              },
              {
                frame: 2.3 * frameRate,
                value: PI / 2,
              },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      showMeshes(item.sterileSwab.meshes)
    },
  })

  // 定义步骤2,扎针
  stepManager.addStep({
    models: {},
    onEnter: async () => {},
    interactions: [
      {
        modelName: "bloodNeedle",
        onClick: async () => {
          await stroe.setQuestion(
            "exp1",
            "step2",
            true,
            () => {},
            () => {
              stepManager?.reduceStepScore(1)
            },
          )
          showNeedle()
        },
        animations: [
          {
            mesh: tube as Mesh,
            animation: moveAni("position", [
              {
                frame: 0 * frameRate,
                value: [0.8, 0, -0.2],
              },
              {
                frame: 1 * frameRate,
                value: [-0.05, 0, 0],
              },
            ]),
          },
        ],
      },
    ],
  })

  const moveBloodTubeAnim = moveAni("position", [
    {
      frame: 0 * frameRate,
      value: itemData1.bloodTube.position,
    },
    {
      frame: 1 * frameRate,
      value: [3.97, 1.16, -3.18] as NumberArray,
    },
  ])
  moveBloodTubeAnim.addEvent(
    new AnimationEvent(1 * frameRate, () => {
      startTubeAnimation()
    }),
  )
  // 定义步骤3,血液流入真空管
  stepManager.addStep({
    models: {},
    onEnter: async () => {},
    interactions: [
      {
        modelName: "bloodTube",
        onClick: async () => {},
        animations: [
          {
            mesh: item.bloodTube.meshes[0],
            animation: moveBloodTubeAnim,
          },
        ],
        animationRange: [0, 3 * frameRate],
      },
    ],
    onExit: async () => {},
  })
  // 定义步骤4,松止血带
  stepManager.addStep({
    models: models.step4,
    onEnter: async () => {},
    interactions: [
      {
        modelName: "zxd",
        onClick: async () => {
          if (person && zxd) {
            // 检查 person 和 meshes[3] 是否存在

            // person.meshes[3].position = new Vector3(4.3, 1.15, -2.2)
            scene?.beginDirectAnimation(
              person.meshes[3],
              [
                moveAni("position", [
                  {
                    frame: 0,
                    value: zxdOriginPosition,
                  },
                  {
                    frame: 1 * frameRate,
                    value: [4.3, 1.15, -2.2],
                  },
                ]),
              ],
              0,
              1 * frameRate,
              false,
              1,
              () => {
                stepIndex.value++
                jumpStep1()
              },
            )
            if (anim) {
              anim.restart()
              anim.speedRatio = -0.05
              anim.onAnimationGroupLoopObservable.add(() => {
                anim?.pause()
                anim?.goToFrame(0)
              })
            }
          }
        },
      },
    ],
    onExit: async () => {},
  })
  // 定义步骤5,拔针
  stepManager.addStep({
    models: models.step4,
    onEnter: async () => {},
    interactions: [
      {
        modelName: "mq2",
        onClick: async () => {},
        animations: [
          //移动棉签2
          {
            mesh: mq2 as AbstractMesh,
            animation: moveAni("position", [
              {
                frame: 0 * frameRate,
                value: mq.position,
              },

              {
                frame: 1 * frameRate,
                value: [3.62, 1.175, -3.28],
              },
              {
                frame: 2 * frameRate,
                value: [3.63, 1.175, -3.28],
              },
              {
                frame: 3 * frameRate,
                value: [wwt.position[0] + 0.1, wwt.position[1] + 0.4, wwt.position[2]],
              },
            ]),
          },
          //拔针
          {
            mesh: tube as AbstractMesh,
            animation: moveAni("position", [
              {
                frame: 1 * frameRate,
                value: [-0.05, 0, 0],
              },
              {
                frame: 1.5 * frameRate,
                value: models.step1.tube,
              },
            ]),
          },
          //移动采血管
          {
            mesh: item.bloodTube.meshes[0],
            animation: moveAni("position", [
              {
                frame: 1 * frameRate,
                value: [3.97, 1.16, -3.18],
              },
              {
                frame: 1.5 * frameRate,
                value: models.step1.bloodTube,
              },
            ]),
          },
        ],
      },
    ],
    onExit: async () => {},
  })

  // 定义步骤6,标记
  stepManager.addStep({
    models: {
      bloodTube: {
        position: models.step1.bloodTube,
        rotation: [0, 0, 0],
      },
    },
    onEnter: async () => {
      playAudio(7)
    },
    interactions: [
      {
        modelName: "pen",
        onClick: async () => {},
        animations: [
          //移动标记笔
          {
            mesh: item.pen.meshes[0],
            animation: moveAni("position", [
              {
                frame: 0,
                value: itemData1.pen.position,
              },
              {
                frame: 0.5 * frameRate,
                value: [
                  itemData1.pen.position[0],
                  itemData1.pen.position[1] + 0.2,
                  itemData1.pen.position[2],
                ],
              },
              {
                frame: 1 * frameRate,
                value: [
                  models.step1.bloodTube[0],
                  models.step1.bloodTube[1] + 0.12,
                  models.step1.bloodTube[2],
                ],
              },
              {
                frame: 2 * frameRate,
                value: [
                  models.step1.bloodTube[0],
                  models.step1.bloodTube[1] + 0.08,
                  models.step1.bloodTube[2],
                ],
              },
              {
                frame: 3 * frameRate,
                value: itemData1.pen.position,
              },
            ]),
          },

          //移动真空采血管
          {
            mesh: item.bloodTube.meshes[0],
            animation: moveAni("position", [
              {
                frame: 0,
                value: models.step1.bloodTube,
              },
              {
                frame: 2 * frameRate,
                value: models.step1.bloodTube,
              },
              {
                frame: 3 * frameRate,
                value: models.step6.bloodTube,
              },
            ]),
          },
        ],
      },
    ],
    onExit: async () => {},
  })
  // 定义步骤7,处理针
  stepManager.addStep({
    models: {
      tube: {
        position: models.step1.tube,
      },
      bloodTube: {
        rotation: [0, 0, 0],
        position: models.step6.bloodTube,
      },
    },
    onEnter: async () => {
      playAudio(8)
      showNeedle()
    },
    interactions: [
      {
        modelName: "tube",
        onClick: async () => {},
        animations: [
          //移动针
          {
            mesh: tube as AbstractMesh,
            animation: moveAni("position", [
              {
                frame: 0,
                value: models.step1.tube,
              },
              {
                frame: 1 * frameRate,
                value: [models.step1.tube[0], models.step1.tube[1] - 0.18, models.step1.tube[2]],
              },
            ]),
          },
        ],
      },
    ],
    onExit: async () => {},
  })
  const lxjg = item.centrifuge.meshes[1]
  // 定义步骤8,血清分离
  stepManager.addStep({
    models: {
      bloodTube: {
        position: models.step6.bloodTube,
      },
    },
    onEnter: async () => {
      playAudio(9)
      item.bloodTube.meshes[0].rotation = new Vector3(0, 0, 0)
      // 重置变换
      lxjg.rotation = Vector3.Zero()
    },
    interactions: [
      {
        modelName: "bloodTube",
        onClick: async () => {},
        animations: [
          // 移动采血管
          {
            mesh: item.bloodTube.meshes[0],
            animation: moveAni("position", [
              {
                frame: 0,
                value: models.step6.bloodTube,
              },
              {
                frame: 1 * frameRate,
                value: models.step6.bloodTube,
              },
              {
                frame: 1.5 * frameRate,
                value: [
                  models.step6.bloodTube[0],
                  models.step6.bloodTube[1] + 0.3,
                  models.step6.bloodTube[2],
                ],
              },
              {
                frame: 2 * frameRate,
                value: models.step9.bloodTube,
              },
            ]),
          },
          {
            mesh: lxjg,
            animation: rotateAni("rotation.x", [
              { frame: 2 * frameRate, value: -0.6 }, // 起始状态
              { frame: 3 * frameRate, value: 0 }, // 旋转0.6弧度
            ]),
          },
        ],
      },
    ],
    onExit: async () => {},
  })
  const bxm = item.refrigerator.meshes[1]

  const blood = createLiquid(item.jtdg.meshes[0], 0.08, 0.003, 0.05, [1, 240 / 255, 200 / 255])
  if (blood) {
    blood.scaling = new Vector3(1, 0, 1)
  }

  // 定义步骤9,保存
  stepManager.addStep({
    models: {
      bloodTube: {
        position: models.step9.bloodTube,
      },
    },
    onEnter: async () => {
      item.bloodTube.meshes[0].rotation = new Vector3(0, 0, 0)
      bxm.rotation = Vector3.Zero()
      item.bloodTube.meshes[2].isVisible = false
      playAudio(10)

      if (dcxq) dcxq.material = createDhMat()
    },
    interactions: [
      {
        modelName: "jtdg",
        onClick: async () => {},
        animations: [
          //移动采血管

          moveAnimation(
            item.bloodTube.meshes[0],
            [
              models.step9.bloodTube,
              posTranslate(models.step9.bloodTube, [0, 0.35, 0.6]),
              { pause: 2 },
              models.step6.bloodTube,
            ],
            1,
          ),
          moveAnimation(
            item.jtdg.meshes[0],
            [
              itemData1.jtdg.position,
              posTranslate(models.step9.bloodTube, [0, 0.55, 0.6]),
              posTranslate(models.step9.bloodTube, [0, 0.35, 0.6]),
              posTranslate(models.step9.bloodTube, [0, 0.55, 0.6]),
              posTranslate(itemData1.lxg.position, [0, 0.1, 0]),
              { pause: 1 },
              itemData1.jtdg.position,
            ],
            1,
          ),
          {
            mesh: blood as Mesh,
            animation: changeSizeAni("scaling.y", [
              { frame: 1.5 * frameRate, value: 0 },
              { frame: 2.5 * frameRate, value: 1 },
              { frame: 3 * frameRate, value: 1 },
              { frame: 3.5 * frameRate, value: 0 },
            ]),
          },
          moveAnimation(
            item.lxg.meshes[0],
            [
              itemData1.lxg.position,
              posTranslate(itemData1.lxg.position, [0, 0.1, 0]),
              posTranslate(itemData1.refrigerator.position, [0, 0.2, 0]),
            ],
            1,
            5,
          ),
          {
            mesh: bxm,
            animation: rotateAni("rotation.y", [
              { frame: 6 * frameRate, value: 0 }, // 起始状态
              { frame: 7 * frameRate, value: PI / 2 }, // 旋转0.6弧度
              { frame: 8 * frameRate, value: 0 },
            ]),
          },
        ],
      },
    ],
    onExit: async () => {
      item.bloodTube.meshes[2].isVisible = true
    },
  })
}

function createDhMat() {
  const mat = new StandardMaterial("liquidMat", scene)
  mat.diffuseColor = new Color3(1, 240 / 255, 200 / 255)
  mat.alpha = 0.95
  return mat
}
async function createMyNeedle() {
  if (!scene) return
  const curve = createBezierPath(tubePoints, 10)
  tube = createTube(curve, 0.002)
  const transparentMaterial = new StandardMaterial("transparentMat", scene)
  transparentMaterial.alpha = 0.2 // 设置透明度（0-1，0为完全透明，1为完全不透明）
  tube.material = transparentMaterial
  const needle1Res = await ImportMeshAsync(
    `${import.meta.env.BASE_URL}/model/item/一次性采血针1.glb`,
    scene,
  )
  const needle2Res = await ImportMeshAsync(
    `${import.meta.env.BASE_URL}/model/item/一次性采血针2.glb`,
    scene,
  )
  needle1 = needle1Res.meshes[0] //针尾插管
  needle2 = needle2Res.meshes[0] //针头插手
  needle1.setParent(tube, true, true)
  needle2.setParent(tube, true, true)
  move(needle1, [3.82, 1.14, -3.18])
  rotate(needle1, [0, 0, 0.4])
  scale(needle1, [0.1, 0.1, 0.1])
  scale(needle2, [0.1, 0.1, 0.1])
  move(needle2, [3.5, 1.16, -3.28])
  rotate(needle2, [0, 0, -0.4])

  tube.isVisible = false // 隐藏管子
}
function showNeedle() {
  if (tube) {
    tube.isVisible = true
    scale(needle1, [10, 10, 10])
    scale(needle2, [10, 10, 10])
  }
}
function createRedMaterial() {
  if (!scene) return
  const redMaterial = new StandardMaterial("redMat", scene)
  redMaterial.alpha = 1 // 设置透明度（0-1，0为完全透明，1为完全不透明）
  redMaterial.diffuseColor = new Color3(1, 0, 0) // 设置漫反射颜色（红色）
  return redMaterial
}

let visibleSegments = 1
const growthInterval = 5 // 控制生长速度(毫秒)
const curve2 = createBezierPath(
  tubePoints.map((e) => {
    return [e[0] - 0.05, e[1], e[2]]
  }),
  100,
)
let lastTime = 0
// 启动血液路径动画函数
function startTubeAnimation() {
  // 停止已有动画
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }

  // 重置状态
  visibleSegments = 1
  segments.forEach((segment) => segment.dispose())
  segments.length = 0

  // 动画循环
  const animate = (currentTime: number) => {
    // 控制生长速度
    if (currentTime - lastTime > growthInterval) {
      lastTime = currentTime

      if (visibleSegments < curve2.length - 1) {
        // 添加新分段
        const segmentPath = curve2.slice(visibleSegments - 1, visibleSegments + 2)
        const segment = MeshBuilder.CreateTube(
          `segment-${visibleSegments}`,
          {
            path: segmentPath,
            radius: 0.0015,
            tessellation: 16,
          },
          scene,
        )
        segment.setParent(tube)
        const redMaterial = createRedMaterial()
        if (redMaterial) {
          segment.material = redMaterial
        }
        segments.push(segment)
        visibleSegments++
      } else {
        // 动画完成时停止
        if (animationId !== null) {
          if (dcxq) dcxq.scaling.y = 1
          // generateBlood(item.bloodTube.meshes)

          cancelAnimationFrame(animationId)
          animationId = null
        }
        return
      }
    }

    // 继续动画循环
    animationId = requestAnimationFrame(animate)
  }

  // 开始动画
  animationId = requestAnimationFrame(animate)
}

export async function jumpStep1() {
  if (zxd) {
    zxd.position = zxdOriginPosition
  }
  resetItems(itemData1)
  if (stepManager) stepManager.goToStep()
}

export function disposeStep1() {
  if (stepManager) {
    stepManager.dispose()
    stepManager = null

    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }

    // 2. 移除所有 tube 分段
    segments.forEach((segment) => {
      segment.dispose()
    })
    segments = []

    // 4. 移除透明 tube
    if (tube) {
      tube.dispose()
      tube = null
    }
    if (person) {
      person.meshes.forEach((e) => {
        e.dispose()
      })
      person = null
    }
  }
}
