import { computed, watch } from 'vue'
import { enUS, zhCN } from 'naive-ui'
import { useAppStore } from '@/store'
import { setLocale } from '@/locales'

export function useLanguage() {
  const appStore = useAppStore()

  // 👉 只负责返回 naive-ui 语言
  const language = computed(() => {
    switch (appStore.language) {
      case 'en-US':
        return enUS
      case 'zh-CN':
        return zhCN
      default:
        return enUS
    }
  })
// 监听语言变化，更新 naive-ui 语言
  // 并设置应用语言
  watch(
    () => appStore.language,
    (lang) => {
      setLocale(lang) 
    },
    { immediate: true }
  )

  return { language }
}