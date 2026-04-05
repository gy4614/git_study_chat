interface Window {
  $loadingBar?: import('naive-ui').LoadingBarProviderInst;
  $dialog?: import('naive-ui').DialogProviderInst;
  $message?: import('naive-ui').MessageProviderInst;
  $notification?: import('naive-ui').NotificationProviderInst;
}
// 在全局 window 上，增加这些属性
// LoadingBarProviderInst 是 Naive UI 提供的加载条组件实例类型
// DialogProviderInst 是 Naive UI 提供的弹窗组件实例类型
// MessageProviderInst 是 Naive UI 提供的消息组件实例类型
// NotificationProviderInst 是 Naive UI 提供的通知组件实例类型

// window.$loadingBar 是加载条组件实例   把实例拿出来全局使用