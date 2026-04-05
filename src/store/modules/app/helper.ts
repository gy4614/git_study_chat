// 全局配置管理模块
import { ss } from '@/utils/storage' // 引入本地存储工具 ss 永不过期的储存工具

const LOCAL_NAME = 'appSetting'

export type Theme = 'light' | 'dark' | 'auto'

export type Language = 'en-US' | 'zh-CN'

const languageMap: { [key: string]: Language } = { // 将浏览器可能返回的语言代码标准化为应用支持的格式
  'en': 'en-US',
  'en-US': 'en-US',
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
}
// 应用状态接口
export interface AppState {
  siderCollapsed: boolean // 侧边栏是否折叠
  theme: Theme // 主题
  language: Language // 语言
}
// 默认应用状态
export function defaultSetting(): AppState {
  const language = languageMap[navigator.language] // navigator.language
  return { siderCollapsed: false, theme: 'light', language }
}

export function getLocalSetting(): AppState { // 从本地存储获取应用状态
  const localSetting: AppState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalSetting(setting: AppState): void { // 将配置保存到本地存储
  ss.set(LOCAL_NAME, setting)
}
