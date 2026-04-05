// 这是一个复制文本到剪贴板的工具函数
export function copyToClip(text: string) {
  return new Promise((resolve, reject) => { // 返回 Promise，支持异步操作，可以知道复制成功或失败。
    try {
      const input: HTMLTextAreaElement = document.createElement('textarea')
      input.setAttribute('readonly', 'readonly') // 只读属性，防止用户手动输入
      input.value = text // 设置文本框的值为要复制的文本
      document.body.appendChild(input) // 将 textarea 元素添加到 DOM 树中，使其成为页面的一部分。
      input.select() // 选择文本框中的所有文本
      if (document.execCommand('copy'))
        document.execCommand('copy')
      document.body.removeChild(input)
      resolve(text)
    }
    catch (error) {
      reject(error)
    }
  })
}

// export function copyToClip(text: string): Promise<string> {
//   return navigator.clipboard.writeText(text)
// .then(() => text)
// .catch((error) => {
//   throw error
// })
// }  
// 这是一个复制文本到剪贴板的工具函数，使用 navigator.clipboard.writeText 方法
// 注意：这个方法在 Chrome 中是异步的，返回一个 Promise，需要使用 then 方法处理成功或失败的情况。