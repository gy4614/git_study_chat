// 管理用户认证状态（Token + 会话信息）
import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store/helper'
import { fetchSession } from '@/api' // 引入获取会话信息的 API

interface SessionResponse { // 会话信息响应体
  auth: boolean  // 是否认证成功
  model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'  // 模型类型
}

export interface AuthState { // 认证状态接口
  token: string | undefined  // 用户 Token 或 undefined
  session: SessionResponse | null  // 会话信息响应体或 null （未认证）
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    session: null,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.session?.model === 'ChatGPTAPI'
    },
  },

//调接口 fetchSession
//保存 session 到 store
//返回结果（给调用方用）
  actions: {
    async getSession() {
      try {
        const { data } = await fetchSession<SessionResponse>()
        this.session = { ...data }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    setToken(token: string) {
      this.token = token
      setToken(token)
    },

    removeToken() {
      this.token = undefined // 退出登录  
      removeToken() // 从本地存储移除 Token
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
