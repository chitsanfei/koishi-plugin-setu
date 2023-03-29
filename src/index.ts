import {Context, Dict, Schema, h, Logger, Quester, Session } from 'koishi'
import { } from '@koishijs/plugin-rate-limit'

export const name = 'setu'

export interface Config {
  api: string
  maxUsage: number
  proxy: string
  allowR18: boolean
  useFigure: boolean
}

export const Config: Schema<Config> = Schema.object({
  api: Schema.string().role('link').default('https://api.lolicon.app/#/').description('芝士API地址，改了也没什么用，只是告诉你如果遇到网络问题你需要先排查你能不能与这个网站建立链接'),
  maxUsage: Schema.number().default(10).step(1).description('使用次数限制，你可以改成999999'),
  proxy: Schema.string().role('link').description('指定图片反代地址，自行选择，默认为空'),
  allowR18: Schema.boolean().default(false).description('是否允许r18，默认是false，请务必不要在限制的平台使用，后果自行承担'),
  useFigure: Schema.boolean().default(false).description('使用集合回复，在某些适配器上会出问题，但是能解决部分发不出图的问题')
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
      // 如果 allowR18 的值为 false，将 options.r18 强制设为 0，否则使用 options.r18 选项值
      const r18 = config.allowR18 === false ? 0 : options.r18
      // 是否使用代理
      if (config.proxy) options['proxy'] = config.proxy
      const loli = await ctx.http('POST', `https://api.lolicon.app/setu/v2`, {
        data: { ...options, r18 } // 合并 options 和 r18
      })
      // 新建的一个图片消息对象，它好像不应该在这里...
      const img = h('image', { url: loli.data[0].urls[options.size] })
      if (loli.data[0].pid as number >= 1) {
        session.send(session.text('.relax'))
        // 如果使用合并回复，执行下面。
        if(config.useFigure == true) {
          const attrs: Dict<any, string> = {
            userId: session.userId,
            nickname: session.author?.nickname || session.username,
          }
          const result = h('figure')
          result.children.push(h('message', attrs, loli.data[0].pid))
          result.children.push(img)
          return result
        }else{
          // 否则，直接回复图片。
          return `<image url="${loli.data[0].urls[options.size]}"/>`
        }
      } else {
        return session.text('.error', loli.error || '参数错误或 API 请求错误')
      }
    })
}


