
// 它属于 Tailwind CSS 的配置文件，用来：

// 扫描你的代码（决定生成哪些样式）
// 定义主题（颜色、动画等）
// 控制暗黑模式
// 扩展功能


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',  // <html class="dark"> 开启暗黑模式    media 跟随系统暗黑模式开关
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',    // 告诉 Tailwind 去哪里扫描 class
  ],
  theme: {
    extend: {  // 扩展主题，添加自定义动画
      animation: {
        blink: 'blink 1.2s infinite steps(1, start)',   // steps(1, start) 表示分成 1 份，从 start 开始就切换，无过渡
      },
      keyframes: {  // 定义自定义动画的 keyframes ，即动画的每个帧
        blink: {
          '0%, 100%': { 'background-color': 'currentColor' },
          '50%': { 'background-color': 'transparent' },
        },
      },
    },
  },
  plugins: [],  // 插件扩展目前没有使用
}
