import { Context, Schema } from 'koishi'
import { } from '@koishijs/plugin-rate-limit'

export const name = 'setu'

export interface Config {
  allowR18: number;
  maxUsage: number
  proxy: string
}

export const Config: Schema<Config> = Schema.object({
  maxUsage: Schema.number().default(10).step(1).description('使用次数限制，你可以改成999999'),
  proxy: Schema.string().role('link').description('指定图片反代地址，自行选择，默认为空'),
  // 生成allowR18的配置项，类型为number，描述为是否允许r18，默认不允许
  allowR18: Schema.number().default(0).description('是否允许r18，偷懒改成number了，1是允许，0是不允许，默认为0，不要改其他的数字'),
})

export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('setu')
  ctx.i18n.define('zh', require('./locales/zh'))
  ctx.command('setu', { maxUsage: config.maxUsage })
    .option('size', '-s <string>', { fallback: 'original' })
    .option('r18', '-r <number>', { fallback : '0'}) //添加一个option，控制是否有r18
    .option('author', '-a <number>')
    .option('excludeAI', '-A', { fallback: true })
    .action(async ({ session, options }) => {
      // 如果 allowR18 的值为 0，将 options.r18 强制设为 0，否则使用 options.r18 选项值
      const r18 = config.allowR18 === 0 ? 0 : options.r18
      if (config.proxy) options['proxy'] = config.proxy
      const loli = await ctx.http('POST', `https://api.lolicon.app/setu/v2`, {
        data: { ...options, r18 } // 合并 options 和 r18
      })
      if (loli.data[0].pid as number >= 1) {
        session.send(session.text('.relax'))
        return `<image url="${loli.data[0].urls[options.size]}"/>`
      } else {
        return session.text('.error', loli.error || '参数错误或 API 请求错误')
      }
    })
}




