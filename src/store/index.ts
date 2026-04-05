import type { App } from 'vue'
import { store } from './helper'

export function setupStore(app: App) {
  app.use(store)
}

export * from './modules'

// app 模块 关于应用状态管理的数据 侧边栏折叠状态 主题 语言
// auth 模块 关于用户认证状态管理的数据 Token 会话信息
// chat 模块 关于管理聊天系统的所有数据（会话列表 + 聊天内容 + 当前会话 + 路由同步 + 本地持久化）
// settings 模块 关于管理用户设置的所有数据（系统消息 + 温度 + top_p）
// prompt 模块 关于管理提示词的所有数据（提示词列表 + 当前提示词 + 路由同步 + 本地持久化）
// user 模块 关于用户信息的所有数据（用户头像 + 用户名 + 用户描述） 