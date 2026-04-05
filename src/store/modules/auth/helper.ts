// 统一管理用户 Token 的存取（通常用于登录认证）
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN' // 本地存储的 Token 键名 

export function getToken() {
  return ss.get(LOCAL_NAME)  // 从本地存储获取 Token
}

export function setToken(token: string) {
  return ss.set(LOCAL_NAME, token)  // 设置 Token 到本地存储
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)  // 从本地存储移除 Token
}
