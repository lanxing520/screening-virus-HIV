import { item, resetItems } from "../common/loadModle"
import { itemData4 } from "./itemData"
import {  camera } from "../common/initScene"
import { Vector3, Mesh, AnimationEvent, AbstractMesh } from "@babylonjs/core"
import {
  moveAnimation,
  rotateAnimation,
  moveAni,
  rotateAni,
  createKeyframes,
  translateMove,
} from "../common/animation"
import {
  playAudio,
  posTranslate,
  createLiquid,
  createWaterFlow,
  showMeshes,
} from "../common/action"
import { AnimationStepManager, stepIndex } from "../common/stepManager"
import { config } from "../common/config"
import { watchPoint, scPoint, model } from "./itemData"
import type { NumberArray } from "../common/interface"
import { questionStore } from "@/stores/expQuestionStore"
const stroe = questionStore()

type PathPoint = NumberArray | { pause: number } | number

const frameRate = config.frameRate

const PI = Math.PI

let stepManager: AnimationStepManager | null
async function setQuestion(index: number) {
  return await stroe.setQuestion(
    "exp4",
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
export async function initStep4() {
  stepManager = new AnimationStepManager()
  // 注册模型
  Object.keys(itemData4).forEach((key) => {
    stepManager?.registerModel(key, item[key].meshes)
  })
  // item.blb.meshes[0].setParent(item.zjj.meshes[0])
  const pourWaterAni = moveAni(
    "position",
    createKeyframes(
      [
        itemData4.zls.position,
        posTranslate(itemData4.blb.position, [0, 0.2, -0.2]),
        { pause: 1 },
        itemData4.zls.position,
      ],
      0.5,
    ),
  )
  pourWaterAni.addEvent(
    new AnimationEvent(
      0.5 * frameRate,
      () => {
        createWaterFlow(posTranslate(itemData4.zjj.position, [0, 0.2, -0.01]))
      },
      true,
    ),
  )
  const blood = createLiquid(item.zkcxg.meshes[0], 0.08, 0.03, 0.05) as Mesh
  // 定义步骤1,灌胶验漏
  stepManager.addStep({
    models: {
      zls: {
        position: itemData4.zls.position,
      },
    },
    interactions: [
      {
        modelName: "zls",
        onClick: async () => {
          camera?.focusOn(itemData4.jyq.position)
          await setQuestion(1)
          playAudio(22)
        },
        animations: [
          {
            mesh: item.zls.meshes[0],
            animation: pourWaterAni,
          },
          {
            mesh: item.zls.meshes[0],
            animation: rotateAni("rotation.z", createKeyframes([0, 1.2, { pause: 0.5 }, 0], 1)),
          },
        ],
      },
    ],
    onEnter: async () => {
      // item.blb.meshes[2].setParent(null)
    },
  })
  // 定义步骤2,制分离胶
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {
          camera?.focusOn(itemData4.sjh.position,{radius:1.7})
          await setQuestion(2)
        },
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData4.jyq.position,
                  ...createPosition(itemData4.bxxa.position),

                  ...createPosition(itemData4.hcl.position),
                  ...createPosition(itemData4.sds.position),

                  ...createPosition(itemData4.glsa.position),
                  ...createPosition(itemData4.temed.position),
                  posTranslate(itemData4.blb.position, [0, 0.1, 0]),
                  { pause: 0.5 },

                  ...createPosition(itemData4.ybc.position, itemData4.blb.position),
                  itemData4.jyq.position,
                ],
                0.5,
              ),
            ),
          },
          moveLid(item.bxxa.meshes[1], 0),
          moveLid(item.hcl.meshes[1], 2),
          moveLid(item.sds.meshes[1], 4),
          moveLid(item.glsa.meshes[1], 6),
          moveLid(item.temed.meshes[1], 8),
          moveLid(item.ybc.meshes[1], 10),
          moveAnimation(item.lxg.meshes[0], [itemData4.lxg.position, watchPoint]),
        ],
      },
    ],
    onEnter: async () => {
      playAudio(23)
      // item.blb.meshes[2].setParent(null)
    },
  })
  // 定义步骤3,制浓缩胶
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {
          await setQuestion(3)
        },
        animations: [
          moveAnimation(item.lxg2.meshes[0], [itemData4.lxg2.position, watchPoint]),
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData4.jyq.position,
                  ...createPosition(itemData4.bxxa.position),
                  ...createPosition(itemData4.hcl.position),
                  ...createPosition(itemData4.sds.position),
                  ...createPosition(itemData4.glsa.position),
                  ...createPosition(itemData4.temed.position),
                  itemData4.jyq.position,
                ],
                0.5,
              ),
            ),
          },
          moveLid(item.bxxa.meshes[1], 0, 6),
          moveLid(item.hcl.meshes[1], 2, 6),
          moveLid(item.sds.meshes[1], 4, 6),
          moveLid(item.glsa.meshes[1], 6, 6),
          moveLid(item.temed.meshes[1], 8, 8),
        ],
      },
    ],
    onEnter: async () => {
      playAudio(24)
      // item.blb.meshes[2].setParent(null)
    },
  })
  // 定义步骤4
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "blb",
        onClick: async () => {},
        animations: [
          {
            mesh: item.zjj.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [itemData4.zjj.position, scPoint, { pause: 1 }, itemData4.zjj.position],
                1,
              ),
            ),
          },
          {
            mesh: item.zjj.meshes[0],
            animation: rotateAni("rotation.z", createKeyframes([0, 1.2, { pause: 0.5 }, 0], 1)),
          },
          {
            mesh: item.blb.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [itemData4.blb.position, scPoint, { pause: 1 }, itemData4.blb.position],
                1,
              ),
            ),
          },
          {
            mesh: item.blb.meshes[0],
            animation: rotateAni("rotation.z", createKeyframes([0, 1.2, { pause: 0.5 }, 0], 1)),
          },
          {
            mesh: item.lz.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData4.lz.position,
                  posTranslate(itemData4.blb.position, [0, 0.2, 0]),
                  posTranslate(itemData4.blb.position, [0, 0.1, 0]),
                  { pause: 1 },
                  posTranslate(itemData4.blb.position, [0, 0.2, 0]),
                  itemData4.lz.position,
                ],
                0.5,
                2.5,
              ),
            ),
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  // 定义步骤5,
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          moveAnimation(
            item.jyq.meshes[0],
            [
              itemData4.jyq.position,
              posTranslate(watchPoint, [0, 0.2, 0]),
              posTranslate(watchPoint, [0, 0.1, 0]),
              { pause: 0.5 },
              posTranslate(watchPoint, [0, 0.2, 0]),
              posTranslate(itemData4.blb.position, [0, 0.2, 0]),
              posTranslate(itemData4.blb.position, [0, 0.1, 0]),
              { pause: 0.5 },
              posTranslate(itemData4.blb.position, [0, 0.2, 0]),
              itemData4.jyq.position,
            ],
            0.5,
          ),
          moveAnimation(
            item.sc.meshes[0],
            [
              itemData4.sc.position,
              posTranslate(itemData4.blb.position, [0, 0.2, 0]),
              posTranslate(itemData4.blb.position, [0, 0.12, 0]),
            ],
            0.5,
            5,
          ),
        ],
      },
    ],
    onEnter: async () => {},
  })
  //步骤6,样本处理
  stepManager.addStep({
    models: {
      sc: {
        position: posTranslate(itemData4.blb.position, [0, 0.12, 0]),
      },
    },
    interactions: [
      {
        modelName: "lxg",
        onClick: async () => {
          camera?.focusOn(watchPoint,{
            alpha:2,radius:1.8
          })
        },
        animations: [
          {
            mesh: item.lxg.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData4.lxg.position,
                  watchPoint,
                  { pause: 8 },
                  posTranslate(itemData4.hwsyg.position, [0, 0.2, 0]),
                  posTranslate(itemData4.hwsyg.position, [0, 0.1, 0]),
                  { pause: 1 },
                  posTranslate(itemData4.lxj.position, [-0.2, 0.5, 0.5]),
                  posTranslate(itemData4.lxj.position, [0, 0.2, 0]),
                  { pause: 1 },
                  posTranslate(itemData4.lxj.position, [0.2, 0.5, 0.5]),
                  itemData4.lxg.position,
                ],
                0.5,
              ),
            ),
          },

          moveLid(item.sds.meshes[1], 2, 3),
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData4.jyq.position,
                  ...createPosition(itemData4.zkcxg.position),
                  ...createPosition(itemData4.sds.position),
                  itemData4.jyq.position,
                ],
                0.5,
              ),
            ),
          },
        ],
      },
    ],
    onEnter: async () => {
      item.zkcxg.meshes[2].isVisible = false
      playAudio(25)
    },
    onEnd: async () => {
      resetCamera()
    },
  })

  //步骤7,装胶
  stepManager.addStep({
    models: {
      sc: {
        position: posTranslate(itemData4.blb.position, [0, 0.12, 0]),
      },
    },
    interactions: [
      {
        modelName: "blb",
        onClick: async () => {},
        animations: [
          {
            mesh: item.zjj.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData4.zjj.position,
                  posTranslate(itemData4.dyc.position, [0, 0.3, 0]),
                  posTranslate(itemData4.dyc.position, [0, 0.05, 0]),
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.blb.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData4.blb.position,
                  posTranslate(itemData4.dyc.position, [0, 0.3, 0]),
                  posTranslate(itemData4.dyc.position, [0, 0.05, 0]),
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.sc.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  posTranslate(itemData4.blb.position, [0, 0.12, 0]),
                  posTranslate(itemData4.dyc.position, [0, 0.42, 0]),
                  posTranslate(itemData4.dyc.position, [0, 0.17, 0]),
                  { pause: 2 },
                  posTranslate(itemData4.dyc.position, [0, 0.3, 0]),
                  itemData4.sc.position,
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.dyy.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [itemData4.dyy.position, posTranslate(itemData4.dyy.position, [-0.4, 0, 0])],
                1,
              ),
            ),
          },
          {
            mesh: item.zmhcy.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData4.zmhcy.position,
                  posTranslate(itemData4.dyc.position, [0, 0.2, +0.5]),
                  { pause: 2 },
                  itemData4.zmhcy.position,
                  // posTranslate(itemData4.dyc.position, [0, 0.17, 0]),
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.zmhcy.meshes[0],
            animation: rotateAni("rotation.z", createKeyframes([0, -1.3, { pause: 1 }, 0], 1, 1)),
          },
          moveLid(item.zmhcy.meshes[1], 0, 5),
        ],
      },
    ],
    onEnter: async () => {
      playAudio(26)
    },
  })
  //步骤8,上样
  stepManager.addStep({
    models: model.state8,
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {
          await setQuestion(8)
        },
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData4.jyq.position,
                  ...createPosition2(itemData4.lxg.position, 0.2, 0.02, 1),
                  ...createPosition2(itemData4.dyc.position, 0.3, 0.15, 2),
                  ...createPosition2(itemData4.yrdb.position, 0.3, 0.02, 1),
                  ...createPosition2(itemData4.dyc.position, 0.3, 0.15, 2),
                  itemData4.jyq.position,
                ],
                0.5,
              ),
            ),
          },
          {
            mesh: item.dyy.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [posTranslate(itemData4.dyy.position, [-0.4, 0, 0]), itemData4.dyy.position],
                1,
                12,
              ),
            ),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(27)
    },
  })
  //步骤9,电泳
  stepManager.addStep({
    models: model.state9,
    interactions: [
      {
        modelName: "dyykg",
        onClick: async () => {},
        animations: [],
      },
    ],
    onEnter: async () => {
      playAudio(28)
    },
  })
  //步骤10,处理
  stepManager.addStep({
    models: model.state9,
    interactions: [
      {
        modelName: "qjb",
        onClick: async () => {},
        animations: [
          {
            mesh: item.dyy.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData4.dyy.position,
                  posTranslate(itemData4.dyy.position, [-0.4, 0, 0]),
                  { pause: 3 },
                  itemData4.dyy.position,
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.zjj.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  posTranslate(itemData4.dyc.position, [0, 0.05, 0]),
                  posTranslate(itemData4.dyc.position, [0, 0.3, 0]),
                  itemData4.zjj.position,
                ],
                1,
                2,
              ),
            ),
          },
          {
            mesh: item.blb.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes([
                posTranslate(itemData4.dyc.position, [0, 0.05, 0]),
                posTranslate(itemData4.dyc.position, [0, 0.3, 0]),
                watchPoint,
              ]),
            ),
          },
          {
            mesh: item.qjb.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData4.qjb.position,
                  posTranslate(watchPoint, [+0.01, 0.16, +0.2]),
                  posTranslate(watchPoint, [0.01, 0.16, -0.1]),
                  posTranslate(watchPoint, [+0.01, 0.16, +0.2]),
                  itemData4.qjb.position,
                ],
                1,
              ),
            ),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(29)
    },
  })

  //步骤11,转膜1
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "pvdfm",
        onClick: async () => {},
        animations: [
          rotateAnimation(item.pvdfm.meshes[0], "x"),
          moveAnimation(
            item.pvdfm.meshes[0],
            [
              itemData4.pvdfm.position,
              posTranslate(itemData4.fbm1.position, [-0.06, 0.2, -0.065]),
              posTranslate(itemData4.fbm1.position, [-0.06, 0.02, -0.065]),
              { pause: 2 },
            ],
            1,
          ),
          moveAnimation(
            item.lz.meshes[0],
            [
              itemData4.lz.position,
              posTranslate(itemData4.fbm2.position, [-0.06, 0.2, -0.065]),
              posTranslate(itemData4.fbm2.position, [-0.06, 0.02, -0.065]),
            ],
            1,
          ),
          rotateAnimation(item.lz.meshes[0], "x"),
          moveAnimation(
            item.zmhcy.meshes[0],
            [
              itemData4.zmhcy.position,
              posTranslate(itemData4.zmhcy.position, [0, 0.3, 0]),
              posTranslate(itemData4.fbm2.position, [0, 0.2, -0.45]),
              { pause: 0.5 },
              posTranslate(itemData4.zmhcy.position, [0, 0.3, 0]),
              itemData4.zmhcy.position,
            ],
            0.5,
          ),
          rotateAnimation(item.zmhcy.meshes[0], "z", 0.5),
          moveLid(item.zmhcy.meshes[1], 0, 5),
        ],
      },
    ],
    onEnter: async () => {
      playAudio(30)
    },
  })
  // 转膜仪盖子,盒子
  const gz = item.zmy.meshes[1]
  const hz = item.zmy.meshes[2]
  const gzPos = gz.absolutePosition
  const hzPos = hz.absolutePosition
  //步骤12,转膜2
  stepManager.addStep({
    models: model.state12,
    interactions: [
      {
        modelName: "zmy",
        onClick: async () => {
          await setQuestion(12)
        },
        animations: [
          moveAnimation(
            gz,
            [
              [gzPos.x, gzPos.y, gzPos.z],
              posTranslate(watchPoint, [0.15, 0.05, 0]),
              { pause: 1 },
              posTranslate(itemData4.zmy.position, [0.15, 0.1, 0.1]),
            ],
            0.5,
            15,
          ),
          moveAnimation(hz, [
            [hzPos.x, hzPos.y, hzPos.z],
            posTranslate(watchPoint, [0.15, 0, 0]),
            { pause: 16 },
            posTranslate(itemData4.zmy.position, [0.15, 0.1, 0.1]),
          ]),

          rotateAnimation(hz, "z", undefined, 17, PI / 2),
          rotateAnimation(gz, "z", undefined, 17, PI / 2),

          moveAnimation(
            item.hmd.meshes[0],
            [
              itemData4.hmd.position,
              posTranslate(watchPoint, [0.1, 0.31, 0]),
              posTranslate(watchPoint, [0.1, 0.01, 0]),
              { pause: 3 },
              posTranslate(watchPoint, [0.1, -0.05, 0]),
            ],
            1,
          ),
          moveAnimation(
            item.lz.meshes[0],
            [
              posTranslate(itemData4.fbm2.position, [-0.06, 0.02, -0.065]),
              posTranslate(watchPoint, [0.05, 0.32, 0]),
              posTranslate(watchPoint, [0.05, 0.02, 0]),
              { pause: 3 },
              posTranslate(watchPoint, [0.1, -0.05, 0]),
            ],
            1,
            2,
          ),
          moveAnimation(
            item.gl.meshes[0],
            [
              itemData4.gl.position,
              posTranslate(itemData4.gl.position, [0, 0.2, 0]),
              posTranslate(watchPoint, [0.05, 0.15, 0]),
              posTranslate(watchPoint, [0.2, 0.15, 0]),
              { pause: 3 },
              posTranslate(watchPoint, [0.05, 0.16, 0]),
              posTranslate(watchPoint, [0.2, 0.16, 0]),
              { pause: 3 },
              posTranslate(watchPoint, [0.05, 0.17, 0]),
              posTranslate(watchPoint, [0.2, 0.17, 0]),
              itemData4.gl.position,
            ],
            1,
            2,
          ),
          moveAnimation(
            item.blb.meshes[0],
            [
              itemData4.blb.position,
              posTranslate(itemData4.blb.position, [0, 0.2, 0]),
              posTranslate(watchPoint, [-0.05, 0.35, 0]),
              posTranslate(watchPoint, [-0.05, 0.05, 0]),
              { pause: 1 },
              itemData4.blb.position,
            ],
            1,
            3,
          ),
          rotateAnimation(item.blb.meshes[0], "x", 1, 4.5),
          moveAnimation(
            item.pvdfm.meshes[0],
            [
              posTranslate(itemData4.fbm1.position, [-0.06, 0.02, -0.065]),
              posTranslate(watchPoint, [0.05, 0.305, 0]),
              posTranslate(watchPoint, [0.05, 0.003, 0]),
              { pause: 3 },
              posTranslate(watchPoint, [0.1, -0.05, 0]),
            ],
            1,
            6,
          ),
          moveAnimation(
            item.lz2.meshes[0],
            [
              posTranslate(itemData4.fbm2.position, [-0.06, 0.02, -0.065]),
              posTranslate(watchPoint, [0.05, 0.33, 0]),
              posTranslate(watchPoint, [0.05, 0.02, 0]),
              { pause: 3 },
              posTranslate(watchPoint, [0.1, -0.05, 0]),
            ],
            1,
            8,
          ),
          moveAnimation(
            item.hmd2.meshes[0],
            [
              itemData4.hmd.position,
              posTranslate(watchPoint, [0.1, 0.34, 0]),
              posTranslate(watchPoint, [0.1, 0.03, 0]),
              { pause: 3 },
              posTranslate(watchPoint, [0.1, -0.05, 0]),
            ],
            1,
            10,
          ),
        ],
      },
    ],
    onEnter: async () => {
      gz.setParent(null)
      hz.setParent(null)
      gz.rotation = new Vector3(0, 0, 0)
      hz.rotation = new Vector3(0, 0, 0)
      gz.position = new Vector3(3.5, 1.084, -4.5)
      hz.position = new Vector3(3.5, 1.079, -4.5)
    },
  })

  //步骤13,加转膜缓冲液
  stepManager.addStep({
    models: model.state13,
    interactions: [
      {
        modelName: "zmhcy",
        onClick: async () => {
          await setQuestion(13)
        },
        animations: [
          moveAnimation(
            item.zmhcy.meshes[0],
            [
              itemData4.zmhcy.position,
              posTranslate(itemData4.zmy.position, [0.1, 0.3, -0.4]),
              { pause: 1 },
              itemData4.zmhcy.position,
            ],
            1,
          ),
          rotateAnimation(item.zmhcy.meshes[0], "z", 0.5),
          moveLid(item.zmhcy.meshes[1], 0, 2),
        ],
      },
    ],
    onEnter: async () => {
      playAudio(31)
    },
  })
  //步骤14,连接电源
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "dyykg",
        onClick: async () => {},
        animations: [],
      },
    ],
    onEnter: async () => {
      playAudio(32)
    },
  })
  //步骤15,封闭
  stepManager.addStep({
    models: {
      hcm: {
        position: posTranslate(itemData4.zmy.position, [0.05, 0.22, 0]),
      },
    },
    interactions: [
      {
        modelName: "nz",
        onClick: async () => {
          await setQuestion(15)
        },
        animations: [
          moveAnimation(
            item.nz.meshes[0],
            [
              itemData4.nz.position,
              posTranslate(itemData4.zmy.position, [0.03, 0.22, 0]),
              posTranslate(itemData4.fbm3.position, [-0.1, 0.1, 0]),
              itemData4.nz.position,
            ],
            1,
          ),
          moveAnimation(
            item.hcm.meshes[0],
            [
              posTranslate(itemData4.zmy.position, [0.05, 0.22, 0]),
              posTranslate(itemData4.fbm3.position, [-0.1, 0.1, 0]),
              posTranslate(itemData4.fbm3.position, [-0.1, 0.02, 0]),
              posTranslate(itemData4.yc.position, [-0.1, 0.25, 0]),
              { pause: 2 },
              posTranslate(itemData4.fbm3.position, [-0.1, 0.02, 0]),
            ],
            1,
            1,
          ),
          moveAnimation(
            item.fbm3.meshes[0],
            [
              itemData4.fbm3.position,
              posTranslate(itemData4.yc.position, [0, 0.3, 0]),
              { pause: 2 },
              itemData4.fbm3.position,
            ],
            1,
            3,
          ),
        ],
      },
    ],
    onEnter: async () => {
      showMeshes(item.fbm3.meshes)
      playAudio(33)
    },
  })
  //步骤16,一抗孵育
  commonStep("ykxsy", 34)
  //步骤18,二抗孵育
  commonStep("ekxsy", 35)
  //步骤20,WB-加入底物
  commonStep("tznn", 36)
  //步骤22,终止反应
  stepManager.addStep({
    models: model.state16,
    interactions: [
      {
        modelName: "nz",
        onClick: async () => {
          await setQuestion(22)
        },
        animations: [
          moveAnimation(
            item.nz.meshes[0],
            [
              itemData4.nz.position,
              posTranslate(itemData4.fbm3.position, [-0.11, 0.02, 0]),
              posTranslate(itemData4.fbm3.position, [-0.11, 0.2, 0]),
              { pause: 1 },
              posTranslate(itemData4.fbm3.position, [-0.11, 0, 0]),
              itemData4.nz.position,
            ],
            1,
          ),
          moveAnimation(
            item.hcm.meshes[0],
            [
              posTranslate(itemData4.fbm3.position, [-0.1, 0.02, 0]),
              posTranslate(itemData4.fbm3.position, [-0.1, 0.2, 0]),
              { pause: 1 },
              posTranslate(itemData4.fbm3.position, [-0.1, 0, 0]),
              // posTranslate(itemData4.fbm3.position, [-0.1, 0.02, 0]),
            ],
            1,
            1,
          ),
          moveAnimation(
            item.fbm3.meshes[0],
            [itemData4.fbm3.position, posTranslate(itemData4.fbm2.position, [0, 0, -0.3])],
            1,
            1,
          ),
        ],
      },
    ],
    onEnter: async () => {
      playAudio(37)
    },
  })
  //步骤23
  stepManager.addStep({
    models: model.state23,
    interactions: [
      {
        modelName: "jtdg",
        onClick: async () => {},
        animations: [
          moveAnimation(
            item.jtdg.meshes[0],
            [
              itemData4.jtdg.position,
              ...createPosition2(itemData4.ecl.position),
              posTranslate(itemData4.fbm3.position, [-0.08, 0.05, 0]),
              { pause: 1 },
              posTranslate(itemData4.fbm3.position, [-0.04, 0.05, 0]),
              { pause: 1 },
              posTranslate(itemData4.fbm3.position, [0, 0.05, 0]),
              itemData4.jtdg.position,
            ],
            0.5,
          ),
          moveLid(item.ecl.meshes[1], 0, 2),
        ],
      },
    ],
    onEnter: async () => {},
  })
  //步骤24
  stepManager.addStep({
    models: model.state23,
    interactions: [
      {
        modelName: "xsz",
        onClick: async () => {},
        animations: [
          moveAnimation(
            item.xsz.meshes[0],
            [
              itemData4.xsz.position,
              posTranslate(itemData4.xsz.position, [0, 0.2, 0]),
              posTranslate(watchPoint, [0, 0, 0.2]),
            ],

            0.5,
          ),
          rotateAnimation(item.xsz.meshes[0], "x"),
          {
            mesh: item.hcm.meshes[0],
            animation: rotateAni("rotation.x", createKeyframes([PI / 2, 0, { pause: 2 }, PI / 2])),
          },
          moveAnimation(
            item.hcm.meshes[0],
            [
              posTranslate(itemData4.fbm3.position, [-0.1, 0.02, 0]),
              posTranslate(watchPoint, [0, 0, 0.2]),
              posTranslate(watchPoint, [0.15, 0, 0.2]),
              posTranslate(itemData4.hxfgcxy.position, [0, 0.1, 0]),
            ],
            1,
            1,
          ),
        ],
      },
    ],
    onEnter: async () => {},
  })
  //步骤25,结果判定
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "hxfgcxy",
        onClick: async () => {
          await setQuestion(25)
        },
        animations: [],
      },
    ],
    onEnter: async () => {
      playAudio(38)
    },
  })
  //步骤26,结果阴阳性分析
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "hxfgcxy",
        onClick: async () => {
          await setQuestion(26)
        },
        animations: [],
      },
    ],
    onEnter: async () => {
      playAudio(39)
    },
  })
}

