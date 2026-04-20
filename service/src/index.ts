// 这是一个功能完整的 ChatGPT API 代理服务器
// 流式响应：实时输出 AI 生成内容

// 身份验证：可选的 API 密钥保护

// 限流保护：防止滥用

// 跨域支持：可供前端直接调用

// 多路由支持：聊天、配置、会话、验证

// 代理支持：可配置正向/反向代理

// 静态文件服务：可直接托管前端页面
import express from 'express' // Web 框架，用于创建 HTTP 服务器
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'

const app = express()
const router = express.Router()

app.use(express.static('public')) // 将 public 目录下的文件（如 HTML、CSS、JS）对外公开访问
app.use(express.json())
// 跨域支持：可供前端直接调用
app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // 允许所有来源访问
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type') // 允许的请求头
  res.header('Access-Control-Allow-Methods', '*') // 允许的请求方法
  next()
})
// 主要路由：聊天处理
router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream') // 设置响应头为流式数据
  try {
    const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})
// 配置路由
router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
