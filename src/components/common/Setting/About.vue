
<!-- 📡 请求接口获取配置（fetchChatConfig）
🔄 用 loading 控制加载动画
🖥️ 把配置数据显示在页面上（带条件判断） -->

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NSpin } from 'naive-ui' // NSpin → 加载动画组件（转圈圈）
import pkg from '../../../../package.json'
import { fetchChatConfig } from '@/api'
import { useAuthStore } from '@/store'

interface ConfigState {
  timeoutMs?: number // 请求超时
  reverseProxy?: string  // 反向代理地址
  apiModel?: string  // API 模型
  socksProxy?: string  // SOCKS 代理地址
  httpsProxy?: string  // HTTPS 代理地址
  usage?: string  // 使用量
}

const authStore = useAuthStore()

const loading = ref(false)

const config = ref<ConfigState>() // 存储接口返回的数据

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI) // !!xxx 转换为布尔值，将 undefined、null、false、0、'' 等转换为 false，其他值转换为 true

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConfig() // 组件加载完成后，自动请求数据
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <h2 class="text-xl font-bold">
        <!-- 版本号 -->
        Version - {{ pkg.version }}  
      </h2>
      <!-- API 模型 -->
      <p>{{ $t("setting.api") }}：{{ config?.apiModel ?? '-' }}</p>
      <p v-if="isChatGPTAPI">
        <!-- 月使用量 -->
        {{ $t("setting.monthlyUsage") }}：{{ config?.usage ?? '-' }}
      </p>
      <p v-if="!isChatGPTAPI">
        <!-- 反向代理地址 -->
        {{ $t("setting.reverseProxy") }}：{{ config?.reverseProxy ?? '-' }}
      </p>
      <!-- 请求超时 -->
      <p>{{ $t("setting.timeout") }}：{{ config?.timeoutMs ?? '-' }}</p>
      <!-- SOCKS 代理地址 -->
      <p>{{ $t("setting.socks") }}：{{ config?.socksProxy ?? '-' }}</p>
      <!-- HTTPS 代理地址 --> 
      <p>{{ $t("setting.httpsProxy") }}：{{ config?.httpsProxy ?? '-' }}</p>
    </div>
  </NSpin>
</template>
