import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'

// 定义一个函数，用来接收router实例,注册守卫
// Session 是“服务器存的登录状态”
// Token 是“客户端存的登录状态”
export function setupPageGuard(router: Router) { 
  router.beforeEach(async (to, from) => {
    const authStore = useAuthStoreWithout()
    if (!authStore.session) {
      try {
        const data = await authStore.getSession()
        if (String(data.auth) === 'false' && authStore.token) {
          authStore.removeToken()
        }
        if (to.path === '/500') {
          return { name: 'Root'}
        }
        return true
      }
      catch (error) {
        if (to.path !== '/500') 
          return { name: '500'}
        return true
      }
    }
    return true
          
  })
}