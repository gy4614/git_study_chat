<!-- 

这段代码是一个 Vue 3 + <script setup> + TypeScript 写的小组件，主要作用是对 Iconify 的 Icon 组件做一层简单封装，同时允许外部传入 class 和 style。



1. useAttrs()：获取传入组件的非 prop 属性 
2. Icon：来自 Iconify 的 Vue 组件，用于显示图标。

-->

<script setup lang='ts'>
import { computed, useAttrs } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  icon?: string  // 定义一个可选参数，用于接收图标名称
}

defineProps<Props>()

const attrs = useAttrs()    // 获取传入组件的非 prop 属性 ，没有被 props 接收的属性

// 从 attrs 中提取 class 和 style 属性
// 这里使用 computed 函数，当 attrs 变化时，自动更新 bindAttrs 的值(响应式)
const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || '',
}))
</script>

<template>
  <Icon :icon="icon || ''" v-bind="bindAttrs" />
</template>
