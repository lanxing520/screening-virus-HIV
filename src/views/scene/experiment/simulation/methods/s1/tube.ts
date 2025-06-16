import { Mesh, MeshBuilder, Vector3, Path3D } from "@babylonjs/core"
import { scene } from "../common/initScene"

// 创建 Tube
export function createTube(path: Vector3[], radius = 0.01) {
  const tube = MeshBuilder.CreateTube(
    "tube",
    {
      path: path,
      radius,
      tessellation: 30,
      updatable: true,
      sideOrientation: Mesh.DOUBLESIDE,
    },
    scene,
  )
  return tube
}
// 动态更新路径点
// export function updateTubePath(tube: any, newEndPosition) {
//   pathPoints[pathPoints.length - 1] = newEndPosition

//   // 可以添加一些中间点使曲线更平滑
//   pathPoints[1].x = (pathPoints[0].x + pathPoints[2].x) / 2
//   pathPoints[1].y = (pathPoints[0].y + pathPoints[2].y) / 2 + 0.5 // 添加一些高度

//   // 更新Tube
//   MeshBuilder.CreateTube('tube', {
//     path: pathPoints,
//     radius: 0.2,
//     tessellation: 16,
//     instance: tube,
//   })
// }
