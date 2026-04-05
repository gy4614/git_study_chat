// 管理 ChatGPT 的参数配置（systemMessage / temperature / top_p），并存到本地
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'settingsStorage'

export interface SettingsState {
  systemMessage: string
  temperature: number
  top_p: number
}

export function defaultSetting(): SettingsState {
  return {
    // AI 的“系统提示词”
    systemMessage: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.',
    // 控制输出的“发散程度”
    temperature: 0.8,
    // 控制输出的“随机性”
    top_p: 1,
  }
}

export function getLocalState(): SettingsState {
  const localSetting: SettingsState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: SettingsState): void {
  ss.set(LOCAL_NAME, setting)
}

export function removeLocalState() {
  ss.remove(LOCAL_NAME)
}
