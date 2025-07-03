const modelImports = import.meta.glob("@/assets/model/*/*.glb", {
  as: "url", // 获取最终构建后的URL
  eager: true, // 立即导入
})

const texturesImports = import.meta.glob("@/assets/textures/*", {
  as: "url", // 获取最终构建后的URL
  eager: true, // 立即导入
})
export function getModelAssetsUrl(path: string) {
  const modelPath = `/src/assets/model/${path}.glb`
  const url = modelImports[modelPath] || ""
  if (!url) {
    console.error(`Model not found: ${path}`)
    return ""
  }
  return url
}

export function getTexturesAssetsUrl(fileName: string) {
  const modelPath = `/src/assets/textures/${fileName}`
  const url = texturesImports[modelPath] || ""
  if (!url) {
    console.error(`Model not found: ${fileName}`)
    return ""
  }
  return url
}
