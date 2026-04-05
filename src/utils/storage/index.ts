
// 带过期时间的本地存储工具
interface StorageData<T = any> {
  data: T
  expire: number | null // 过期时间戳，null表示永不过期
}
// expire: 过期时间，单位秒，默认7天过期
// options: 可选参数，包含过期时间，默认7天过期 ,返回值为一个对象
export function createLocalStorage(options?: { expire?: number | null }) {
  const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7 // 7天秒数

  const { expire } = Object.assign({ expire: DEFAULT_CACHE_TIME }, options)
// Object.assign(target, source) 将源对象的属性复制到目标对象，并返回目标对象
  function set<T = any>(key: string, data: T) {
    const storageData: StorageData<T> = {
      data,
      //  如果expire不为null，计算过期时间戳（当前时间 + 过期秒数）
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
    }

    const json = JSON.stringify(storageData)
    window.localStorage.setItem(key, json)
  }

  function get(key: string) {
    const json = window.localStorage.getItem(key)
    if (json) {
      let storageData: StorageData | null = null

      try { // 尝试执行可能出错的代码
        storageData = JSON.parse(json) // 尝试执行可能出错的代码
      }
      catch { // 捕获错误
        // Prevent failure
      }

      if (storageData) {
        const { data, expire } = storageData
        if (expire === null || expire >= Date.now())
          return data
      }

      remove(key)
      return null
    }
  }

  function remove(key: string) {
    window.localStorage.removeItem(key) // 删除指定键的存储数据
  }

  function clear() {
    window.localStorage.clear() // 清空所有存储数据
  }

  return { set, get, remove, clear }
}

export const ls = createLocalStorage()

export const ss = createLocalStorage({ expire: null }) // 永不过期的本地存储工具
