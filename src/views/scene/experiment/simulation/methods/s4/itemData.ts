import type { scale } from "../common/action"
import type { DynamicObject, NumberArray } from "../common/interface"
import { posTranslate } from "../common/action"
const PI = Math.PI

export const origin = { x: 4.3, y: 1.08, z: -2 }
export const watchPoint = [3.6, 1.08, -3.2] as NumberArray
export const scPoint = [4, 1.08, -1.2] as NumberArray
export const itemData4 = {
  zkcxg: {
    name: "真空采血管",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z],
    scaling: 0.8,
  },
  jsq: {
    name: "计时器",
    rotate: [0, -PI / 2, 0],
    position: [origin.x - 0.4, origin.y, origin.z],
    scaling: 10,
  },
  sjh: {
    name: "试剂盒",
    position: [origin.x, origin.y, origin.z - 0.8],
    scaling: [0.8, 0.6, -0.8],
    rotate: [0, PI, 0],
  },
  bxxa: {
    name: "丙烯酰胺混合液",
    position: [origin.x + 0.1, origin.y, origin.z - 0.62],
    rotate: [0, PI / 2, 0],
  },
  kt: {
    name: "抗人IgG抗体",
    fileName: "IgG抗体",
    position: [origin.x, origin.y, origin.z - 0.88],
    scaling: 0.8,
    rotate: [0, PI / 2, 0],
  },
  tznn: {
    name: "脱脂牛奶",
    position: [origin.x, origin.y, origin.z - 1.3],
    rotate: [0, PI / 2, 0],
  },
  //start
  yrdb: {
    name: "预染蛋白Marker",
    position: [origin.x, origin.y, origin.z - 1.65],
    scaling: 10,
    rotate: [0, PI / 2, 0],
  },
  ykxsy: {
    name: "一抗稀释液",
    fileName: "离心管",
    position: [origin.x, origin.y, origin.z - 1.75],
    scaling: 10,
    rotate: [0, PI / 2, 0],
  },
  ekxsy: {
    name: "二抗稀释液",
    fileName: "离心管",
    position: [origin.x - 0.1, origin.y, origin.z - 1.75],
    scaling: 10,
    rotate: [0, PI / 2, 0],
  },
  gl: {
    name: "滚轮",
    fileName: "转膜滚筒",
    position: [origin.x + 0.2, origin.y + 0.15, origin.z - 1.7],
    scaling: 40,
    rotate: [PI, PI / 2, 0],
  },
  //end
  hcl: {
    name: "Tris-HCl",
    position: [origin.x + 0.1, origin.y, origin.z - 0.7],
    rotate: [0, PI, 0],
  },
  sds: {
    name: "SDS",
    position: [origin.x + 0.1, origin.y, origin.z - 0.8],

    rotate: [0, PI / 2, 0],
  },
  glsa: {
    name: "过硫酸铵",
    position: [origin.x + 0.1, origin.y, origin.z - 0.9],

    rotate: [0, PI / 2, 0],
  },
  temed: {
    name: "TEMED",
    position: [origin.x, origin.y, origin.z - 0.8],
    rotate: [0, PI, 0],
  },

  ybc: {
    name: "异丙醇",
    position: [origin.x + 0.1, origin.y, origin.z - 0.98],
    scaling: 0.8,
    rotate: [0, PI, 0],
  },

  wsyc: {
    name: "无水乙醇",
    position: [origin.x, origin.y, origin.z - 1.1],
    scaling: [0.8, 0.6, 0.8],
    rotate: [0, PI, 0],
  },
  qlzs: {
    name: "去离子水",
    position: [origin.x, origin.y, origin.z - 1.5],
    rotate: [0, PI / 2, 0],
  },
  zmhcy: {
    name: "转膜缓冲液",
    position: [origin.x + 0.2, origin.y, origin.z - 2.5],
    scaling: 3,
    rotate: [0, PI / 2, 0],
  },
  bh: {
    name: "冰盒",
    position: [origin.x + 0.3, origin.y, origin.z - 1.3],
    rotate: [0, 0, 0],
  },
  jtdg: {
    name: "胶头滴管",
    position: [origin.x + 0.3, origin.y, origin.z - 1.5],
    rotate: [0, 0, 0],
  },
  xsy: {
    name: "稀释液",
    fileName: "离心管",
    position: [origin.x, origin.y, origin.z - 0.98],
    scaling: 10,
    rotate: [0, PI / 2, 0],
  },
  xbz: {
    name: "锡箔纸",
    fileName: "铝箔纸",
    position: [origin.x + 0.2, origin.y, origin.z - 1.2],
    rotate: [0, PI, 0],
  },
  ecl: {
    name: "ECL试剂",
    position: [origin.x, origin.y, origin.z - 0.7],
    rotate: [0, PI / 2, 0],
  },

  sc: {
    name: "梳齿",
    rotate: [PI / 2, PI / 2, 0],
    position: [origin.x - 0.2, origin.y + 0.02, origin.z - 0.2],
    scaling: 50,
  },
  jyq: {
    name: "加样器",
    rotate: [0, 0, 0],
    position: [origin.x + 0.15, origin.y, origin.z - 0.4],
    scaling: 0.8,
  },
  lxg: {
    name: "离心管",
    rotate: [0, PI / 2, 0],
    position: [origin.x - 0.2, origin.y, origin.z - 0.33],
    scaling: 10,
  },
  lxg2: {
    name: "离心管",
    rotate: [0, PI / 2, 0],
    position: [origin.x - 0.2, origin.y, origin.z - 0.43],
    scaling: 10,
  },
  zls: {
    name: "蒸馏水",
    rotate: [0, PI / 2, 0],
    position: [origin.x, origin.y, origin.z - 0.45],
  },
  lz: {
    name: "滤纸",
    rotate: [0, PI / 2, 0],
    position: [origin.x + 0.3, origin.y, origin.z],
    scaling: 0.4,
  },
  lz2: {
    name: "滤纸",
    rotate: [0, PI / 2, 0],
    position: [origin.x + 0.3, origin.y, origin.z],
    scaling: 0.4,
  },
  xsz: {
    name: "吸水纸",
    fileName: "滤纸",
    position: [origin.x + 0.3, origin.y, origin.z - 0.25],
    rotate: [0, PI / 2, 0],
    scaling: 0.4,
  },
  blb: {
    name: "玻璃板",
    rotate: [0, PI / 2, 0],
    position: [origin.x, origin.y, origin.z - 0.2],
    scaling: 0.6 * 1.5,
  },
  zjj: {
    name: "制胶架",
    rotate: [0, PI / 2, 0],
    position: [origin.x, origin.y, origin.z - 0.2],
    scaling: 11 * 1.5,
  },
  qjb: {
    name: "切胶板",
    position: [origin.x - 0.6, origin.y + 0.02, origin.z - 2.4],

    rotate: [PI / 2, -PI / 2, 0],
  },
  hmd: {
    name: "海绵垫",
    rotate: [PI / 2, 0, 0],
    position: [origin.x - 0.2, origin.y, origin.z - 0.1],
    scaling: [1, 0.5, 1],
  },
  hmd2: {
    name: "海绵垫",
    rotate: [PI / 2, 0, 0],
    position: [origin.x - 0.2, origin.y, origin.z - 0.1],
    scaling: [1, 0.1, 1],
  },
  pvdfm: {
    name: "PVDF膜",
    rotate: [0, PI / 2, 0],
    scaling: 0.4,
    position: [origin.x + 0.3, origin.y, origin.z - 0.45],
  },
  hcm: {
    name: "膜",
    fileName: "PVDF膜",
    rotate: [PI / 2, PI / 2, 0],
    scaling: 0.3,
    position: [origin.x + 0.3, origin.y + 1, origin.z - 0.45],
  },
  fbm1: {
    name: "装有平衡液的封闭皿",
    fileName: "封闭皿",
    rotate: [0, PI, 0],
    scaling: 2,
    position: [origin.x - 0.5, origin.y, origin.z - 0.2],
  },
  fbm2: {
    name: "封闭皿",
    rotate: [0, PI, 0],
    scaling: 2,
    position: [origin.x - 0.5, origin.y, origin.z - 0.4],
  },
  fbm3: {
    name: "封闭皿",
    rotate: [0, -PI / 2, 0],
    scaling: 2,
    position: posTranslate(watchPoint, [0.2, 0, 0]),
    visible: false,
  },

  nz: {
    name: "镊子",
    rotate: [0, PI / 2, 0],
    position: [origin.x - 0.2, origin.y, origin.z],
  },
  dyc: {
    name: "电泳槽",
    rotate: [0, PI / 2, 0],
    position: [origin.x - 0.3, origin.y, origin.z - 2.8],
    scaling: 0.5,
  },
  dyy: {
    name: "电泳仪",
    rotate: [0, PI / 2, 0],
    position: [origin.x - 0.3, origin.y, origin.z - 2.8],
    scaling: 0.5,
  },
  dyykg: {
    name: "电泳仪开关",
    rotate: [0, PI / 2, 0],
    position: [origin.x + 0.1, origin.y, origin.z - 2],
    scaling: 0.5,
  },
  zmy: {
    name: "转膜仪",
    rotate: [0, -PI / 2, 0],
    position: [origin.x - 0.9, origin.y + 0.1, origin.z - 3],
    scaling: 0.7,
  },
  lxj: {
    name: "离心机",
    rotate: [0, PI, 0],
    position: [origin.x - 1.5, origin.y, origin.z - 3],
  },

  wwt: {
    name: "污物桶",
    rotate: [0, 0, 0],
    position: [origin.x + 0.12, origin.y, origin.z - 3.2],
    scaling: 10,
  },
  bx: {
    name: "冰箱",
    position: [origin.x - 3.7, origin.y + 0.07, origin.z - 2.7],
    scaling: [0.7, 0.7, 0.7],
    rotate: [0, 0, 0],
  },
  yc: {
    name: "摇床",
    rotate: [0, PI, 0],
    position: [origin.x - 2.6, origin.y + 0.07, origin.z - 2.7],
    scaling: 0.8,
  },
  hxfgcxy: {
    name: "化学发光成像仪",
    rotate: [0, PI, 0],
    position: [origin.x - 3.2, origin.y + 0.07, origin.z - 2.7],
  },
  hwsyg: {
    name: "恒温水浴锅",
    rotate: [0, 0, 0],
    position: [origin.x - 2, origin.y, origin.z - 2.7],
    scaling: 10,
  },
} as DynamicObject

