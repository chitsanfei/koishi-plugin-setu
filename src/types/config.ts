import { Schema } from 'koishi'

export type ApiProviderType = 'lolicon' | 'custom' | 'nekobot'

export interface Config {
  // API 提供商
  provider: 'lolicon' | 'custom' | 'nekobot'

  // 通用参数
  common: {
    maxUsage: number
  }

  // Lolicon 专用参数
  lolicon: {
    allowR18: boolean
    apiUrl: string
    defaultPicSize: 'original' | 'regular' | 'small' | 'thumb' | 'mini'
  }

  // 自定义 API 参数
  custom: {
    apiUrl: string
  }

  // Nekobot 专用参数
  nekobot: {
    apiUrl: string
    defaultTag: string
    notice: string
  }

  // 机器人行为配置
  behavior: {
    useFigure: boolean
    replyNumber: number
  }

  // 幽默配置
  humor: {
    longPicWarning: boolean
    longPicAddress: string
  }
}

export interface CommandOptions {
  maxUsage?: number
}

export function isLoliconConfig(config: Config): config is Config & {
  provider: 'lolicon'
  lolicon: {
    allowR18: boolean
    apiUrl: string
    defaultPicSize: 'original' | 'regular' | 'small' | 'thumb' | 'mini'
  }
} {
  return config.provider === 'lolicon'
}

export function isCustomConfig(config: Config): config is Config & {
  provider: 'custom'
  custom: {
    apiUrl: string
  }
} {
  return config.provider === 'custom'
}

export function isNekobotConfig(config: Config): config is Config & {
  provider: 'nekobot'
  nekobot: {
    apiUrl: string
    defaultTag: string
    notice: string
  }
} {
  return config.provider === 'nekobot'
}

export function hasValidConfig(config: Config): boolean {
  if (config.provider === 'lolicon') {
    return !!config.lolicon?.apiUrl
  } else if (config.provider === 'custom') {
    return !!config.custom?.apiUrl
  } else if (config.provider === 'nekobot') {
    return !!config.nekobot?.apiUrl
  }
  return false
}

// 定义每个 API 支持的参数
export const APIParameterSupport = {
  lolicon: {
    name: 'Lolicon API',
    supportedParams: ['size', 'r18', 'num', 'author', 'excludeAI']
  },
  nekobot: {
    name: 'Nekobot API',
    supportedParams: ['tags']
  },
  custom: {
    name: '自定义 API',
    supportedParams: [] // 自定义 API 由用户自己决定
  }
}

export function validateParameters(provider: string, options: any): string | null {
  // 自定义 API 禁用所有参数
  if (provider === 'custom') {
    const unsupportedParams: string[] = []
    if (options._tags) unsupportedParams.push('-t/--tags')
    if (options._author) unsupportedParams.push('-a/--author')
    if (options._excludeAI) unsupportedParams.push('-A/--excludeAI')
    if (options._size) unsupportedParams.push('-s/--size')
    if (options._r18) unsupportedParams.push('-r/--r18')

    if (unsupportedParams.length > 0) {
      return `（自定义 API）该接口不支持任何参数，请勿使用：${unsupportedParams.join(', ')}`
    }
    return null
  }

  const support = APIParameterSupport[provider as keyof typeof APIParameterSupport]
  if (!support) return null

  const unsupportedParams: string[] = []

  // 检查所有选项参数（只有明确输入的参数才验证，前缀_表示用户输入）
  if (options._tags && provider !== 'nekobot') {
    unsupportedParams.push('-t/--tags')
  }
  if (options._author && provider === 'nekobot') {
    unsupportedParams.push('-a/--author')
  }
  if (options._excludeAI && provider === 'nekobot') {
    unsupportedParams.push('-A/--excludeAI')
  }
  if (options._size && provider === 'nekobot') {
    unsupportedParams.push('-s/--size')
  }
  if (options._r18 && provider === 'nekobot') {
    unsupportedParams.push('-r/--r18')
  }

  if (unsupportedParams.length > 0) {
    return `（${support.name}）该接口不支持的参数：${unsupportedParams.join(', ')}`
  }

  return null
}

// 完整配置 Schema
export const ConfigSchema = Schema.object({
  // 基础设置
  provider: Schema.union([
    Schema.const('lolicon').description('Lolicon API'),
    Schema.const('nekobot').description('Nekobot API'),
    Schema.const('custom').description('自定义 API')
  ]).default('lolicon').description('API 提供商'),

  // 通用参数
  common: Schema.object({
    maxUsage: Schema.number().default(10).step(1).description('单日个人使用次数限制')
  }).description('通用参数'),

  // Lolicon 专用参数
  lolicon: Schema.object({
    allowR18: Schema.boolean().default(false).description('是否允许 R18 内容（请谨慎使用）'),
    apiUrl: Schema.string().role('link').default('https://api.lolicon.app/setu/v2').description('API 地址'),
    defaultPicSize: Schema.union([
      Schema.const('original').description('原图（不推荐）'),
      Schema.const('regular').description('普通'),
      Schema.const('small').description('小图'),
      Schema.const('thumb').description('极小图'),
      Schema.const('mini').description('迷你图')
    ]).description('默认图片大小').default('regular')
  }).description('Lolicon 参数'),

  // Nekobot 专用参数
  nekobot: Schema.object({
    apiUrl: Schema.string().role('link').default('https://nekobot.xyz/api/image').description('API 地址'),
    defaultTag: Schema.string().default('neko').description('默认标签（如果没有指定 -t 参数）'),
    notice: Schema.string().default('').description('⚠️ 警告：本接口没有对限制级色图进行限制，用户可能会请求到限制级色图')
  }).description('Nekobot 参数'),

  // 自定义 API 参数
  custom: Schema.object({
    apiUrl: Schema.string().role('link').default('').description('自定义 API 地址')
  }).description('自定义 API 参数'),

  // 机器人行为
  behavior: Schema.object({
    useFigure: Schema.boolean().default(false).description('使用集合回复（解决部分平台发图问题）'),
    replyNumber: Schema.number().default(1).max(10).min(1).step(1).description('一次请求的图片数量（1-10）')
  }).description('机器人行为'),

  // 幽默
  humor: Schema.object({
    longPicWarning: Schema.boolean().default(false).description('启用错误提示龙图'),
    longPicAddress: Schema.string().default('https://raw.githubusercontent.com/chitsanfei/koishi-plugin-setu/master/assets/long.jpg').description('龙图图片地址')
  }).description('幽默')
})






