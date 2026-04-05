
// “一个聊天数据的本地缓存系统（带默认值兜底）”
import { ss } from '@/utils/storage'
import { t } from '@/locales'

const LOCAL_NAME = 'chatStorage'

export function defaultState(): Chat.ChatState {
  const uuid = 1002
  return {
    active: uuid,  // 当前活跃的聊天会话 ID
    usingContext: true, // 是否使用上下文
    history: [{ uuid, title: t('chat.newChatTitle'), isEdit: false }],// 左侧聊天列表（类似 ChatGPT 左栏）
    chat: [{ uuid, data: [] }], // 每个会话对应的聊天记录
  }
}

export function getLocalState(): Chat.ChatState {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState } // 合并默认值和本地缓存状态
}

export function setLocalState(state: Chat.ChatState) {
  ss.set(LOCAL_NAME, state) // 保存聊天状态到本地存储
}
