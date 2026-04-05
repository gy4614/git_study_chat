import { darkTheme, lightTheme } from 'naive-ui' // 引入 Naive UI 的主题  亮 暗

const setupScrollbarStyle = () => {
  const style = document.createElement('style')
  const styleContent = `
    ::-webkit-scrollbar {
      // ?. 可选操作符  安全地读取属性值，避免空指针异常  如果属性不存在，返回 undefined 而不是抛出错误
      background-color: transparent;  // 滚动条背景颜色 透明
      width: ${lightTheme.Scrollbar.common?.scrollbarWidth};  // 从主题对象 lightTheme 里，安全地读取滚动条宽度配置
    }
    ::-webkit-scrollbar-thumb { // 滚动条中间那块可以拖动的“滑块”
      background-color: ${lightTheme.Scrollbar.common?.scrollbarColor};
      border-radius: ${lightTheme.Scrollbar.common?.scrollbarBorderRadius};
    }
    html.dark ::-webkit-scrollbar {
      background-color: transparent;
      width: ${darkTheme.Scrollbar.common?.scrollbarWidth};
    }
    html.dark ::-webkit-scrollbar-thumb {
      background-color: ${darkTheme.Scrollbar.common?.scrollbarColor};
      border-radius: ${darkTheme.Scrollbar.common?.scrollbarBorderRadius};
    }
  `
  style.innerHTML = styleContent
  document.head.appendChild(style)

}

export default setupScrollbarStyle