<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'

const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()
</script>

<template>
  <NConfigProvider
    class="h-full"   
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="language"
  >
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>
<!-- 1.NConfigProvider：提供“全局 UI 配置（主题、语言、样式）”

2.NaiveProvider：提供“全局功能 API（message / dialog / notification）”

3.RouterView：使用这些配置和 API 的地方 

4.因为 Naive UI 使用了 Vue 的 provide/inject 机制，在顶层 Provider 中通过 provide 注入 message API，子组件通过 inject 获取。Vue 在 inject 时会沿组件树向上查找最近的 provide，因此即使跨越多层组件，也可以访问到该 API。

-->