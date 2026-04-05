// 统一封装所有“和后端聊天相关”的请求接口

// fetchChatAPI	普通聊天请求
// fetchChatConfig	获取配置
// fetchChatAPIProcess	流式聊天（重点）
// fetchSession	获取会话信息
// fetchVerify	校验 token

import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

// 普通聊天请求
// 向后端 /chat 接口发送用户问题，并支持多轮对话和请求取消
export function fetchChatAPI<T = any>(
  prompt: string, // 用户输入
  options?: { conversationId?: string; parentMessageId?: string }, // 上下文（多轮对话关键）
  signal?: GenericAbortSignal, // 取消信号
) {
  return post<T>({  // 发送普通聊天请求
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

// 从后端获取聊天系统配置（比如模型类型、是否可用等）
export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}


// 发送聊天请求（支持上下文 + AI参数 + 流式输出 + 中断）
export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    // onDownloadProgress 流式输出回调函数
    // Axios 会在“下载数据时不断触发回调”
    // 服务器一点一点返回内容,前端一点一点接收   类似 ChatGPT：你好，我是一个 AI... 一字一字出来
    //  👉 ChatGPT 的“打字效果”本质不是前端动画，而是：后端流式返回 + 前端 onDownloadProgress 实时渲染
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) { // 把用户设置传给后端：
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}


export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

// 把 token 发给后端，验证这个 token 是否有效
export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}