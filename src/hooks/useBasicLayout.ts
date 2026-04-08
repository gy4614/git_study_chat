
// 一个 Vue 组合式函数（Composable），用来判断当前是否是移动端布局。它基于 @vueuse/core 提供的断点工具来实现响应式布局判断

// breakpointsTailwind 这是一个预定义好的断点配置，来自 Tailwind CSS


import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useBasicLayout() {
  const breakpoints = useBreakpoints(breakpointsTailwind)// “断点工具对象”
  const isMobile = breakpoints.smaller('sm')
  // isMobile 是一个响应式变量，当屏幕宽度小于 sm 断点时，为 true；否则为 false。

  return { isMobile }
}
