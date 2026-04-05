<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex h-full">
    <!--  px-4：水平内边距   padding-left + padding-right Tailwind 的 4 = 1rem
          m-auto：水平居中对齐 margin: auto
          space-y-4：垂直间距 
          text-center：文本居中对齐 text-align: center
          max-[400px]：最大宽度 400px
    -->
    <div class="px-4 m-auto space-y-4 text-center max-[400px]">
      <!-- 
      在 Tailwind 中：字体大小text-4xl ≈ 36px 左右
      text-slate-800：设置文字颜色 亮色模式下
      dark:text-neutral-200：在暗黑模式下，文本颜色
      -->
      <h1 class="text-4xl text-slate-800 dark:text-neutral-200">
        Sorry, page not found!
      </h1>
         <!-- 网站里最常见的“正文文字大小” text-base -->
      <p class="text-base text-slate-500 dark:text-neutral-400">
        Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.
      </p>
      <div class="flex items-center justify-center text-center">
        <div class="w-[300px]">
          <img src="../../../icons/404.svg" alt="404">
        </div>
        <!-- type="primary"按钮类型（样式）-->
      <NButton type="primary" @click="goHome">
        Go to Home
      </NButton>
    </div>  
  </div>
</template>