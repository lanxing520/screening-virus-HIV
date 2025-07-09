import type { DynamicObject } from "../common/interface"
const PI = Math.PI

export const origin = { x: 4.3, y: 1.08, z: -2.2 }

export const itemData5 = {
  kt: {
    name: "抗体",
    fileName: "IgG抗体",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z + 0.2],
    scaling: 1,
  },
  jyq: {
    name: "加样器",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z],
    scaling: 0.8,
  },
  knqx: {
    name: "抗凝全血",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.2],
  },
  lsg: {
    name: "流式管",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.4],
  },

  hxbljy: {
    name: "红细胞裂解液",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.6],
  },

  qt: {
    name: "枪头",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.8],
    scaling: 3,
  },
  pbs: {
    name: "PBS",
    rotate: [0, PI / 2, 0],
    position: [origin.x, origin.y, origin.z - 1],
  },
  djjq: {
    name: "多聚甲醛固定液",
    rotate: [0, PI / 2, 0],
    position: [origin.x, origin.y, origin.z - 1.2],
  },
  lbz: {
    name: "铝箔纸",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 1.4],
  },
  lsxby: {
    name: "流式细胞仪",
    rotate: [0, PI, 0],
    position: [origin.x, origin.y, origin.z - 1.7],
  },
  lxj: {
    name: "离心机",
    rotate: [0, PI / 2, 0],
    position: [origin.x, origin.y, origin.z - 2.2],
  },
  yc: {
    name: "摇床",
    rotate: [0, 0, 0],
    position: [origin.x - 1, origin.y, origin.z - 2.5],
  },
} as DynamicObject
