import { item, resetItems } from "../common/loadModle"
import { itemData2 } from "./itemData"
import { camera } from "../common/initScene"
import {
  Vector3,
  AbstractMesh,
  AnimationGroup,
  AnimationEvent,
  PointerEventTypes,
} from "@babylonjs/core"
import {
  createAnimeGroup,
  changeSizeAni,
  moveAni,
  rotateAni,
  customRotate,rotateAnimation
} from "../common/animation"
import { ref, watch } from "vue"
import {
  playAudio,
  posTranslate,
  move,
  rotate,
  scale,
  addHighlight,
  addMouseOverInfo,
  createLiquid,
} from "../common/action"
import { AnimationStepManager } from "../common/stepManager"
import { config } from "../common/config"
import { questionStore } from "@/stores/expQuestionStore"
const stroe = questionStore()
const { frameRate, watchPoint } = config

const PI = Math.PI

let stepManager: AnimationStepManager | null = null

async function setQuestion(index: number) {
  return await stroe.setQuestion(
    "exp2",
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
export async function initStep2() {
  const lxg2 = item.lxg.meshes[0].clone("离心管2", null)
  const lxg3 = item.lxg.meshes[0].clone("离心管3", null)
  if (!lxg2 || !lxg3) return
  lxg2.position = new Vector3(...posTranslate(itemData2.lxg.position, [0.1, 0, 0]))
  lxg3.position = new Vector3(...posTranslate(itemData2.lxg.position, [0.2, 0, 0]))
  const hwxm = item.hwx.meshes[1]
  hwxm.rotation = Vector3.Zero()
  // stepManager.registerModel("lxg2", [lxg2])
  // stepManager.registerModel("lxg3", [lxg3])
  stepManager = new AnimationStepManager()

  // 注册模型
  Object.keys(itemData2).forEach((key) => {
    stepManager?.registerModel(key, item[key].meshes)
  })

  const water19 = createLiquid(item.lt.meshes[0], 0.05, 0.06, 0.05, [1, 1, 1], 0.1)
  if (!water19) return

  // 定义步骤1,稀释
  stepManager.addStep({
    models: {
      lt: {
        position: itemData2.lt.position,
      },
      lxg: {
        position: itemData2.lxg.position,
      },
    },
    interactions: [
      {
        modelName: "lt",
        onClick: async () => {
          camera?.focusOn(itemData2.lt.position)
          playAudio(11)
          await setQuestion(1)
        },
        animations: [
          {
            mesh: item.lt.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.lt.position },
              {
                frame: frameRate,
                value: posTranslate(itemData2.lt.position, [0, 0.18, -0.2]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData2.lt.position, [0, 0.18, -0.2]),
              },
              { frame: 2.5 * frameRate, value: itemData2.lt.position },
            ]),
          },
          {
            mesh: item.lt.meshes[0],
            animation: rotateAni("rotation.x", [
              { frame: 0 * frameRate, value: 0 },
              {
                frame: 1 * frameRate,
                value: 1.7,
              },
              {
                frame: 2 * frameRate,
                value: 1.7,
              },
              { frame: 2.5 * frameRate, value: 0 },
            ]),
          },
          {
            mesh: water19,
            animation: changeSizeAni("scaling.y", [
              { frame: 0.5 * frameRate, value: 1 },
              { frame: 1.5 * frameRate, value: 0 },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  // 定义步骤2
  item.xdy.meshes[3].rotation = Vector3.Zero()
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData2.jyq.position,
      },
      xdy: {
        position: itemData2.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.jyq.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.02, 0]),
              },
              { frame: 1.5 * frameRate, value: posTranslate(itemData2.xdy.position, [0, 0.02, 0]) },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData2.jyq.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData2.lt.position, [-0.5, 0.1, 0]),
              },
              {
                frame: 2.5 * frameRate,
                value: posTranslate(itemData2.lt.position, [-0.5, 0.05, 0]),
              },
              {
                frame: 3 * frameRate,
                value: itemData2.jyq.position,
              },
            ]),
          },
          {
            mesh: item.xdy.meshes[3],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.18, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 1 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.18, 0],
              },
            ]),
          },
          rotateAnimation(item.xdy.meshes[3], "x", 0.75, 0, PI),
          {
            mesh: item.lxg.meshes[0],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: itemData2.lxg.position },
              { frame: 1 * frameRate, value: posTranslate(itemData2.lt.position, [-0.5, 0, 0]) },
              { frame: 2.5 * frameRate, value: posTranslate(itemData2.lt.position, [-0.5, 0, 0]) },
              { frame: 3 * frameRate, value: itemData2.lxg.position },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      item.xdy.meshes[1].setParent(null)
    },
    onExit: async () => {},
  })
  // 定义步骤3
  item.ybxsy.meshes[3].rotation = Vector3.Zero()
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData2.jyq.position,
      },
      xdy: {
        position: itemData2.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.jyq.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData2.jyq.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData2.lt.position, [-0.5, 0.08, 0]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData2.lt.position, [-0.5, 0.08, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [0, 0.15, 0]),
              },
              {
                frame: 3.25 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [0, 0.03, 0]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [0, 0.03, 0]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [0, 0.08, 0]),
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData2.lt.position, [-0.5, 0.08, 0]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData2.lt.position, [-0.5, 0.08, 0]),
              },
              { frame: 5 * frameRate, value: itemData2.jyq.position },
            ]),
          },
          rotateAnimation(item.ybxsy.meshes[3], "x", 1, 0, PI),
          {
            mesh: item.ybxsy.meshes[3],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.18, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 1 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.18, 0],
              },
            ]),
          },
          {
            mesh: lxg2,
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: posTranslate(itemData2.lxg.position, [0.1, 0, 0]) },
              { frame: 1 * frameRate, value: posTranslate(itemData2.lt.position, [-0.5, 0, 0]) },
              { frame: 4.5 * frameRate, value: posTranslate(itemData2.lt.position, [-0.5, 0, 0]) },
              { frame: 5 * frameRate, value: posTranslate(itemData2.lxg.position, [0.1, 0, 0]) },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })
  // 定义步骤4
  item.mbek.meshes[1].rotation = Vector3.Zero()
  stepManager.addStep({
    models: {
      lt: {
        position: itemData2.lt.position,
        // visible:false
      },
      lxg: {
        position: itemData2.lxg.position,
      },
    },
    interactions: [
      {
        modelName: "ybxsy",
        animations: [
          {
            mesh: item.ybxsy.meshes[3],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: posTranslate(itemData2.ybxsy.position, [0, 0.12, 0]) },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0.2, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0, -0.1]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0, -0.1]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0.2, 0]),
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0.12, 0]),
              },
            ]),
          },
          rotateAnimation(item.ybxsy.meshes[3], "x", 1.5, 0, PI),
          {
            mesh: item.ybxsy.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.ybxsy.position },
              {
                frame: frameRate,
                value: posTranslate(itemData2.lt.position, [0, 0.5, -0.14]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.lt.position, [0, 0.5, -0.14]),
              },
              { frame: 3.5 * frameRate, value: itemData2.ybxsy.position },
            ]),
          },
          {
            mesh: item.ybxsy.meshes[0],
            animation: rotateAni("rotation.z", [
              { frame: 1 * frameRate, value: 0 },
              {
                frame: 1.5 * frameRate,
                value: -1.5,
              },
              {
                frame: 2.5 * frameRate,
                value: -1.5,
              },
              { frame: 3 * frameRate, value: 0 },
            ]),
          },
          {
            mesh: item.lt.meshes[0],
            animation: moveAni("position", [
              { frame: 3.5 * frameRate, value: itemData2.lt.position },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData2.lt.position, [-0.5, 0.13, -0.49]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData2.lt.position, [-0.5, 0.13, -0.49]),
              },
              { frame: 5 * frameRate, value: itemData2.lt.position },
            ]),
          },
          {
            mesh: item.lt.meshes[0],
            animation: rotateAni("rotation.x", [
              { frame: 4 * frameRate, value: 0 },
              {
                frame: 4.25 * frameRate,
                value: 1.6,
              },
              {
                frame: 4.5 * frameRate,
                value: 1.6,
              },
              { frame: 4.75 * frameRate, value: 0 },
            ]),
          },
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 5 * frameRate, value: itemData2.jyq.position },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData2.jyq.position, [0, 0.15, 0]),
              },
              {
                frame: 5.75 * frameRate,
                value: posTranslate(itemData2.mbek.position, [0, 0.1, 0]),
              },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData2.mbek.position, [0, 0.1, 0]),
              },
              {
                frame: 6.5 * frameRate,
                value: posTranslate(itemData2.mbek.position, [0, 0.15, 0]),
              },
              {
                frame: 6.75 * frameRate,
                value: posTranslate(itemData2.lt.position, [-0.5, 0.1, 0]),
              },
              {
                frame: 7.25 * frameRate,
                value: posTranslate(itemData2.lt.position, [-0.5, 0.1, 0]),
              },
              { frame: 7.5 * frameRate, value: itemData2.jyq.position },
            ]),
          },
          rotateAnimation(item.mbek.meshes[1], "x", 1, 5, PI),
          {
            mesh: item.mbek.meshes[1],
            animation: moveAni("position", [
              { frame: 5 * frameRate, value: [0, 0.18, 0] },
              {
                frame: 5.25 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 5.5 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 6.5 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 6.75 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 7 * frameRate,
                value: [0, 0.18, 0],
              },
            ]),
          },
          {
            mesh: lxg3,
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: posTranslate(itemData2.lxg.position, [0.2, 0, 0]) },
              { frame: 1 * frameRate, value: posTranslate(itemData2.lt.position, [-0.5, 0, 0]) },
              { frame: 7.25 * frameRate, value: posTranslate(itemData2.lt.position, [-0.5, 0, 0]) },
              { frame: 7.5 * frameRate, value: posTranslate(itemData2.lxg.position, [0.2, 0, 0]) },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      item.ybxsy.meshes[3].setParent(null)
    },
  })
  // 定义步骤5,加样
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {
          
        },
        animations: [
          {
            mesh: item.ybxsy.meshes[3],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.18, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 1 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.18, 0],
              },
            ]),
          },
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.jyq.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.4 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.45 * frameRate,
                value: posTranslate(itemData2.ybxsy.position, [0, 0.15, 0]),
              },
              {
                frame: 1.6 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]), //空白孔
              },
              {
                frame: 2.1 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]), //空白孔
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData2.dz1.position, [0, 0.2, 0]),
              },
              {
                frame: 2.5 * frameRate,
                value: posTranslate(itemData2.dz1.position, [0, 0.1, 0]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData2.dz1.position, [0, 0.1, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.dz1.position, [0, 0.2, 0]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]), //阴性对照孔
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData2.dz2.position, [0, 0.2, 0]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData2.dz2.position, [0, 0.1, 0]),
              },
              {
                frame: 4.75 * frameRate,
                value: posTranslate(itemData2.dz2.position, [0, 0.1, 0]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData2.dz2.position, [0, 0.2, 0]),
              },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]), //阳性对照孔
              },
              {
                frame: 6 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [0, 0.2, 0]),
              },
              {
                frame: 6.5 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [0, 0.02, 0]),
              },
              {
                frame: 7 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [0, 0.02, 0]),
              },
              {
                frame: 7.25 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [0, 0.2, 0]),
              },
              {
                frame: 7.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]), //待测血清孔
              },
              {
                frame: 8 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]), //待测血清孔
              },
              { frame: 8.25 * frameRate, value: itemData2.jyq.position },
            ]),
          },

          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: itemData2.mbbbb.position },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
              },
              {
                frame: 8.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
              },
              { frame: 8.5 * frameRate, value: itemData2.mbbbb.position },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(12)
    },
  })

  // 定义步骤6,震荡孵育
  stepManager.addStep({
    models: {
      lt: {
        position: itemData2.lt.position,
      },
      lxg: {
        position: itemData2.lxg.position,
      },
    },
    interactions: [
      {
        modelName: "fbm",
        onClick: async () => {
          resetCamera()
          await setQuestion(6)
         
        },
        animations: [
          {
            mesh: item.fbm.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.fbm.position },
              {
                frame: 0.25 * frameRate,
                value: posTranslate(itemData2.mbbbb.position, [-0.01, 0.013, 0.01]),
              },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.mbbbb.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData2.mbbbb.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 4.5 * frameRate,
                value: itemData2.fbm.position,
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 0.25 * frameRate, value: itemData2.mbbbb.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.mbbbb.position, [-0.5, 0, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.5, 0, 0]),
              },
              { frame: 1 * frameRate, value: posTranslate(itemData2.hwx.position, [0, 0.1, 0]) },
              { frame: 3.5 * frameRate, value: posTranslate(itemData2.hwx.position, [0, 0.1, 0]) },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.5, 0, 0]),
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData2.mbbbb.position, [-0.5, 0, 0]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 6 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: rotateAni("rotation.z", [
              { frame: 4.5 * frameRate, value: 0 }, // 起始状态
              { frame: 5 * frameRate, value: PI / 2 }, // 旋转
              { frame: 5.5 * frameRate, value: 0 },
            ]),
          },
          {
            mesh: hwxm,
            animation: rotateAni("rotation.y", [
              { frame: 0, value: 0 }, // 起始状态
              { frame: 0.5 * frameRate, value: 2 }, // 旋转
              { frame: 1 * frameRate, value: 2 },
              { frame: 1.5 * frameRate, value: 0 },
              { frame: 3 * frameRate, value: 0 },
              { frame: 3.5 * frameRate, value: 2 },
              { frame: 4 * frameRate, value: 2 },
              { frame: 4.5 * frameRate, value: 0 },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
       playAudio(13)
    },
  })
  // 定义步骤7
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData2.jyq.position,
      },
      xdy: {
        position: itemData2.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData2.jyq.position },
            ]),
          },
          rotateAnimation(item.xdy.meshes[3], "x", 1, 0, PI),
          {
            mesh: item.xdy.meshes[3],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.18, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 1 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.18, 0],
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 5 * frameRate, value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]) },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [-0.3, 0, 0.4]), //水槽位置
              },
              {
                frame: 6 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: rotateAni("rotation.z", [
              { frame: 5.5 * frameRate, value: 0 }, // 起始状态
              { frame: 5.75 * frameRate, value: PI }, // 旋转
              { frame: 6 * frameRate, value: 0 },
            ]),
          },
        ],
      },
    ],
    warmTips: "重复洗涤5次",
    onEnter: async () => {},
    onExit: async () => {},
  })

  // 定义步骤8,加入酶标物
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
      },
      xdy: {
        position: itemData2.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {
          camera?.focusOn(itemData2.jyq.position)
          await setQuestion(8)
        },
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.mbek.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.mbek.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.mbek.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData2.mbek.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData2.mbek.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData2.jyq.position },
            ]),
          },
          rotateAnimation(item.mbek.meshes[1], "x", 1, 0, PI),
          {
            mesh: item.mbek.meshes[1],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.18, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 1 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.18, 0],
              },
            ]),
          },
          {
            mesh: item.fbm.meshes[0],
            animation: moveAni("position", [
              { frame: 4.75 * frameRate, value: itemData2.fbm.position },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 5.25 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 5.5 * frameRate, //进恒温箱
                value: posTranslate(itemData2.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 6 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 6.5 * frameRate,
                value: posTranslate(itemData2.mbbbb.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 6.75 * frameRate,
                value: itemData2.fbm.position,
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 5 * frameRate, value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]) },
              {
                frame: 5.25 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.5, 0, 0]),
              },
              { frame: 5.5 * frameRate, value: posTranslate(itemData2.hwx.position, [0, 0.1, 0]) },
              { frame: 6 * frameRate, value: posTranslate(itemData2.hwx.position, [0, 0.1, 0]) },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.5, 0, 0]),
              },
              {
                frame: 6.5 * frameRate,
                value: posTranslate(itemData2.mbbbb.position, [-0.5, 0, 0]),
              },
              {
                frame: 6.75 * frameRate,
                value: posTranslate(itemData2.mbbbb.position, [-0.5, 0, 0]),
              },
              {
                frame: 7 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 7.5 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 8 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: rotateAni("rotation.z", [
              { frame: 7 * frameRate, value: 0 }, // 起始状态
              { frame: 7.25 * frameRate, value: PI }, // 旋转
              { frame: 7.5 * frameRate, value: 0 },
            ]),
          },
          {
            mesh: hwxm,
            animation: rotateAni("rotation.y", [
              { frame: 5 * frameRate, value: 0 }, // 起始状态
              { frame: 5.25 * frameRate, value: 2 }, // 旋转
              { frame: 5.5 * frameRate, value: 2 },
              { frame: 5.75 * frameRate, value: 0 },
              { frame: 5.9 * frameRate, value: 0 },
              { frame: 6 * frameRate, value: 2 },
              { frame: 6.5 * frameRate, value: 2 },
              { frame: 7 * frameRate, value: 0 },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(14)
    },
    onEnd: async () => {
      resetCamera()
    },
  })
  // 定义步骤9,加入酶标物-2
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData2.jyq.position,
      },
      xdy: {
        position: itemData2.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData2.xdy.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData2.jyq.position },
            ]),
          },
          rotateAnimation(item.xdy.meshes[3], "x", 1, 0, PI),
          {
            mesh: item.xdy.meshes[3],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.18, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 1 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.18, 0],
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 5 * frameRate, value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]) },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [-0.3, 0, 0.4]), //水槽位置
              },
              {
                frame: 6 * frameRate,
                value: posTranslate(itemData2.dcxq.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: rotateAni("rotation.z", [
              { frame: 5.5 * frameRate, value: 0 }, // 起始状态
              { frame: 5.75 * frameRate, value: PI }, // 旋转
              { frame: 6 * frameRate, value: 0 },
            ]),
          },
        ],
      },
    ],
    warmTips: "重复5次",
    onEnter: async () => {},
    onExit: async () => {},
  })

  // 定义步骤10,加入底物显色剂A
  item.xsjA.meshes[1].rotation=Vector3.Zero()
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
      },
      xdy: {
        position: itemData2.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "xsjA",
        onClick: async () => {
          await setQuestion(10)
        },
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.xsjA.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.xsjA.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.xsjA.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData2.xsjA.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData2.xsjA.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData2.jyq.position },
            ]),
          },
          rotateAnimation(item.xsjA.meshes[1], "x", 1, 0, PI),
          {
            mesh: item.xsjA.meshes[1],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.12, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 1 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.12, 0],
              },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(15)
    },
    onExit: async () => {},
  })
  //定义步骤11,加入底物显色剂B
  item.xsjB.meshes[2].rotation=Vector3.Zero()
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
      },
    },
    interactions: [
      {
        modelName: "xsjB",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.xsjB.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.xsjB.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.xsjB.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData2.xsjB.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData2.xsjB.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData2.jyq.position },
            ]),
          },
          rotateAnimation(item.xsjB.meshes[2], "x", 1, 0, PI),
          {
            mesh: item.xsjB.meshes[2],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.11, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 1 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.11, 0],
              },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })
  // 定义步骤12,震荡后进恒温箱
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
      },
    },
    interactions: [
      {
        modelName: "mbbbb",
        onClick: async () => {},
        animations: [
          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]) },
              {
                frame: 0.25 * frameRate, //震荡
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, -0.02]),
              },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0.02]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, -0.02]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0.02]),
              },
              {
                frame: 1.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
              },

              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.5, 0, 0]),
              },
              { frame: 2 * frameRate, value: posTranslate(itemData2.hwx.position, [0, 0.1, 0]) }, // 进恒温箱
              { frame: 2.5 * frameRate, value: posTranslate(itemData2.hwx.position, [0, 0.1, 0]) },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.5, 0, 0]),
              },

              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
              },
            ]),
          },

          {
            mesh: item.fbm.meshes[0],
            animation: moveAni("position", [
              { frame: 1 * frameRate, value: itemData2.fbm.position },
              {
                frame: 1.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 2 * frameRate, //进恒温箱
                value: posTranslate(itemData2.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 2.5 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData2.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.51, 0.013, 0.01]),
              },
            ]),
          },

          {
            mesh: hwxm,
            animation: rotateAni("rotation.y", [
              { frame: 1.5 * frameRate, value: 0 }, // 起始状态
              { frame: 1.75 * frameRate, value: 2 }, // 旋转
              { frame: 1.8 * frameRate, value: 2 },
              { frame: 2 * frameRate, value: 0 },
              { frame: 2.5 * frameRate, value: 0 },
              { frame: 2.6 * frameRate, value: 2 },
              { frame: 3 * frameRate, value: 2 },
              { frame: 4 * frameRate, value: 0 },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })

  // 定义步骤13,终止反应
  item.zzy.meshes[3].rotation=Vector3.Zero()
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
      },
      xdy: {
        position: itemData2.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "zzy",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData2.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData2.zzy.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData2.zzy.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.zzy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData2.zzy.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData2.zzy.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData2.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData2.jyq.position },
            ]),
          },
          rotateAnimation(item.zzy.meshes[3], "x", 1, 0, PI),
          {
            mesh: item.zzy.meshes[3],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.12, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 1 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.12, 0],
              },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(16)
    },
    onExit: async () => {},
  })
  // 定义步骤14,酶标仪比色
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
      },
    },
    interactions: [
      {
        modelName: "mby",
        onClick: async () => {},
        animations: [
          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]) },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData2.mby.position, [0.02, 0.1, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData2.mby.position, [0.02, 0.1, 0]),
              },
              { frame: 4 * frameRate, value: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]) },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(17)
    },
    onExit: async () => {},
  })
  // 定义步骤15,结果判断
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData2.sjh.position, [-0.5, 0, 0]),
      },
    },
    interactions: [
      {
        modelName: "mbbbb",
        onClick: async () => {
          await setQuestion(15)
        },
        animations: [],
      },
    ],
    onEnter: async () => {
      playAudio(18)
    },
  })
}

// 开始执行

export async function jumpStep2() {
  resetItems(itemData2)
  if (stepManager) stepManager.goToStep()
}

export function disposeStep2() {
  if (stepManager) {
    stepManager.dispose()
    stepManager = null
  }
}
