import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'

const service = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL,
})

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Authorization: Bearer <token>  Bearer 是 HTTP Authorization 请求头的一种类型
       // Bearer ${token} = JWT 的标准携带方式，告诉后端“我是持有这个 token 的用户”，后端根据 token 验证权限。
      return config
    }
  },
  (error) => {
      return Promise.reject(error.response)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error.response)
  }

)

export default service