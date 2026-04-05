import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: ChatLayout,
    redirect: '/chat',
    children: [
      {
        path: '/chat/:uuid?', // :uuid? 表示参数是可选的
        name: 'Chat',
        component: () => import('@/views/chat/index.vue')
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue')
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',  // 动态参数 + 正则匹配  匹配所有路径 
    name: 'notFound',  
    redirect: '/404',  // 一旦匹配到未知路径，就重定向到 /404 页面
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
   scrollBehavior: () => ({ left: 0, top: 0 }), // scrollBehavior = 控制页面跳转后滚动位置的函数
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}