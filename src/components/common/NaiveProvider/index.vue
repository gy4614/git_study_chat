<!-- 给整个应用提供全局的弹窗、消息、通知、加载条等能力 -->
<script setup lang="ts">
import { defineComponent, h } from 'vue'
import {
  NDialogProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  useDialog,
  useLoadingBar,
  useMessage,
  useNotification,
} from 'naive-ui'

function registerNaiveTools() { // 把这些 UI 工具挂到全局
  window.$loadingBar = useLoadingBar()
  window.$dialog = useDialog()
  window.$message = useMessage()
  window.$notification = useNotification()
}
// 定义了一个名为 NaiveProviderContent 的 Vue 组件
//在 Provider 内部执行 setup() 方法，从而让 useMessage() 等生效
const NaiveProviderContent = defineComponent({
  name: 'NaiveProviderContent',
  setup() {
    registerNaiveTools()
  },
  render() {
    return h('div')
  },
})
</script>

<template>
  <NLoadingBarProvider>
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <slot />
          <NaiveProviderContent />
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NLoadingBarProvider>
</template>
<!-- // 借助一个隐藏组件，在 Provider 内部执行 hooks，并把结果挂到全局” -->