// 限制每个 IP 地址每小时的最大请求次数

// 可通过环境变量 MAX_REQUEST_PER_HOUR 配置

// 超过限制时返回友好的错误信息

// 默认不限制（设置为 0）


import { rateLimit } from 'express-rate-limit'
import { isNotEmptyString } from '../utils/is'

const MAX_REQUEST_PER_HOUR = process.env.MAX_REQUEST_PER_HOUR

const maxCount = (isNotEmptyString(MAX_REQUEST_PER_HOUR) && !isNaN(Number(MAX_REQUEST_PER_HOUR)))
  ? parseInt(MAX_REQUEST_PER_HOUR)
  : 0 // 0 means unlimited
// 创建限流器
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // Maximum number of accesses within an hour
  max: maxCount,
  statusCode: 200, // 200 means success，but the message is 'Too many request from this IP in 1 hour'
  message: async (req, res) => {
    res.send({ status: 'Fail', message: 'Too many request from this IP in 1 hour', data: null })
  },
})

export { limiter }
