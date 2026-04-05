import { createApp } from 'vue' // 引入 Vue 库
import App from './App.vue' // 引入App 组件
import { setupI18n } from './locales/' // 引入 i18n 配置
import { setupAssets, setupScrollbarStyle } from './plugins' //加载全局资源,滚动条样式
import { setupStore } from './store' // 引入 store 配置
import { setupRouter } from './router' // 引入 router 配置

async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupScrollbarStyle()

  setupStore(app) //把 store 挂到 app 上 之后你就可以在任何组件用：

  setupI18n(app)

  await setupRouter(app) //注册路由，可能有异步操作，所以用 await 等待完成后再挂载 app

  app.mount('#app')  // 挂载应用到 #app 元素上
}

bootstrap()  // 启动应用

