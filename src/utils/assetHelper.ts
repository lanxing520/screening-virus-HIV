// utils/assetHelper.js
// export const getAssetUrl = (path: string) => {
//   // 开发环境：用new URL处理
//   // if (import.meta.env.DEV) {
//   const ipath = `../assets/${path}`
//   const url = new URL(ipath, import.meta.url).href
//   return url
//   // }
//   // 生产环境：直接拼接路径
//   // else {
//   //   return `/assets/${path}`
//   // }
// }
export const getAssetUrl = (path: string) => {
  if (import.meta.env.DEV) {
    // 开发环境：动态加载
    const ipath = `../assets/${path}`
    return new URL(ipath, import.meta.url).href
  } else {
    // 生产环境：通过 glob 预加载的静态路径
    const assets = import.meta.glob("../assets/**/*", { eager: true, as: "url" })
    const key = `../assets/${path}`
    return assets[key] || `/assets/${path}` // 回退到原始路径
  }
}
