import type { App } from 'vue'  // 只引入类型定义，用来约束 setupI18n 函数的参数类型
import { createI18n } from 'vue-i18n'  // 引入 vue-i18n 库
import enUS from './en-US'  // 引入英文语言包
import zhCN from './zh-CN'  // 引入中文语言包
import { useAppStoreWithOut } from '@/store/modules/app'  // 引入 app 模块的 store
import type { Language } from '@/store/modules/app/helper'  // 引入 app 模块的 helper 类型定义 从 store 里获取用户设置的语言

const appStore = useAppStoreWithOut() // 拿到全局状态 store

const defaultLocale = appStore.language || 'zh-CN'  // 获取用户设置的语言，默认中文

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'en-US', // 如果用户设置的语言不存在，就用英文
  allowComposition: true, // 允许在组件中使用 i18n 实例    useI18n()
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  }, // 配置语言包
})

export const t = i18n.global.t // 在任何地方直接用 t()

export function setLocale(locale: Language) {  // 切换语言 参数 locale 为语言类型
  i18n.global.locale = locale
}

export function setupI18n(app: App) {  // {{ $t('xxx') }}
  app.use(i18n)
}

export default i18n