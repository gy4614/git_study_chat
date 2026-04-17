// 打包工具配置文件
import { defineConfig } from 'encode-bundle'
// 把 src/index.ts 打包成可发布的 JS 库，输出到 build 目录
export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  target: 'es2020',
  format: ['esm'], // 输出模块格式为 ES Module 模块语法
  splitting: false, // 不开启代码分割
  sourcemap: true,
  minify: false,
  shims: true,
  dts: false,
})
