type CallbackFunc<T extends unknown[]> = (...args: T) => void
// T 是一个类型变量，可以代表任何类型
// ...args: T 表示函数接受任意数量的参数，参数类型为 T

export function debounce<T extends unknown[]>(
  func: CallbackFunc<T>, // func 是需要防抖处理的目标函数
  wait: number, // wait 是防抖时间，单位毫秒
): (...args: T) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return (...args: T) => {
    const later = () => {
      clearTimeout(timeoutId) // later 函数执行时清除定时器，避免重复执行
      func(...args)
    }

    clearTimeout(timeoutId)  // 调用时清除
    timeoutId = setTimeout(later, wait)
  }
}
