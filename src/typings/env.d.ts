/// <reference types="vite/client" />    
// 引入 Vite 提供的类型定义 让你在 TS 里可以使用：
interface ImportMetaEnv {
	readonly VITE_GLOB_API_URL: string;
	readonly VITE_APP_API_BASE_URL: string;
	readonly VITE_GLOB_OPEN_LONG_REPLY: string;
	readonly VITE_GLOB_APP_PWA: string;
}
// 表示ImportMetaEnv对象必须包含这四个属性，且属性值为字符串类型
// interface ts中用来定义类型结构的关键字
// readonly 只读属性
