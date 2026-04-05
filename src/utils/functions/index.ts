// 用于获取当前日期的格式化字符串
export function getCurrentDate() {
  const date = new Date()
  const day = date.getDate()  // 获取当前日期，1-31之间的整数
  const month = date.getMonth() + 1  // 获取当前月份，0-11之间的整数
  const year = date.getFullYear()  // 获取当前年份，4位整数
  return `${year}-${month}-${day}`
}
