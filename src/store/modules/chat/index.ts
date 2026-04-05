// 管理聊天系统的所有数据（会话列表 + 聊天内容 + 当前会话 + 路由同步 + 本地持久化）
import { defineStore } from 'pinia' // 创建 Pinia store
import { defaultState, getLocalState, setLocalState } from './helper' 
// getLocalState 👉 从本地恢复聊天数据 ,setLocalState 👉 保存聊天数据
import { router } from '@/router' // 用于跳转页面（切换会话）
import { t } from '@/locales' // 国际化（标题）


// 定义一个叫 chat-store的 store 用于管理聊天状态
export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => getLocalState(), // 初始化时从 localStorage 从本地恢复聊天数据

  getters: {
    // 找当前选中的会话
    getChatHistoryByCurrentActive(state:Chat.ChatState) {
      const index = state.history.findIndex(item => item.uuid === state.active)
      if (index !== -1) {
        return state.history[index]
      }
      return null
    },
    // 根据 uuid 获取聊天内容
    getChatByUuid(state: Chat.ChatState) {
      return (uuid?: number) => {
        if (uuid) {
          return state.chat.find(item => item.uuid === uuid)?.data ?? [] // data ?? [] 如果 data 不是 null 或 undefined，就用 data
        }
        return state.chat.find(item => item.uuid === state.active)?.data ?? []
      }
    },
  },

  actions: {
    // 开关“上下文模式” + 持久化
    setUsingContext(context: boolean) {
      this.usingContext = context
      this.recordState()
    },
    // （新增会话）
    addHistory(history: Chat.History, chatData: Chat.Chat[] = []) {
      this.history.unshift(history) // 新增会话到列表开头
      this.chat.unshift({ uuid: history.uuid, data: chatData }) // 创建对应聊天记录
      this.active = history.uuid // 设置当前会话
      this.reloadRoute(history.uuid) // 跳转路由（切换页面）
    },
    // 局部更新会话
     updateHistory(uuid: number, edit: Partial<Chat.History>) {
      const index = this.history.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.history[index] = { ...this.history[index], ...edit } // 合并旧数据和新数据
        this.recordState()
      }
    },
    // 删除会话
    async deleteHistory(index: number) {
      this.history.splice(index, 1) // splice(index, 1) 删除索引为 index 的元素，删除 1 个元素
      this.chat.splice(index, 1)
      // 删除会话 + 聊天 

      if (this.history.length === 0) {
        this.active = null
        this.reloadRoute()
        return
      }
      // 清空 active + 跳转

      if (index > 0 && index <= this.history.length) {
        const uuid = this.history[index - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
        return
      }
      // 删除中间, 选前一个

      if (index === 0) {
        if (this.history.length > 0) {
          const uuid = this.history[0].uuid
          this.active = uuid
          this.reloadRoute(uuid) 
        }
      }
      // 删除第一个, 选新的第一个

      if (index > this.history.length) {
        const uuid = this.history[this.history.length - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
      }
      // 删除最后一个, 选新的最后一个
    },
    // 切换当前会话 + 路由跳转
     async setActive(uuid: number) {
      this.active = uuid
      return await this.reloadRoute(uuid)
    },
    // 获取某条消息
    getChatByUuidAndIndex(uuid: number, index: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length)
          return this.chat[0].data[index]
        return null
      }
      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1)
        return this.chat[chatIndex].data[index]
      return null
    },

    addChatByUuid(uuid: number, chat: Chat.Chat) {
      // 情况 1：uuid 不存在（新会话）
      if (!uuid || uuid === 0) {
        if (this.history.length === 0) {
          const uuid = Date.now() // 生成新的 uuid 用当前时间戳作为唯一 ID
          this.history.push({ uuid, title: chat.text, isEdit: false })
          this.chat.push({ uuid, data: [chat] })
          this.active = uuid // 把刚创建的会话设为当前选中
          this.recordState() // 保存聊天数据到 localStorage
        }
        else {
          // 情况 2：uuid 存在（旧会话）
          // 如果已经有聊天记录了，就把新的消息加进去，并且在必要时更新会话标题。
          this.chat[0].data.push(chat)
          if (this.history[0].title === t('chat.newChatTitle'))
            this.history[0].title = chat.text // 就用用户输入的第一句话作为标题
          this.recordState()
        }
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data.push(chat)
        if (this.history[index].title === t('chat.newChatTitle'))
          this.history[index].title = chat.text
        this.recordState()
      }
    },

    // 根据 uuid 和 index，修改指定会话中的某一条消息
    updateChatByUuid(uuid: number, index: number, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = chat
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = chat
        this.recordState()
      }
    },

    // 根据 uuid + index，对某条消息做“部分字段更新（merge）
    updateChatSomeByUuid(uuid: number, index: number, chat: Partial<Chat.Chat>) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat }
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat }
        this.recordState()
      }
    },

    // 删除某条消息
    deleteChatByUuid(uuid: number, index: number) {
      if (!uuid || uuid === 0) { // 情况 1：uuid 不存在（新会话）
        if (this.chat.length) {
          this.chat[0].data.splice(index, 1) // 删除会话中的消息索引为 index 的元素
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid) // 查找会话索引
      if (chatIndex !== -1) {
        this.chat[chatIndex].data.splice(index, 1)
        this.recordState()
      }
    },

    // 清空某个会话的聊天
    clearChatByUuid(uuid: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data = []
          this.recordState()
        }
        return
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data = []
        this.recordState()
      }
    },

    // 重置整个聊天系统
    clearHistory() {
      this.$state = { ...defaultState() }
      this.recordState()
    },

    // 保存当前状态 → 跳转到 Chat 路由，并带上 uuid 参数
    async reloadRoute(uuid?: number) {
      this.recordState()
      await router.push({ name: 'Chat', params: { uuid } })
    },


    recordState() {
      setLocalState(this.$state)
    },
  },
})



// 1️⃣ setUsingContext 开关“上下文模式” + 持久化
// 2️⃣ addHistory（新增会话） 1新会话插到最前面 2创建对应聊天记录 3创建对应聊天记录 4跳转路由（切换页面）
// 3️⃣ updateHistory 局部更新
// 4️⃣ deleteHistory 删除会话
// 5️⃣ setActive 切换当前会话 + 路由跳转
// 6️⃣ getChatByUuidAndIndex 根据 uuid 和 index 获取指定会话中的某一条消息
// 7️⃣ addChatByUuid 新增消息 1新会话 2旧会话
// 8️⃣ updateChatByUuid 更新消息
// 9️⃣ updateChatSomeByUuid 对某条消息做“部分字段更新（merge）”
// 10️⃣ deleteChatByUuid 删除某条消息
// 11️⃣ clearChatByUuid 清空某个会话的聊天
// 12️⃣ clearHistory 重置整个聊天系统
// 13️⃣ reloadRoute 保存当前状态 → 跳转到 Chat 路由，并带上 uuid 参数
// 14️⃣ recordState 保存当前状态到 localStorage（用于持久化）
