// 用 Pinia 管理 Prompt 列表，并同步到本地存储
import { defineStore } from 'pinia'
import type { PromptStore } from './helper'
import { getLocalPromptList, setLocalPromptList } from './helper'

export const usePromptStore = defineStore('prompt-store', {
  state: (): PromptStore => getLocalPromptList(),

  actions: {
    updatePromptList(promptList: []) {
      this.$patch({ promptList }) // 修改 store $patch 可以：批量更新 更安全（不会丢其他字段）
      setLocalPromptList({ promptList })
    },
    getPromptList() {
      return this.$state
    },
  },
})
