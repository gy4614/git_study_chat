<!-- 一个设置页，用来修改 AI 行为参数，并保存到全局 store -->

<script lang="ts" setup>
import { ref } from 'vue'
import { NButton, NInput, NSlider, useMessage } from 'naive-ui'
// NButton → 按钮组件  
// NInput → 输入框组件
// NSlider → 滑块组件
// useMessage → 消息提示组件
import { useSettingStore } from '@/store'
import type { SettingsState } from '@/store/modules/settings/helper'
import { t } from '@/locales'

const settingStore = useSettingStore()

const ms = useMessage()

const systemMessage = ref(settingStore.systemMessage ?? '')

const temperature = ref(settingStore.temperature ?? 0.5)

const top_p = ref(settingStore.top_p ?? 1)

function updateSettings(options: Partial<SettingsState>) {
  settingStore.updateSetting(options) // 更新全局状态
  ms.success(t('common.success'))
}

function handleReset() {
  settingStore.resetSetting()
  ms.success(t('common.success'))
  window.location.reload() // 刷新页面 为什么要 reload？因为刷新后，全局状态会被重置，需要重新加载页面才能生效
}
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <!--  左侧标题 -->
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.role') }}</span> 
        <!--  右侧输入框 
          文本框自动高度：autosize
        -->
        <div class="flex-1"> 
          <NInput v-model:value="systemMessage" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateSettings({ systemMessage })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <!--  温度设置 -->
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.temperature') }} </span>
        <div class="flex-1">
          <!--  右侧滑块  用户拖动滑块 → temperature 自动更新-->
          <NSlider v-model:value="temperature" :max="2" :min="0" :step="0.1" /> 
        </div>
        <span>{{ temperature }}</span>
        <NButton size="tiny" text type="primary" @click="updateSettings({ temperature })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <!--  top_p 设置 -->
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.top_p') }} </span>
        <div class="flex-1">
          <NSlider v-model:value="top_p" :max="1" :min="0" :step="0.1" />
        </div>
        <span>{{ top_p }}</span>
        <NButton size="tiny" text type="primary" @click="updateSettings({ top_p })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <!--  重置按钮 -->
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">&nbsp;</span>
        <NButton size="small" @click="handleReset">
          {{ $t('common.reset') }}
        </NButton>
      </div>
    </div>
  </div>
</template>
