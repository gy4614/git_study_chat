// 全局资源初始化模块

// 加载全局样式 + 修复 Tailwind 和 Naive UI 的冲突
import 'katex/dist/katex.min.css' // 加载 katex 样式 用于数学公式渲染
import '@/styles/lib/tailwind.css' // 加载 tailwind 样式 
import '@/styles/lib/highlight.less' // 加载 highlight 样式 用于代码高亮
import '@/styles/lib/github-markdown.less' // 加载 github-markdown 样式 聊天内容渲染...
import '@/styles/global.less' // 加载全局样式

function naiveStyleOverride() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
} // 插入一个meta标签，告诉 Naive UI 要用自己的样式优先级，不要被 Tailwind 干扰
function setupAssets() {  // 初始化全局资源
  naiveStyleOverride()
}
export default setupAssets