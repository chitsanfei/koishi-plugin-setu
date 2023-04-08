import {Context, Dict, Schema, h, Logger, Quester, Session } from 'koishi'
import { } from '@koishijs/plugin-rate-limit'

export const name = 'setu'

export interface Config {
  api: string
  maxUsage: number
  proxy: string
  allowR18: boolean
  defaultPicSize: string
  useFigure: boolean
  replyNumber: number
  longPicWarning: boolean
  longPicAddress: string
}

export const Config: Schema<Config> = Schema.object({
  version: Schema.string().default('1.0.4').description('😭 写完才发现原来有其他能用的插件了，我仿佛是小丑，所以摆烂了！'),
  api: Schema.string().role('link').default('https://api.lolicon.app/#/').description('🤔 芝士API地址，改了也没什么用，只是告诉你如果遇到网络问题，先多试几次，然后排查你能不能与这个网站建立链接，你可以在服务器使用ping或ping6'),
  maxUsage: Schema.number().default(10).step(1).description('🔢 单日个人使用次数限制，好像和指令的控制重复了，你可以改成999999'),
  proxy: Schema.string().role('link').description('🔗 指定图片反代地址，自行选择，默认为空'),
  allowR18: Schema.boolean().default(false).description('🚫 是否允许r18，默认是false，请务必不要在限制的平台使用，后果自行承担'),
  defaultPicSize: Schema.union([
    Schema.const('original').description('原图(original, 不推荐)'),
    Schema.const('regular').description('普通(regular)'),
    Schema.const('small').description('小图(small)'),
    Schema.const('thumb').description('极小图(thumb)'),
    Schema.const('mini').description('迷你图(mini, 你认真的？)'),
  ]).description('☔️ 默认图片大小，默认是普通（regular），如果你遇到图片发不出可以降低画质').default('regular'),
  useFigure: Schema.boolean().default(false).description('🫧 使用集合回复，在某些适配器上会出问题，但是能解决部分发不出图的问题'),
  replyNumber: Schema.number().default(1).max(10).min(1).step(1).description('🐛 一次色图请求的回复图片数量，数字从1-10，默认为1，请节制，最好设置指令请求间隔，给你个警告，真别用这个，图容易掉不说，你舍得你的号么:D'),
  longPicWarning: Schema.boolean().default(false).description('😡 将错误信息替换成龙图，愚人节限定，但是你舍得打破这份宁静么'),
  longPicAddress: Schema.string().default('https://raw.githubusercontent.com/ShizukuWorld/koishi-plugin-setu/master/assets/long.jpg').description('🐲 龙图图片地址，仔细想想，好像也没有必要说是替换成龙图，替换成什么图不都行么')
})

export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('setu')
  ctx.i18n.define('zh', require('./locales/zh'))
  ctx.command('setu', { maxUsage: config.maxUsage })
    .option('size', '-s <string>', { fallback: config.defaultPicSize })
    .option('r18', '-r <number>', { fallback : 0 }) //添加一个option，控制是否有r18
    .option('author', '-a <number>')
    .option('excludeAI', '-A', { fallback: true })
    .action(async ({ session, options }) => {
      // 如果 allowR18 的值为 false，将 options.r18 强制设为 0，否则使用 options.r18 选项值
      const r18 = config.allowR18 === false ? 0 : options.r18
      const num = config.replyNumber

      try{
        // 是否使用代理
        if (config.proxy) options['proxy'] = config.proxy

        // 发送POST请求
        const loli = await ctx.http('POST', `https://api.lolicon.app/setu/v2`, {
          data: { ...options, r18, num } // 合并 options 和 r18
        })

        // 测试点，抛出异常
        // throw new Error('哈哈，我异常啦')

        // 请求回应后，发送消息
        if (loli.data[0].pid as number >= 1) {
          await session.send(session.text('.relax'))
          // 如果使用合并回复，执行下面。
          if(config.useFigure == true) {
            const attrs: Dict<any, string> = {
              userId: session.userId,
              nickname: session.author?.nickname || session.username,
            }
            const result = h('figure')
            for (let i = 0; i < loli.data.length; i++){
              result.children.push(h('message', attrs, loli.data[i].pid))
              result.children.push(h('image', { url: loli.data[i].urls[options.size] }))
            }
            // const img = h('image', { url: loli.data[0].urls[options.size] })
            // result.children.push(h('message', attrs, loli.data[0].pid))
            // result.children.push(img)
            return result
          }else{
            // 否则，直接回复图片。
            let reply = ``
            for (let i = 0; i < loli.data.length; i++){
              reply = reply + `<image url="${loli.data[i].urls[options.size]}"/>`
            }
            return reply
          }
        } else {
          return session.text('.error', loli.error || '参数错误或 API 请求错误')
        }
      }catch (error){
        if(config.longPicWarning) {
          return `<image url="${config.longPicAddress}"/>`
        }else if(error.code === 'EHOSTUNREACH'){
          return '与API的交互发生问题，请重试指令或排查服务器网络'
        } else
          return session.text('.error')
      }

    })
}
