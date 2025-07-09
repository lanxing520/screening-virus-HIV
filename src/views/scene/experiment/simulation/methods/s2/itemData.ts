import type { DynamicObject } from "../common/interface"

const PI = Math.PI

export const origin = { x: 4.3, y: 1.08, z: -2.2 }

export const itemData2 = {
  sjh: {
    name: "试剂盒",
    position: [origin.x, origin.y, origin.z - 0.8],
    scaling: [0.8, 0.6, -0.8],
    rotate: [0, PI, 0],
  },
  fbm: {
    name: "封板膜",
    position: [origin.x + 0.1, origin.y + 0.02, origin.z - 1.2],
    rotate: [0, PI / 2, 0],
    scaling: 7,
  },

  mbbbb: {
    name: "酶标包被板",
    position: [origin.x - 0.1, origin.y + 0.02, origin.z - 1.2],
    rotate: [0, PI / 2, 0],
    scaling: 7,
  },
  dz1: {
    name: "阴性对照",
    position: [origin.x + 0.1, origin.y + 0.03, origin.z - 0.62],
    scaling: [0.5, 0.8, 0.5],
    // position:[0,0,0]
    rotate: [0, PI / 2, 0],
  },
  dz2: {
    name: "阳性对照",
    position: [origin.x + 0.1, origin.y + 0.03, origin.z - 0.66],
    scaling: [0.5, 0.8, 0.5],
    rotate: [0, PI / 2, 0],
  },
  xsjA: {
    name: "显色剂A液",
    position: [origin.x + 0.1, origin.y + 0.03, origin.z - 0.72],
    rotate: [0, PI / 2, 0],
  },
  xsjB: {
    name: "显色剂B液",
    position: [origin.x + 0.1, origin.y + 0.03, origin.z - 0.8],
    rotate: [0, PI / 2, 0],
  },
  zzy: {
    name: "终止液",
    position: [origin.x + 0.1, origin.y + 0.03, origin.z - 0.88],
    rotate: [0, PI / 2, 0],
  },
  mbek: {
    name: "酶标二抗",
    position: [origin.x + 0.1, origin.y + 0.03, origin.z - 0.96],
    rotate: [0, -PI / 2, 0],
    scaling: 0.62,
  },
  xdy: {
    name: "洗涤液",
    scaling: 0.62,
    position: [origin.x - 0.05, origin.y + 0.03, origin.z - 0.96],
    rotate: [0, -PI / 2, 0],
  },
  ybxsy: {
    name: "样本稀释液",
    scaling: 0.62,
    position: [origin.x - 0.05, origin.y + 0.03, origin.z - 0.66],
    rotate: [0, -PI / 2, 0],
  },
  lt: {
    name: "量筒",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.2],
  },
  dcxq: {
    name: "待测血清",
    position: [origin.x, origin.y, origin.z + 0.2],
    scaling: 10,
  },
  lxg: {
    name: "离心管",
    position: [origin.x, origin.y, origin.z + 0.08],
    rotate: [0, PI / 2, 0],
    scaling: [8, 8, 8],
  },

  jyq: {
    name: "加样器",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.45],
    scaling: 0.8,
  },

  mby: {
    name: "酶标仪",
    position: [origin.x - 0.1, origin.y + 0.02, origin.z - 1.4],
    rotate: [0, -PI / 2, 0],
    scaling: 8,
  },

  bx: {
    name: "冰箱",
    position: [origin.x - 0.1, origin.y + 0.02, origin.z - 1.75],
    scaling: [0.5, 0.5, 0.5],
    rotate: [0, -PI / 2, 0],
  },
  hwx: {
    name: "恒温箱",
    position: [origin.x - 0.1, origin.y + 0.02, origin.z - 2.2],
    scaling: [0.5, 0.5, 0.5],
    rotate: [0, -PI / 2, 0],
  },
} as DynamicObject
