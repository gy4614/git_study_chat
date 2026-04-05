import { defineStore } from 'pinia' // 引入 pinia 库
import type { AppState, Language, Theme } from './helper'
import { getLocalSetting, setLocalSetting } from './helper'
import { store } from '@/store/helper'

export const useAppStore = defineStore('app-store', {  // 'app-store' 是 唯一 ID
  state: (): AppState => getLocalSetting(), // state的状态：直接从本地缓存读取状态
  actions: {
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed  // 设置侧边栏折叠状态 this指的是store实例
      this.recordState()  // 记录当前状态到本地存储
    },

    setTheme(theme: Theme) {
      this.theme = theme
      this.recordState()
    },

    setLanguage(language: Language) {
      if (this.language !== language) {
        this.language = language
        this.recordState()
      }
    },

    recordState() {
      setLocalSetting(this.$state)  // this.$state 当前 store 的完整状态对象
    },
  },
})

export function useAppStoreWithOut() {
  return useAppStore(store)
}
