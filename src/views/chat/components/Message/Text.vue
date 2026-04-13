<!-- 聊天消息渲染 支持 Markdown + 代码高亮 + 数学公式 + 复制代码 + 响应式样式-->
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, onUpdated, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import mdKatex from '@vscode/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
import { copyToClip } from '@/utils/copy'

interface Props {
  inversion?: boolean // 是否是“用户消息”
  error?: boolean // 是否是错误消息
  text?: string // 消息内容
  loading?: boolean // 是否生成中（AI 打字效果）
  asRawText?: boolean // 是否禁用 Markdown
}

const props = defineProps<Props>()

const { isMobile } = useBasicLayout()

const textRef = ref<HTMLElement>()

const mdi = new MarkdownIt({
  html: false, // 不允许 Markdown 里写原生 HTML
  linkify: true, // 自动把“普通链接文本”变成 <a> 标签
  // code 代码块里的“原始代码字符串”
  // language 代码块里的“语言”例如js
  highlight(code, language) { // “这段代码是什么语言，我该怎么上色”
    const validLang = !!(language && hljs.getLanguage(language)) //判断是否有合法语言 
    if (validLang) {
      const lang = language ?? '' // 有合法的语言，就使用
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  },
})
// mila 给所有 <a> 标签自动加属性
// target="_blank", 在新标签页打开链接
// rel="noopener", 防止新标签页继承当前标签页的 JavaScript 环境
mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
// mdKatex 支持数学公式
mdi.use(mdKatex)
// 根据不同状态，动态生成一组 CSS 类名
const wrapClass = computed(() => {
  return [
    'text-wrap', // 换行
    'min-w-[20px]', // 最小宽度
    'rounded-md', // 圆角
    isMobile.value ? 'p-2' : 'px-3 py-2',
    props.inversion ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]', // 用户消息背景颜色
    props.inversion ? 'dark:bg-[#a1dc95]' : 'dark:bg-[#1e1e20]',
    props.inversion ? 'message-request' : 'message-reply',
    { 'text-red-500': props.error },
  ]
})
// 如果 props.asRawText 是 false，则通过 Markdown 渲染文本。
// 如果是.asRawText 是 true，则直接显示文本。
const text = computed(() => {
  const value = props.text ?? ''
  if (!props.asRawText)
    return mdi.render(value)
  return value
})

function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">${t('chat.copyCode')}</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}
// 给所有“代码块里的复制按钮”绑定点击事件，实现点击复制代码 + 提示“已复制”
function addCopyEvents() { 
  if (textRef.value) { // 判断容器是否存在
    const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
    copyBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement?.nextElementSibling?.textContent // 获取代码块里的“原始代码字符串”
        if (code) {
          copyToClip(code).then(() => {
            btn.textContent = t('chat.copied')
            setTimeout(() => {
              btn.textContent = t('chat.copyCode')
            }, 1000)
          })
        }
      })
    })
  }
}
// 移除所有“代码块里的复制按钮”点击事件
function removeCopyEvents() {
  if (textRef.value) {
    const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
    copyBtn.forEach((btn) => {
      btn.removeEventListener('click', () => {})
    })
  }
}

onMounted(() => { // 组件挂载时
  addCopyEvents()
})

onUpdated(() => { // 组件更新时
  addCopyEvents()
})

onUnmounted(() => { // 组件被销毁时
  removeCopyEvents()
})
</script>
// 消息内容模板(用户消息/回复消息 聊天气泡)
<template>
  <div class="text-black" :class="wrapClass">
    <div ref="textRef" class="leading-relaxed break-words">
      <div v-if="!inversion">
        <div v-if="!asRawText" class="markdown-body" :class="{ 'markdown-body-generate': loading }" v-html="text" />
        <div v-else class="whitespace-pre-wrap" v-text="text" />
      </div>
      <div v-else class="whitespace-pre-wrap" v-text="text" />
    </div>
  </div>
</template>

<style lang="less">
@import url(./style.less);
</style>
