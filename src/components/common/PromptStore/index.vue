<!-- 它展示了一个多功能的 Prompt 模板管理界面，包括本地模板管理、模板导入导出、在线模板导入等功能 -->

<script setup lang='ts'>
import type { DataTableColumns } from 'naive-ui'
import { computed, h, ref, watch } from 'vue'
import { NButton, NCard, NDataTable, NDivider, NInput, NList, NListItem, NModal, NPopconfirm, NSpace, NTabPane, NTabs, NThing, useMessage } from 'naive-ui'
import PromptRecommend from '../../../assets/recommend.json'
import { SvgIcon } from '..'
import { usePromptStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'

interface DataProps {
  renderKey: string // 渲染在前端页面上作为标题的内容
  renderValue: string // 渲染在前端页面上作为内容的内容
  key: string // 实际的key值 ，用于唯一标识
  value: string // 实际的value值 ，用于存储模板内容
}

interface Props {
  visible: boolean // 是否显示弹窗
}

interface Emit {
  (e: 'update:visible', visible: boolean): void 
  // update:visible：这个事件在子组件中触发，通知父组件更新 visible 状态。
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const message = useMessage()

const show = computed({
  get: () => props.visible,
  set: (visible: boolean) => emit('update:visible', visible),
})

const showModal = ref(false)  // 模态框的显示与隐藏

const importLoading = ref(false)
const exportLoading = ref(false)

const searchValue = ref<string>('') // 用户在搜索框中输入的值

// 移动端自适应相关
const { isMobile } = useBasicLayout()
// 管理模板数据
const promptStore = usePromptStore()

// Prompt在线导入推荐List,根据部署者喜好进行修改(assets/recommend.json)
const promptRecommendList = PromptRecommend
const promptList = ref<any>(promptStore.promptList)

// 用于添加修改的临时prompt参数 ,在提交时加到promptList中
const tempPromptKey = ref('')
const tempPromptValue = ref('')

// Modal模式，根据不同模式渲染不同的Modal内容
const modalMode = ref('')

// 这个是为了后期的修改Prompt内容考虑，因为要针对无uuid的list进行修改，且考虑到不能出现标题和内容的冲突，所以就需要一个临时item来记录一下
// 因为在修改模板时需要有一个标识符来跟踪修改的对象，这个临时对象帮助确保我们不会修改错误的模板。
const tempModifiedItem = ref<any>({})

// 添加修改导入都使用一个Modal, 临时修改内容占用tempPromptKey,切换状态前先将内容都清楚
const changeShowModal = (mode: 'add' | 'modify' | 'local_import', selected = { key: '', value: '' }) => {
  if (mode === 'add') {
    // 清空临时模板数据 tempPromptKey 和 tempPromptValue，为用户输入新的模板准备好空白字段。
    tempPromptKey.value = ''
    tempPromptValue.value = ''
  }
  else if (mode === 'modify') {
    // 将选中的模板 selected 保存到 tempModifiedItem 中，确保在修改时能够获取到正确的模板。
    // 将 selected 中的 key 和 value 分别赋值给 tempPromptKey 和 tempPromptValue，填充模态框中的输入框。
    tempModifiedItem.value = { ...selected }
    tempPromptKey.value = selected.key
    tempPromptValue.value = selected.value
  }
  else if (mode === 'local_import') {
    // 设置 tempPromptKey 为 'local_import'，并将 tempPromptValue 清空，准备导入本地模板的数据。
    tempPromptKey.value = 'local_import'
    tempPromptValue.value = ''
  }
  showModal.value = !showModal.value
  modalMode.value = mode
}

// 在线导入相关
const downloadURL = ref('')
const downloadDisabled = computed(() => downloadURL.value.trim().length < 1) // 下载按钮是否禁用
const setDownloadURL = (url: string) => {
  downloadURL.value = url
}

// 控制 input 按钮
const inputStatus = computed (() => tempPromptKey.value.trim().length < 1 || tempPromptValue.value.trim().length < 1)

// Prompt模板相关操作
// 主要用于向模板列表中添加新模板
// 这个函数通常在用户点击 "添加模板" 按钮时触发，确保用户不会添加重复的模板，并且可以方便地查看成功添加的提示。
const addPromptTemplate = () => {
  for (const i of promptList.value) {
    if (i.key === tempPromptKey.value) {
      message.error(t('store.addRepeatTitleTips'))
      return
    }
    if (i.value === tempPromptValue.value) {
      message.error(t('store.addRepeatContentTips', { msg: tempPromptKey.value }))
      return
    }
  }
  promptList.value.unshift({ key: tempPromptKey.value, value: tempPromptValue.value } as never)
  message.success(t('common.addSuccess'))
  changeShowModal('add')
}

// modifyPromptTemplate修改某条 prompt，并确保 key/value 不重复，最后更新列表
const modifyPromptTemplate = () => {
  let index = 0

  // 通过临时索引把待修改项摘出来
  for (const i of promptList.value) {
    if (i.key === tempModifiedItem.value.key && i.value === tempModifiedItem.value.value)
      break
    index = index + 1
  }

  const tempList = promptList.value.filter((_: any, i: number) => i !== index)

  // 搜索有冲突的部分
  for (const i of tempList) {
    if (i.key === tempPromptKey.value) {
      message.error(t('store.editRepeatTitleTips'))
      return
    }
    if (i.value === tempPromptValue.value) {
      message.error(t('store.editRepeatContentTips', { msg: i.key }))
      return
    }
  }

  promptList.value = [{ key: tempPromptKey.value, value: tempPromptValue.value }, ...tempList] as never // 更新 promptList 新修改的数据（放最前）+ 剩余旧数据
  message.success(t('common.editSuccess'))
  changeShowModal('modify')
}
// 删除
const deletePromptTemplate = (row: { key: string; value: string }) => {
  promptList.value = [
    ...promptList.value.filter((item: { key: string; value: string }) => item.key !== row.key),
  ] as never
  message.success(t('common.deleteSuccess'))
}
// 清空所有模板
const clearPromptTemplate = () => {
  promptList.value = []
  message.success(t('common.clearSuccess'))
}
// 导入模板数据
// 该函数主要用于从 JSON 导入模板数据，并确保导入的模板数据格式正确、不会与现有数据重复。
const importPromptTemplate = (from = 'online') => {
  try {
    const jsonData = JSON.parse(tempPromptValue.value)
    let key = ''
    let value = ''
    // 可以扩展加入更多模板字典的key
    // 判断数据中使用的字段类型（key-value）是否符合模板要求，或者是否是某个已知格式
    if ('key' in jsonData[0]) {
      key = 'key'
      value = 'value'
    }
    else if ('act' in jsonData[0]) {
      key = 'act'
      value = 'prompt'
    }
    else {
      // 不支持的字典的key防止导入 以免破坏prompt商店打开
      message.warning('prompt key not supported.')
      throw new Error('prompt key not supported.')
    }

    for (const i of jsonData) {
      if (!(key in i) || !(value in i))
        throw new Error(t('store.importError'))
      let safe = true
      for (const j of promptList.value) {
        if (j.key === i[key]) {
          message.warning(t('store.importRepeatTitle', { msg: i[key] }))
          safe = false
          break
        }
        if (j.value === i[value]) {
          message.warning(t('store.importRepeatContent', { msg: i[key] }))
          safe = false
          break
        }
      }
      if (safe)
        promptList.value.unshift({ key: i[key], value: i[value] } as never)
    }
    message.success(t('common.importSuccess'))
  }
  catch {
    message.error('JSON 格式错误，请检查 JSON 格式')
  }
  if (from === 'local')
    showModal.value = !showModal.value
}

// 模板导出
const exportPromptTemplate = () => {
  exportLoading.value = true
  const jsonDataStr = JSON.stringify(promptList.value) //把数据转成 JSON 字符串
  const blob = new Blob([jsonDataStr], { type: 'application/json' })// 创建 Blob 对象
  const url = URL.createObjectURL(blob) // 创建 URL 对象 这个 URL 指向刚刚创建的“虚拟文件”
  const link = document.createElement('a')
  link.href = url // 指向文件地址
  link.download = 'ChatGPTPromptTemplate.json' // 指定下载文件名
  link.click() // 触发点击事件，下载文件
  URL.revokeObjectURL(url) // 释放 URL 对象，避免内存泄漏
  exportLoading.value = false
}

// 模板在线导入
const downloadPromptTemplate = async () => {
  try {
    importLoading.value = true
    const response = await fetch(downloadURL.value) // 向这个 URL 发起一个 GET 请求
    const jsonData = await response.json() // 解析 JSON 数据
    if ('key' in jsonData[0] && 'value' in jsonData[0]) // 检查是否有 key-value 字段
      tempPromptValue.value = JSON.stringify(jsonData)
    if ('act' in jsonData[0] && 'prompt' in jsonData[0]) { // 检查是否有 act-prompt 字段
      const newJsonData = jsonData.map((item: { act: string; prompt: string }) => {
        return {
          key: item.act,
          value: item.prompt,
        }
      })
      tempPromptValue.value = JSON.stringify(newJsonData)
    }
    importPromptTemplate()
    downloadURL.value = ''
  }
  catch {
    message.error(t('store.downloadError'))
    downloadURL.value = '' // 清空下载链接
  }
  finally {
    importLoading.value = false
  }
}

// 移动端自适应相关
const renderTemplate = () => {
  const [keyLimit, valueLimit] = isMobile.value ? [10, 30] : [15, 50]

  return promptList.value.map((item: { key: string; value: string }) => {
    return {
      renderKey: item.key.length <= keyLimit ? item.key : `${item.key.substring(0, keyLimit)}...`,
      renderValue: item.value.length <= valueLimit ? item.value : `${item.value.substring(0, valueLimit)}...`,
      key: item.key,
      value: item.value,
    }
  })
}

const pagination = computed(() => {
  const [pageSize, pageSlot] = isMobile.value ? [6, 5] : [7, 15]
  return {
    pageSize, pageSlot, //  pageSize 每页显示的项数，pageSlot 页码数量
  }
})

// table相关
const createColumns = (): DataTableColumns<DataProps> => {
  return [
    {
      title: t('store.title'),
      key: 'renderKey',
    },
    {
      title: t('store.description'),
      key: 'renderValue',
    },
    {
      title: t('common.action'),
      key: 'actions', // 表示这一列用于显示操作按钮
      width: 100,
      align: 'center',
      render(row) {
        return h('div', { class: 'flex items-center flex-col gap-2' }, {
          default: () => [h(
            NButton,
            {
              tertiary: true, //次要按钮
              size: 'small',
              type: 'info',
              onClick: () => changeShowModal('modify', row), // 显示模态框并传递当前行数据（row）用于修改。
            },
            { default: () => t('common.edit') },
          ),
          h(
            NButton,
            {
              tertiary: true,
              size: 'small',
              type: 'error',
              onClick: () => deletePromptTemplate(row),
            },
            { default: () => t('common.delete') }, // 删除
          ),
          ],
        })
      },
    },
  ]
}

const columns = createColumns()
// 监视 promptList 变化，更新 promptStore
watch(
  () => promptList,
  () => {
    promptStore.updatePromptList(promptList.value)
  },
  { deep: true },
)

const dataSource = computed(() => {
  const data = renderTemplate() // 调用 renderTemplate 函数获取模板数据
  const value = searchValue.value // 获取搜索框中的值
  if (value && value !== '') {
    return data.filter((item: DataProps) => {
      return item.renderKey.includes(value) || item.renderValue.includes(value)
      // 过滤出包含搜索值的项
    })
  }
  return data
}) 
</script>

<template>
  <NModal v-model:show="show" style="width: 90%; max-width: 900px;" preset="card">
    <div class="space-y-4">
      <NTabs type="segment">
        <!-- 本地模板选项卡 -->
        <NTabPane name="local" :tab="t('store.local')">
          <div
            class="flex gap-3 mb-4"
            :class="[isMobile ? 'flex-col' : 'flex-row justify-between']"
          >
          <!-- 控制按钮区 -->
            <div class="flex items-center space-x-4">
              <NButton
                type="primary"
                size="small"
                @click="changeShowModal('add')"
              >
                {{ t('common.add') }}
              </NButton>
              <NButton
                size="small"
                @click="changeShowModal('local_import')"
              >
                {{ t('common.import') }}
              </NButton>
              <NButton
                size="small"
                :loading="exportLoading"
                @click="exportPromptTemplate()"
              >
                {{ t('common.export') }}
              </NButton>
              <!-- 清空按钮(需要二次确认) -->
              <NPopconfirm @positive-click="clearPromptTemplate">
                <template #trigger>
                  <NButton size="small">
                    {{ t('common.clear') }}
                  </NButton>
                </template>
                {{ t('store.clearStoreConfirm') }}
              </NPopconfirm>
            </div>
            <!-- 搜索框区 -->
            <div class="flex items-center">
              <NInput v-model:value="searchValue" style="width: 100%" />
            </div>
          </div>
          <!-- 表格和列表显示（非移动端为表格，移动端为列表） -->
          <NDataTable
            v-if="!isMobile"
            :max-height="400"
            :columns="columns"
            :data="dataSource"
            :pagination="pagination"  
            :bordered="false"
          />
          <NList v-if="isMobile" style="max-height: 400px; overflow-y: auto;">
            <NListItem v-for="(item, index) of dataSource" :key="index">
              <NThing :title="item.renderKey" :description="item.renderValue" />
              <template #suffix>
                <div class="flex flex-col items-center gap-2">
                  <NButton tertiary size="small" type="info" @click="changeShowModal('modify', item)">
                    {{ t('common.edit') }}
                  </NButton>
                  <NButton tertiary size="small" type="error" @click="deletePromptTemplate(item)">
                    {{ t('common.delete') }}
                  </NButton>
                </div>
              </template>
            </NListItem>
          </NList>
        </NTabPane>
        <!-- 在线模板选项卡 -->
        <NTabPane name="download" :tab="t('store.online')">
          <p class="mb-4">
            {{ t('store.onlineImportWarning') }}
          </p>
          <div class="flex items-center gap-4">
            <NInput v-model:value="downloadURL" placeholder="" />
            <NButton
              strong
              secondary
              :disabled="downloadDisabled"
              :loading="importLoading"
              @click="downloadPromptTemplate()"
            >
              {{ t('common.download') }}
            </NButton>
          </div>
          <NDivider />
          <div class="max-h-[360px] overflow-y-auto space-y-4">
            <NCard
              v-for="info in promptRecommendList"
              :key="info.key" :title="info.key"
              :bordered="true"
              embedded 
            >
              <p
                class="overflow-hidden text-ellipsis whitespace-nowrap"
                :title="info.desc"
              >
                {{ info.desc }}
              </p>
              <template #footer>
                <div class="flex items-center justify-end space-x-4">
                  <NButton text>
                    <a
                      :href="info.url"
                      target="_blank"
                    >
                      <SvgIcon class="text-xl" icon="ri:link" />
                    </a>
                  </NButton>
                  <NButton text @click="setDownloadURL(info.downloadUrl) ">
                    <SvgIcon class="text-xl" icon="ri:add-fill" />
                  </NButton>
                </div>
              </template>
            </NCard>
          </div>
        </NTabPane>
      </NTabs>
    </div>
  </NModal>
  <!-- 模板添加/修改弹窗 -->
  <NModal v-model:show="showModal" style="width: 90%; max-width: 600px;" preset="card">
    <!-- vertical 属性会让 NSpace 组件中的子元素按 垂直方向（从上到下）排列，而不是默认的 水平方向（从左到右）。 -->
    <NSpace v-if="modalMode === 'add' || modalMode === 'modify'" vertical>
      {{ t('store.title') }}
      <NInput v-model:value="tempPromptKey" />
      {{ t('store.description') }}
      <NInput v-model:value="tempPromptValue" type="textarea" />
      <NButton
        block
        type="primary"
        :disabled="inputStatus"
        @click="() => { modalMode === 'add' ? addPromptTemplate() : modifyPromptTemplate() }"
      >
        {{ t('common.confirm') }}
      </NButton>
    </NSpace>
    <NSpace v-if="modalMode === 'local_import'" vertical>
      <NInput
        v-model:value="tempPromptValue"
        :placeholder="t('store.importPlaceholder')"
        :autosize="{ minRows: 3, maxRows: 15 }"
        type="textarea"
      />
      <NButton
        block
        type="primary"
        :disabled="inputStatus"
        @click="() => { importPromptTemplate('local') }"
      >
        {{ t('common.import') }}
      </NButton>
    </NSpace>
  </NModal>
</template>
