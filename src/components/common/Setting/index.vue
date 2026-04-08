
<!-- 设置弹窗，里面用 Tabs 切换不同设置页面
 
Tabs（标签页）
  ├── General（基础设置）
  ├── Advanced（高级设置）
  └── About（关于/配置）

-->

<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NModal, NTabPane, NTabs } from 'naive-ui'
import General from './General.vue'
import Advanced from './Advanced.vue'
import About from './About.vue'
import { useAuthStore } from '@/store'
import { SvgIcon } from '@/components/common'
// 设置弹窗属性
interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>() // 设置弹窗属性

const emit = defineEmits<Emit>()  // 子组件通知父组件更新 visible 属性

const authStore = useAuthStore()

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)
// 当前选中的 Tab
const active = ref('General')
// 让子组件内部可以直接控制 v-model
const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})
</script>

<template>
  <!-- 设置弹窗
preset="card" 👉 Naive UI 内置样式（卡片风格）
:auto-focus="false"  禁止自动聚焦

打开弹窗
父组件 → visible = true
→ props.visible
→ show = true
→ Modal 打开
关闭弹窗
子组件 → show = false
→ emit('update:visible', false)
→ 父组件更新 visible 属性



    -->
  <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 640px">
    <div>
      <NTabs v-model:value="active" type="line" animated>
        <NTabPane name="General" tab="General">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:file-user-line" />
            <span class="ml-2">{{ $t('setting.general') }}</span>
          </template>
          <div class="min-h-[100px]">
            <General />
          </div>
        </NTabPane>
        <NTabPane v-if="isChatGPTAPI" name="Advanced" tab="Advanced">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:equalizer-line" />
            <span class="ml-2">{{ $t('setting.advanced') }}</span>
          </template>
          <div class="min-h-[100px]">
            <Advanced />
          </div>
        </NTabPane>
        <NTabPane name="Config" tab="Config">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:list-settings-line" />
            <span class="ml-2">{{ $t('setting.config') }}</span>
          </template>
          <About />
        </NTabPane>
      </NTabs>
    </div>
  </NModal>
</template>
