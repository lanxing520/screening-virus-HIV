import { item, resetItems } from "../common/loadModle"
import { itemData5 } from "./itemData"
import { camera } from "../common/initScene"
import { Vector3, Mesh } from "@babylonjs/core"

import {
  moveAnimation,
  moveAni,
  rotateAni,
  rotateAnimation,
  createKeyframes,
  moveLid,
  createPositionKey,
} from "../common/animation"

import { playAudio, posTranslate, createLiquid } from "../common/action"
import { AnimationStepManager } from "../common/stepManager"
import { config } from "../common/config"
import { questionStore } from "@/stores/expQuestionStore"
import { watchPoint } from "../s4/itemData"
const stroe = questionStore()

const frameRate = config.frameRate

const PI = Math.PI

let stepManager: AnimationStepManager | null
async function setQuestion(index: number) {
  return await stroe.setQuestion(
    "exp5",
    "step" + index,
    true,
    () => {},
    () => {
      stepManager?.reduceStepScore(index)
    },
  )
}
function resetCamera() {
  camera?.focusOn([4, 1.2, -3.3], {
    alpha: PI,
    beta: 1.2,
    radius: 2,
  })
}
export async function initStep5() {
  stepManager = new AnimationStepManager()
  // 注册模型
  Object.keys(itemData5).forEach((key) => {
    if (item[key]?.meshes) {
      stepManager?.registerModel(key, item[key].meshes)
    }
  })
  item.lxj.meshes[1].rotation = Vector3.Zero()
  // const blood = createLiquid(item.jtdg.meshes[0], 0.08, 0.003, 0.05) as Mesh
  // 定义步骤1,分装全血
  item.lsg.meshes[2].rotation = Vector3.Zero()
  item.knqx.meshes[2].rotation = Vector3.Zero()
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData5.jyq.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {
          camera?.focusOn(posTranslate(itemData5.knqx.position, [0, 0.1, 0]), { radius: 1 })
          await setQuestion(1)
          playAudio(40)
        },
        animations: [
          moveAnimation(
            item.jyq.meshes[0],
            [
              itemData5.jyq.position,
              ...createPositionKey(itemData5.knqx.position),
              ...createPositionKey(itemData5.lsg.position),
              itemData5.jyq.position,
            ],
            0.5,
          ),
          rotateAnimation(item.lsg.meshes[2], "x", 0.5, 0, -PI),
          rotateAnimation(item.knqx.meshes[2], "x", 0.5, 0, -PI),
          moveLid(item.lsg.meshes[2], [0, 0.15, -0.05], 0, 3),
          moveLid(item.knqx.meshes[2], [0, 0.15, -0.05], 0, 3),
        ],
      },
    ],
    onEnd: async () => {},
  })
  // 定义步骤2,加入抗体
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData5.jyq.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {
          await setQuestion(2)
        },
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData5.jyq.position },

              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData5.kt.position, [0, 0.3, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData5.kt.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData5.kt.position, [0, 0.02, 0]),
              },
              {
                frame: 1.75 * frameRate,
                value: posTranslate(itemData5.kt.position, [0, 0.3, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.3, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.3, 0]),
              },
              { frame: 3.5 * frameRate, value: itemData5.jyq.position },
            ]),
          },
          rotateAnimation(item.lsg.meshes[2], "x", 0.5, 1, -PI),
          moveLid(item.lsg.meshes[2], [0, 0.15, -0.05], 1, 2),
        ],
      },
    ],
    onEnter: async () => {
      playAudio(41)
    },
    onEnd: async () => {
      resetCamera()
    },
  })

  // 定义步骤3,避光孵育
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData5.jyq.position,
      },
    },
    interactions: [
      {
        modelName: "lbz",
        onClick: async () => {
          camera?.focusOn(watchPoint, { alpha: 2.2 })
        },
        animations: [
          {
            mesh: item.lbz.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData5.lbz.position,
                  posTranslate(itemData5.lbz.position, [-0.5, 0.5, 0]),
                  posTranslate(itemData5.yc.position, [0, 0.36, 0]),
                  { pause: 1 },
                  itemData5.lbz.position,
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.lsg.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  posTranslate(itemData5.lsg.position, [0, -0.09, -0.05]),
                  posTranslate(itemData5.lbz.position, [-0.505, 0.515, -0.05]),
                  posTranslate(itemData5.yc.position, [-0.005, 0.375, -0.05]),
                  { pause: 1 },
                  itemData5.lsg.position,
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.lsg.meshes[0],
            animation: rotateAni("rotation.x", createKeyframes([0, PI / 2, { pause: 2 }, 0], 1)),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(42)
    },
    onEnd: async () => {
      resetCamera()
    },
  })
  // 定义步骤4,裂解红细胞
  item.hxbljy.meshes[1].rotation = Vector3.Zero()
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData5.jyq.position,
      },
    },
    interactions: [
      {
        modelName: "hxbljy",
        onClick: async () => {},
        animations: [
          moveAnimation(
            item.jyq.meshes[0],
            [
              itemData5.jyq.position,
              ...createPositionKey(itemData5.hxbljy.position),
              ...createPositionKey(itemData5.lsg.position),
              itemData5.jyq.position,
            ],
            0.5,
          ),
          rotateAnimation(item.lsg.meshes[2], "x", 1.5, 0, -PI),
          moveLid(item.lsg.meshes[2], [0, 0.15, -0.05], 0, 3),
          rotateAnimation(item.hxbljy.meshes[1], "x", 1.5, 0, -PI),
          moveLid(item.hxbljy.meshes[1], [0, 0.15, -0.05], 0, 3),
        ],
      },
    ],
    onEnter: async () => {
      playAudio(43)
    },
  })
  // 定义步骤5,离心洗涤
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData5.jyq.position,
      },
    },
    interactions: [
      {
        modelName: "lsg",
        onClick: async () => {},
        animations: [
          moveAnimation(
            item.lsg.meshes[0],
            [
              itemData5.lsg.position,
              posTranslate(itemData5.lsg.position, [0, 0.5, 0]),
              posTranslate(itemData5.lxj.position, [0, 0.3, 0]),
              { pause: 2 },
              posTranslate(itemData5.lsg.position, [0, 0.5, 0]),
              itemData5.lsg.position,
            ],
            1,
          ),
          moveAnimation(
            item.jyq.meshes[0],
            [
              itemData5.jyq.position,
              posTranslate(itemData5.lsg.position, [0, 0.3, 0]),
              posTranslate(itemData5.lsg.position, [0, 0.05, 0]),
              { pause: 2 },
              posTranslate(itemData5.lsg.position, [0, 0.3, 0]),
            ],
            1,
            5,
          ),
          rotateAnimation(item.lsg.meshes[2], "x", 1.5, 5, -PI),
          moveLid(item.lsg.meshes[2], [0, 0.15, 0.05], 5, 3),
          {
            mesh: item.lxj.meshes[1],
            animation: rotateAni("rotation.x", [
              { frame: 2 * frameRate, value: -0.6 }, // 起始状态
              { frame: 3 * frameRate, value: 0 },
              { frame: 4 * frameRate, value: 0 },
              { frame: 4.25 * frameRate, value: -0.6 },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(44)
    },
  })
  //定义步骤6,PBS洗涤
  item.pbs.meshes[2].rotation = Vector3.Zero()
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "pbs",
        onClick: async () => {},
        animations: [
          rotateAnimation(item.pbs.meshes[2], "x", 1.5, 0, -PI),
          moveLid(item.pbs.meshes[2], [0, 0.2, -0.05]),
          rotateAnimation(item.lsg.meshes[2], "x", 1.5, 0, -PI),
          moveLid(item.lsg.meshes[2], [0, 0.12, -0.05], 0, 1.5),
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData5.jyq.position },

              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData5.pbs.position, [0, 0.2, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData5.pbs.position, [0, 0.01, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData5.pbs.position, [0, 0.01, 0]),
              },
              {
                frame: 1.75 * frameRate,
                value: posTranslate(itemData5.pbs.position, [0, 0.2, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.3, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.3, 0]),
              },
              { frame: 3.5 * frameRate, value: itemData5.jyq.position },
            ]),
          },
          {
            mesh: item.lsg.meshes[0],
            animation: moveAni("position", [
              {
                frame: 3 * frameRate,
                value: itemData5.lsg.position,
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.5, 0]),
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData5.lxj.position, [0, 0.3, 0]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData5.lxj.position, [0, 0.3, 0]),
              },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.5, 0]),
              },
              {
                frame: 6 * frameRate,
                value: itemData5.lsg.position,
              },
            ]),
          },
          {
            mesh: item.lxj.meshes[1],
            animation: rotateAni("rotation.x", [
              { frame: 3.9 * frameRate, value: -0.6 }, // 起始状态
              { frame: 4 * frameRate, value: 0 },
              { frame: 4.8 * frameRate, value: 0 },
              { frame: 5 * frameRate, value: -0.6 },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(45)
    },
  })

  //定义步骤7,固定细胞
  item.djjq.meshes[1].rotation = Vector3.Zero()
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "djjq",
        onClick: async () => {},
        animations: [
          rotateAnimation(item.djjq.meshes[1], "x", 1.5, 0, -PI),
          moveLid(item.djjq.meshes[1], [0, 0.2, -0.05], 0, 3),
          rotateAnimation(item.lsg.meshes[2], "x", 1.5, 0, -PI),
          moveLid(item.lsg.meshes[2], [0, 0.15, -0.05], 0, 3),
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData5.jyq.position },

              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData5.djjq.position, [0, 0.2, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData5.djjq.position, [0, 0.01, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData5.djjq.position, [0, 0.01, 0]),
              },
              {
                frame: 1.75 * frameRate,
                value: posTranslate(itemData5.djjq.position, [0, 0.2, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.3, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.3, 0]),
              },
              { frame: 3.5 * frameRate, value: itemData5.jyq.position },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(46)
    },
  })
  //定义步骤8,流式细胞仪准备
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "lsxby",
        animations: [],
      },
    ],
    onEnter: async () => {
      playAudio(47)
    },
  })
  // 定义步骤9,样本上机
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "lsg",
        onClick: async () => {
          await setQuestion(9)
        },
        animations: [
          {
            mesh: item.lsg.meshes[0],
            animation: moveAni("position", [
              {
                frame: 0 * frameRate,
                value: itemData5.lsg.position,
              },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData5.lsg.position, [0, 0.3, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData5.lsxby.position, [0, 0.1, 0]),
              },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(48)
    },
  })
}

// 开始执行

export async function jumpStep5() {
  if (stepManager) stepManager.goToStep()
  resetItems(itemData5)
}
export function disposeStep5() {
  if (stepManager) {
    stepManager.dispose()
    stepManager = null
  }
}
