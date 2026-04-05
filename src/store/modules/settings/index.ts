import { defineStore } from 'pinia'
import type { SettingsState } from './helper'
import { defaultSetting, getLocalState, removeLocalState, setLocalState } from './helper'

export const useSettingStore = defineStore('setting-store', {
  state: (): SettingsState => getLocalState(),
  actions: {
    updateSetting(settings: Partial<SettingsState>) { // 更新设置
      this.$state = { ...this.$state, ...settings }
      this.recordState()
    },

    resetSetting() { // 重置为默认值
      this.$state = defaultSetting()
      removeLocalState()
    },

    recordState() { // 保存到本地
      setLocalState(this.$state)
    },
  },
})
