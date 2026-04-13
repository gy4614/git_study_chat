
// 处理“滚动容器”的逻辑
import type { Ref } from 'vue'
import { nextTick, ref } from 'vue'

type ScrollElement = HTMLDivElement | null // 滚动容器的元素类型 div

interface ScrollReturn {
  scrollRef: Ref<ScrollElement> // 滚动容器的元素引用
  scrollToBottom: () => Promise<void> // 滚动到最底部
  scrollToTop: () => Promise<void> // 滚动到最顶部
  scrollToBottomIfAtBottom: () => Promise<void> // “接近底部才滚”
}

export function useScroll(): ScrollReturn {
  const scrollRef = ref<ScrollElement>(null)

  const scrollToBottom = async () => {
    await nextTick() // 等待 DOM 更新完成
    if (scrollRef.value)
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight //滚动条位置 = 内容总高度
  }

  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = 0
  }

  const scrollToBottomIfAtBottom = async () => {
    await nextTick()
    if (scrollRef.value) {
      const threshold = 100 // 距离底部 100px 以内，算是在底部”
      const distanceToBottom = scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
      if (distanceToBottom <= threshold)
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  }

  return {
    scrollRef,
    scrollToBottom,
    scrollToTop,
    scrollToBottomIfAtBottom,
  }
}
