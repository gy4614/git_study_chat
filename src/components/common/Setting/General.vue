
<!-- 
        一个用户设置面板：可以修改用户信息、主题、语言，并管理聊天记录（导入/导出/清空）

1️⃣ 用户信息（头像 / 名字 / 描述）
2️⃣ 聊天记录管理（导出 / 导入 / 清空）
3️⃣ 主题切换（深色 / 浅色 / 自动）
4️⃣ 语言切换（多语言）
5️⃣ 响应式布局（移动端适配）
6️⃣ 重置用户信息


-->











<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, NInput, NPopconfirm, NSelect, useMessage } from 'naive-ui'
import type { Language, Theme } from '@/store/modules/app/helper'
import { SvgIcon } from '@/components/common'
import { useAppStore, useUserStore } from '@/store'
import type { UserInfo } from '@/store/modules/user/helper'
import { getCurrentDate } from '@/utils/functions'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'

const appStore = useAppStore()  // 主题、语言、响应式布局
const userStore = useUserStore()  // 用户信息

const { isMobile } = useBasicLayout()

const ms = useMessage()

const theme = computed(() => appStore.theme)

const userInfo = computed(() => userStore.userInfo)

const avatar = ref(userInfo.value.avatar ?? '')

const name = ref(userInfo.value.name ?? '')

const description = ref(userInfo.value.description ?? '')

const language = computed({
  get() {
    return appStore.language
  },
  set(value: Language) {
    appStore.setLanguage(value) // 设置语言，可以修改
  },
})
// 主题选项
const themeOptions: { label: string; key: Theme; icon: string }[] = [
  {
    label: 'Auto',
    key: 'auto',
    icon: 'ri:contrast-line',
  },
  {
    label: 'Light',
    key: 'light',
    icon: 'ri:sun-foggy-line',
  },
  {
    label: 'Dark',
    key: 'dark',
    icon: 'ri:moon-foggy-line',
  },
]
// 语言选项
const languageOptions: { label: string; key: Language; value: Language }[] = [
  { label: 'English', key: 'en-US', value: 'en-US' },
  { label: 'Español', key: 'es-ES', value: 'es-ES' },
  { label: '한국어', key: 'ko-KR', value: 'ko-KR' },
  { label: 'Русский язык', key: 'ru-RU', value: 'ru-RU' },
  { label: 'Tiếng Việt', key: 'vi-VN', value: 'vi-VN' },
  { label: '简体中文', key: 'zh-CN', value: 'zh-CN' },
  { label: '繁體中文', key: 'zh-TW', value: 'zh-TW' },
]
// 更新用户信息
function updateUserInfo(options: Partial<UserInfo>) {
  userStore.updateUserInfo(options)
  ms.success(t('common.success'))
}
// 重置用户信息
function handleReset() {
  userStore.resetUserInfo()
  ms.success(t('common.success'))
  window.location.reload()
}
 // 聊天记录管理
 // 1. 导出聊天记录
function exportData(): void {
  const date = getCurrentDate() // 获取当前日期
  const data: string = localStorage.getItem('chatStorage') || '{}' // 获取聊天记录，默认为空字符串
  const jsonString: string = JSON.stringify(JSON.parse(data), null, 2)
  // 创建 Blob 对象, 把字符串变成一个“文件对象”
  const blob: Blob = new Blob([jsonString], { type: 'application/json' })
  // 创建临时 URL，用于下载文件
  const url: string = URL.createObjectURL(blob)
  // 创建一个超链接元素
  const link: HTMLAnchorElement = document.createElement('a')
  link.href = url // 指向刚才生成的 Blob URL
  link.download = `chat-store_${date}.json` // 下载文件名
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
// 2. 导入聊天记录
function importData(event: Event): void {
  // 获取 input 元素
  const target = event.target as HTMLInputElement
  if (!target || !target.files)
    return
// 获取 input 元素
  const file: File = target.files[0]
  if (!file)
    return

  const reader: FileReader = new FileReader()
  // 读取完成后，解析 JSON 字符串并保存到本地存储中
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string)
      localStorage.setItem('chatStorage', JSON.stringify(data))
      ms.success(t('common.success'))
      location.reload() // 刷新页面，使聊天记录生效
    }
    catch (error) {
      ms.error(t('common.invalidFileFormat'))
    }
  }
  reader.readAsText(file) // 把文件内容按“文本”方式读取出来,执行时后，reader.result 会包含文件内容的字符串
}
// 3. 清除聊天记录
function clearData(): void {
  localStorage.removeItem('chatStorage')
  location.reload()
}
 // 4. 通过代码触发文件选择框（文件上传窗口）
function handleImportButtonClick(): void {
  const fileInput = document.getElementById('fileInput') as HTMLElement
  if (fileInput)
    fileInput.click()
}
</script>
<!-- 
头像  修改头像链接
姓名  修改姓名
描述  修改描述
聊天记录  导出、导入、清除
主题  切换主题
语言  切换语言
重置  重置用户信息
-->
<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
    <!-- 1. 头像链接
     flex-shrink-0 该元素不会压缩，保持固定宽度
    -->
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.avatarLink') }}</span>
        <div class="flex-1">
          <NInput v-model:value="avatar" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo({ avatar })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <!-- 2. 姓名 -->
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.name') }}</span>
        <div class="w-[200px]">
          <NInput v-model:value="name" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo({ name })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <!-- 3. 描述 -->
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.description') }}</span>
        <div class="flex-1">
          <NInput v-model:value="description" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo({ description })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <!-- 4. 聊天记录 -->
      <div
        class="flex items-center space-x-4"
        :class="isMobile && 'items-start'"
      >
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.chatHistory') }}</span>

        <div class="flex flex-wrap items-center gap-4">
          <NButton size="small" @click="exportData">
            <template #icon>
              <SvgIcon icon="ri:download-2-fill" />
            </template>
            {{ $t('common.export') }}
          </NButton>

          <input id="fileInput" type="file" style="display:none" @change="importData">
          <NButton size="small" @click="handleImportButtonClick">
            <template #icon>
              <SvgIcon icon="ri:upload-2-fill" />
            </template>
            {{ $t('common.import') }}
          </NButton>
          <!--  清除聊天记录  二次确认-->  
          <NPopconfirm placement="bottom" @positive-click="clearData">
            <template #trigger>
              <NButton size="small">
                <template #icon>
                  <SvgIcon icon="ri:close-circle-line" />
                </template>
                {{ $t('common.clear') }}
              </NButton>
            </template>
            {{ $t('chat.clearHistoryConfirm') }}
          </NPopconfirm>
        </div>
      </div>
      <!-- 5. 主题 -->
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.theme') }}</span>
        <div class="flex flex-wrap items-center gap-4">
          <template v-for="item of themeOptions" :key="item.key">
            <NButton
              size="small"
              :type="item.key === theme ? 'primary' : undefined"
              @click="appStore.setTheme(item.key)"
            >
              <template #icon>
                <SvgIcon :icon="item.icon" />
              </template>
            </NButton>
          </template>
        </div>
      </div>
      <!-- 6. 语言 -->
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.language') }}</span>
        <div class="flex flex-wrap items-center gap-4">
          <NSelect
            style="width: 140px"
            :value="language"
            :options="languageOptions"
            @update-value="value => appStore.setLanguage(value)"
          />
        </div>
      </div>
      <!-- 7. 重置 -->
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.resetUserInfo') }}</span>
        <NButton size="small" @click="handleReset">
          {{ $t('common.reset') }}
        </NButton>
      </div>
    </div>
  </div>
</template>
