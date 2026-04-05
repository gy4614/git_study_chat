import type { GlobalThemeOverrides } from 'naive-ui' // 导入 GlobalThemeOverrides 类型，用于定义主题覆盖（自定义主题变量）
import { computed, watch } from 'vue'
import { darkTheme, useOsTheme } from 'naive-ui' // 导入 darkTheme 主题和 useOsTheme 函数，用于获取操作系统主题
import { useAppStore } from '@/store'

export function useTheme() {
  const appStore = useAppStore()

  const OsTheme = useOsTheme()

  const isDark = computed(() => {
    if (appStore.theme === 'auto')
      return OsTheme.value === 'dark' // 如果应用主题为自动，根据操作系统主题判断是否为暗黑主题
    else
      return appStore.theme === 'dark'  // 如果不是自动，根据应用主题判断是否为暗黑主题
  })

  const theme = computed(() => {
    return isDark.value ? darkTheme : undefined
  })

  const themeOverrides = computed<GlobalThemeOverrides>(() => {
    if (isDark.value) {
      return {
        common: {}, // 如果当前是暗黑模式：返回一个“暗黑主题覆盖配置”（但现在是空的）
      }
    }
    return {} // 如果当前不是暗黑模式：返回一个空对象，不做任何覆盖
  })

  watch(
    () => isDark.value,
    (dark) => {
      if (dark)
        document.documentElement.classList.add('dark')
      else
        document.documentElement.classList.remove('dark')
    },
    { immediate: true }, // 组件一加载就立即执行一次
  )

  return { theme, themeOverrides }
}
