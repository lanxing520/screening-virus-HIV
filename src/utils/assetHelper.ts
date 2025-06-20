export const getAssetUrl = (path: string) => {
  // 兼容性判断：UMD/CJS 环境或非 Vite 环境
  const isLegacyEnv = typeof import.meta === 'undefined' || 
                     typeof import.meta.env === 'undefined' ||
                     typeof window === 'undefined';

  if (isLegacyEnv) {
    // 老环境（UMD/CJS）直接返回静态路径
    return `/assets/${path}`;
  }

  // Vite 开发环境：动态加载
  if (import.meta.env.DEV) {
    try {
      const ipath = `../assets/${path}`;
      return new URL(ipath, import.meta.url).href;
    } catch {
      return `/assets/${path}`; // 回退
    }
  }

  // Vite 生产环境：通过 glob 预加载
  try {
    const assets = import.meta.glob("../assets/**/*", { eager: true, as: "url" });
    const key = `../assets/${path}`;
    return assets[key] || `/assets/${path}`;
  } catch {
    return `/assets/${path}`; // 回退
  }
};
