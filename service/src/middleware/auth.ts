import { isNotEmptyString } from '../utils/is'
// 检查环境变量中是否配置了密钥（AUTH_SECRET_KEY）

// 如果配置了，验证请求的 Authorization 头是否正确

// 验证通过则继续处理请求（next()），否则返回 401 错误

// 如果未配置密钥，则跳过验证（允许所有请求）
const auth = async (req, res, next) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  if (isNotEmptyString(AUTH_SECRET_KEY)) {
    try {
      const Authorization = req.header('Authorization')
      if (!Authorization || Authorization.replace('Bearer ', '').trim() !== AUTH_SECRET_KEY.trim())
        throw new Error('Error: 无访问权限 | No access rights')
      next()
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    next()
  }
}

export { auth }
