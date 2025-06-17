import * as BABYLON from "@babylonjs/core/Legacy/legacy"
import { scene, camera } from "./initScene"
import { addMouseOverInfo, move, rotate, scale, disposeMouseOverInfo, showMeshes } from "./action"

import type { DynamicObject } from "../common/interface.ts"

const PI = Math.PI

export const origin = { x: 4.3, y: 1.1, z: -2.4 }

type DynamicLoaderResult = {
  [key: string]: BABYLON.ISceneLoaderAsyncResult // 任意字符串 key
}

export let item = {} as DynamicLoaderResult
export async function loadItems(itemData: DynamicObject) {
  if (!scene) return
  item = {}
  try {
    // 使用map而不是forEach来创建Promise数组
    const loadPromises = Object.keys(itemData).map(async (key: keyof DynamicObject) => {
      const data = itemData[key]

      const fileName = data?.fileName ?? data.name
      const url = `${import.meta.env.BASE_URL}/model/item/${fileName}.glb`
      if (!scene) return
      try {
        // 加载模型
        const result = await BABYLON.ImportMeshAsync(url, scene, { name: data.name })

        const rootMesh = result.meshes[0]

        // 设置缩放（如果有）正确的变换顺序应该是：缩放 -> 旋转 -> 平移
        if (data.scaling) {
          scale(rootMesh, data.scaling)
        }
        // // 设置旋转（如果有）
        if (data.rotate) {
          rotate(rootMesh, data.rotate)
        }
        move(rootMesh, data.position)

        rootMesh.computeWorldMatrix(true)
        // 添加鼠标悬停信息
        result.meshes.forEach((e) => {
          e.name = data.name
          addMouseOverInfo(e)
          if (data?.visible === false) {
            e.setEnabled(false)
          }
        })

        // 存储加载结果
        item[key] = result

        return { key, success: true }
      } catch (error) {
        console.error(`Failed to load model ${data.name}:`, error)
        return { key, success: false, error }
      }
    })

    // 等待所有加载完成
    const results = await Promise.all(loadPromises)

    // 检查是否有加载失败的项目
    const failedLoads = results.filter((r) => !r?.success)
    if (failedLoads.length > 0) {
      console.warn(`${failedLoads.length} models failed to load`)
    }
  } catch (error) {
    console.error("Error in loadAllItems:", error)
    throw error // 可以选择重新抛出或处理错误
  }
}

export function resetItems(itemData: DynamicObject) {
  // console.log(item);

  const arr = Object.keys(item)
  if (arr.length === 0) return
  arr.forEach(async (key) => {
    const rootMesh = item[key].meshes[0]
    const data = itemData[key]
    if (!data) return
    if (data.scaling) {
      scale(rootMesh, data.scaling)
    }
    // // 设置旋转（如果有）
    if (data.rotate) {
      rotate(rootMesh, data.rotate)
    }
    move(rootMesh, data.position)
    if (data?.visible !== undefined) showMeshes(item[key].meshes, data.visible)
  })
}

export function disposeAllModle() {
  Object.keys(item).forEach((key) => {
    const result = item[key]
    // 清理 mesh
    result.meshes.forEach((mesh) => {
      mesh.dispose()
      disposeMouseOverInfo(mesh as BABYLON.Mesh)
    })
    result.geometries.forEach((e) => {
      e.dispose()
    })
    // 清理动画组
    if (result.animationGroups) {
      result.animationGroups.forEach((group) => group.dispose())
    }
  })

  // 清空 item 对象
  item = {}
}
