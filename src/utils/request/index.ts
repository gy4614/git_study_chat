// 二次封装 axios，添加统一的请求参数格式和响应数据格式
import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal} from 'axios'
// AxiosProgressEvent 是 axios 提供的进度事件类型，用于监听下载进度
// AxiosResponse 是 axios 提供的响应类型，包含了状态码、响应头、响应体等信息（返回的数据结构）
// GenericAbortSignal 是 axios 提供的信号类型，用于取消请求
import request from './axios'
import { useAuthStore } from '@/store'

export interface HttpOption {  // 定义“请求参数格式”
  url: string
  data?: any
  method?: string
  headers?: any // 自定义请求头
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void // 监听下载进度事件
  signal?: GenericAbortSignal // 取消请求信号类型
  beforeRequest?: () => void
  afterRequest?: () => void
}

export interface Response<T = any> { // 定义“后端返回数据的统一格式”，并导出给全项目使用
  data: T // T = any  T 泛形，data是可变的
  message: string | null // 后端返回的消息，null 表示没有消息
  status: string // 后端返回的状态码
}

function http<T = any>( // 封装通用请求函数 http
  { url, data, method, headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    const authStore = useAuthStore()

    if (res.data.status === 'Success' || typeof res.data === 'string')
      return res.data

    if (res.data.status === 'Unauthorized') {
      authStore.removeToken()
      window.location.reload()  // 刷新当前页面 ，重新获取登录状态
      return Promise.reject(res.data)
    }

    return Promise.reject(res.data)
  }

  const failHandler = (error: Response<any>) => { // Response<Error> 在类型上是合法的，但在实际前后端通信中几乎是错误设计，因为后端不会返回 JS 的 Error 对象。
    afterRequest?.()
    throw new Error(error?.message || 'Error')
  }

  beforeRequest?.() // 可选调用（有就执行） 在请求前执行

  method = method || 'GET' // 如果没传 method，就默认 GET 请求

  const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})

  return method === 'GET'
    ? request.get(url, { params, headers, signal, onDownloadProgress }).then(successHandler, failHandler)
    : request.post(url, params, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
}

export function get<T = any>(
  { url, data, method = 'GET', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    headers,
    data,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function post<T = any>(
  { url, data, method = 'POST', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export default post



// // 【调用者】
//    │
//    │  await get<User>({ url, data })
//    │
//    │  👉 指定泛型：T = User
//    ▼
// ──────────────────────────────────
// get<T = User>()
// 返回类型: Promise<Response<User>>
//    │
//    │  return http<T>(options)
//    ▼
// ──────────────────────────────────
// http<T = User>()
// 返回类型: Promise<Response<User>>
//    │
//    │  内部调用 axios：
//    ▼
// ──────────────────────────────────
// request.get / post
// 返回类型:
// Promise<AxiosResponse<Response<User>>>
//    │
//    │  👇 进入 Promise.then
//    ▼
// ──────────────────────────────────
// .then(successHandler)

// successHandler(res: AxiosResponse<Response<User>>)
//    │
//    │  res 结构：
//    │  {
//    │    data: Response<User>,   👈 重点
//    │    status: 200,
//    │    headers: ...
//    │  }
//    │
//    │  👇 返回
//    │  return res.data
//    ▼
// ──────────────────────────────────
// Promise 类型发生变化 ⚠️

// 原来：
// Promise<AxiosResponse<Response<User>>>

// 变成：
// Promise<Response<User>>   ✅
//    │
//    ▼
// ──────────────────────────────────
// 返回给 http<T>()
//    │
//    ▼
// 返回给 get<T>()
//    │
//    ▼
// 【调用者最终拿到】

// const res: Response<User>

// res.data  👉 User 类型