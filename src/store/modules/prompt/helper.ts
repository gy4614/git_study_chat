// 管理“提示词列表（Prompt）”并持久化到本地 storage
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'promptStore'

export type PromptList = []

export interface PromptStore {
  promptList: PromptList
}

export function getLocalPromptList(): PromptStore {
  const promptStore: PromptStore | undefined = ss.get(LOCAL_NAME)
  return promptStore ?? { promptList: [] } // 空值兜底
  // 空 { promptList: [] }     非空  promptStore
}
 // 保存到本地
export function setLocalPromptList(promptStore: PromptStore): void {
  ss.set(LOCAL_NAME, promptStore)
}