// 初始位置
export const model = {
  state8: {
    zjj: {
      position: posTranslate(itemData4.dyc.position, [0, 0.05, 0]),
    },
    blb: {
      position: posTranslate(itemData4.dyc.position, [0, 0.05, 0]),
    },
    dyy: {
      position: posTranslate(itemData4.dyy.position, [-0.4, 0, 0]),
    },
  },
  state9: {
    zjj: {
      position: posTranslate(itemData4.dyc.position, [0, 0.05, 0]),
    },
    blb: {
      position: posTranslate(itemData4.dyc.position, [0, 0.05, 0]),
    },
  },
  state12: {
    lz: {
      position: posTranslate(itemData4.fbm2.position, [-0.06, 0.02, -0.065]),
      rotation: [PI / 2, PI / 2, 0] as NumberArray,
    },
    lz2: {
      position: posTranslate(itemData4.fbm2.position, [-0.06, 0.02, -0.065]),
      rotation: [PI / 2, PI / 2, 0] as NumberArray,
    },
    pvdfm: {
      position: posTranslate(itemData4.fbm1.position, [-0.06, 0.02, -0.065]),
      rotation: [PI / 2, PI / 2, 0] as NumberArray,
    },
  },
  state13: {
    hmd: {
      visible: false,
      // position: posTranslate(watchPoint, [0.1, 0.01, 0]),
    },
    hmd2: {
      visible: false,
      // position: posTranslate(watchPoint, [0.1, 0.04, 0]),
    },
    lz: {
      visible: false,
      // position: posTranslate(watchPoint, [0.05, 0.02, 0]),
      // rotation: [PI / 2, PI / 2, 0] as NumberArray,
    },
    lz2: {
      visible: false,
      // position: posTranslate(watchPoint, [0.05, 0.03, 0]),
      // rotation: [PI / 2, PI / 2, 0] as NumberArray,
    },
    pvdfm: {
      visible: false,
      // position: posTranslate(watchPoint, [0.05, 0.005, 0]),
      // rotation: [PI / 2, PI / 2, 0] as NumberArray,
    },
  },
  state16: {
    hcm: {
      position: posTranslate(itemData4.fbm3.position, [-0.1, 0.02, 0]),
    },
    fbm3: {
      visible: true,
    },
  },
  state23: {
    hcm: {
      position: posTranslate(itemData4.fbm3.position, [-0.1, 0, 0]),
    },
  },
}
