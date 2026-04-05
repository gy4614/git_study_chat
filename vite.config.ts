import path from 'path'  // path：Node.js 路径处理
import type { PluginOption } from 'vite'  // defineConfig：提供类型提示
import { defineConfig, loadEnv } from 'vite'  // loadEnv：加载 .env 环境变量
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa' // PWA 插件（离线应用）



// 根据 .env 配置，决定项目要加载哪些功能插件（比如 Vue、PWA）
// : PluginOption[]  返回插件数组，根据环境变量动态加载插件
// ImportMetaEnv  环境变量对象的类型定义
// PWA = Progressive Web App  让网页变成“像手机App一样”
function setupPlugins(env: ImportMetaEnv): PluginOption[] {
  return [
    vue(),
    env.VITE_GLOB_APP_PWA === 'true' && VitePWA({
      injectRegister: 'auto',
      // 自动注册 Service WorkerService Worker 是运行在浏览器后台的一个独立脚本，独立于网页页面。它可以实现：离线访问（通过缓存） 推送通知后台同步拦截网络请求（作为页面和网络之间的代理）
      manifest: {
        name: 'chatGPT',  // 应用名称
        short_name: 'chatGPT',  // 图标下的名字
        icons: [  // 图标配置
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ]
}
// Vite 在启动时，会调用这个函数，并传入一个 env 参数
//如果运行 npm run dev  则 env.mode 为 dev
//如果运行 npm run build  则 env.mode 为 prod
// process.cwd() 获取当前项目根目录
export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv
  // as unknown 先变成“任意类型”，再强制转换为 ImportMetaEnv 类型，确保类型安全
  return {
    resolve: {  // 解析配置
      alias: {
        '@': path.resolve(process.cwd(), 'src'),  // 配置路径别名，方便导入组件
      },
    },
    plugins: setupPlugins(viteEnv),
    server: {
      host: '0.0.0.0',  // 局域网可访问
      port: 1002,  // 前端服务端端口号
      open: false,  // 自动打开浏览器
      proxy: {  // 把前端请求 /api 的请求，转发到后端服务器
        '/api': {  // 只要请求路径以 /api 开头，就转发到后端服务器
          target: viteEnv.VITE_APP_API_BASE_URL,  // 目标服务器（后端地址）
          changeOrigin: true, // 请求头中的 Host 会自动替换为后端服务器的 Host
          rewrite: path => path.replace('/api/', '/'),  // 重写路径，去掉 /api 前缀
        },
      },
    },
    build: {  // 打包配置
      reportCompressedSize: false,  // 不报告压缩后的大小 提升速度
      sourcemap: false,  // 不暴露源码
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})


// ┌──────────────┐
// │   浏览器      │
// │ (前端代码)    │
// └──────┬───────┘
//        │ ① 发请求
//        │ fetch('/api/user')
//        ▼
// ┌──────────────┐
// │   Vite Dev   │
// │   本地服务器  │
// └──────┬───────┘
//        │ ② 匹配 proxy: '/api'
//        │
//        │ ③ rewrite 路径
//        │   /api/user → /user
//        │
//        │ ④ 转发请求
//        ▼
// ┌──────────────┐
// │    后端服务   │
// │  http://8080 │
// └──────┬───────┘
//        │ ⑤ 返回数据
//        ▼
// ┌──────────────┐
// │   Vite Dev   │
// └──────┬───────┘
//        │ ⑥ 返回给浏览器
//        ▼
// ┌──────────────┐
// │   浏览器      │
// └──────────────┘