function moveLid(mesh: Mesh | AbstractMesh, start = 0, pause = 15) {
  const position = mesh.position.clone()
  return {
    mesh,
    animation: moveAni(
      "position",
      createKeyframes(
        [
          [position.x, position.y, position.z],
          [position.x, position.y + 1.5, position.z],
          // [position.x + translate[0], position.y + translate[1], position.z + translate[2]],
          { pause },
          [position.x, position.y, position.z],
        ],
        1,
        start,
      ),
    ),
  }
}
function commonStep(nameKey: string, audioIndex: number) {
  if (!stepManager) return

  stepManager.addStep({
    models: model.state16,
    interactions: [
      {
        modelName: "fbm3",
        onClick: async () => {
          if (audioIndex === 36) {
            await setQuestion(20)
          }
        },
        animations: [
          moveAnimation(
            item.fbm3.meshes[0],
            [
              itemData4.fbm3.position,
              posTranslate(scPoint, [0, 0.1, 0]),
              { pause: 2 },
              itemData4.fbm3.position,
            ],
            1,
          ),
          rotateAnimation(item.fbm3.meshes[0], "x", 0.5, 1),
          moveAnimation(
            item.hcm.meshes[0],
            [
              posTranslate(itemData4.fbm3.position, [-0.1, 0.02, 0]),
              posTranslate(itemData4.fbm3.position, [-0.1, 0.2, 0]),
              { pause: 5 },
              posTranslate(itemData4.fbm3.position, [-0.1, 0.02, 0]),
            ],
            0.5,
          ),
          moveAnimation(
            item[nameKey].meshes[0],
            [
              itemData4[nameKey].position,
              posTranslate(itemData4.fbm3.position, [0, 0.1, 0.15]),
              { pause: 2 },
              itemData4[nameKey].position,
            ],
            0.5,
            4,
          ),
          rotateAnimation(item[nameKey].meshes[0], "z", 0.5, 5, -1.5),
        ],
      },
    ],
    onEnter: async () => {
      playAudio(audioIndex)
    },
  })

  //步骤17,一抗孵育-2
  stepManager.addStep({
    models: model.state16,
    interactions: [
      {
        modelName: "fbm3",
        onClick: async () => {},
        animations: [
          moveAnimation(
            item.hcm.meshes[0],
            [
              posTranslate(itemData4.fbm3.position, [-0.1, 0.02, 0]),
              posTranslate(itemData4.yc.position, [-0.1, 0.25, 0]),
              { pause: 2 },
              posTranslate(itemData4.fbm3.position, [-0.1, 0.02, 0]),
            ],
            1,
          ),
          moveAnimation(
            item.fbm3.meshes[0],
            [
              itemData4.fbm3.position,
              posTranslate(itemData4.yc.position, [0, 0.3, 0]),
              { pause: 2 },
              itemData4.fbm3.position,
            ],
            1,
          ),
        ],
      },
    ],
    onEnter: async () => {},
  })
}

function createPosition(position: NumberArray, position2 = watchPoint) {
  const arr1 = [
    posTranslate(position, [0, 0.3, 0]),
    posTranslate(position, [0, 0.05, 0]),
    { pause: 0.5 },
    posTranslate(position, [0, 0.3, 0]),
  ]
  let arr2 = [] as any
  if (position2) {
    arr2 = [
      posTranslate(position2, [0, 0.3, 0]),
      posTranslate(position2, [0, 0.03, 0]),
      { pause: 0.5 },
      posTranslate(position2, [0, 0.3, 0]),
    ]
  }
  return [...arr1, ...arr2]
}

function createPosition2(position: NumberArray, up = 0.3, down = 0.05, pause = 0.5) {
  return [
    posTranslate(position, [0, up, 0]),
    posTranslate(position, [0, down, 0]),
    { pause },
    posTranslate(position, [0, up, 0]),
  ]
}

export async function jumpStep4() {
  resetItems(itemData4)
  if (stepManager) stepManager.goToStep()
}
export function disposeStep4() {
  if (stepManager) {
    stepManager.dispose()
    stepManager = null
  }
}
