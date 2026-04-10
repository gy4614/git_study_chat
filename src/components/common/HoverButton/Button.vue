<!-- 本质是一个自定义按钮组件 -->
<script setup lang='ts'>
interface Emit {
  (e: 'click'): void
}

const emit = defineEmits<Emit>()

function handleClick() {
  emit('click')
}
</script>

<template>
  <!-- 自定义按钮组件，  -->
  <button
    class="flex items-center justify-center w-10 h-10 transition rounded-full hover:bg-neutral-100 dark:hover:bg-[#414755]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
