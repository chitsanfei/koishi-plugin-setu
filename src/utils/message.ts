import { Dict, h, Session } from 'koishi'
import { SetuData } from '../types/api'

export function createFigureMessage(session: Session, setuData: SetuData[], size: string): any {
  const attrs: Dict<any, string> = {
    userId: session.userId,
    nickname: session.author?.nickname || session.username,
  }

  const result = h('figure')

  for (const data of setuData) {
    result.children.push(h('message', attrs, String(data.pid)))
    result.children.push(h('image', { url: data.urls[size] }))
  }

  return result
}

export function createImageMessage(setuData: SetuData[], size: string): string {
  let reply = ''
  for (const data of setuData) {
    reply += `<image url="${data.urls[size]}"/>`
  }
  return reply
}

export function formatSetuInfo(data: SetuData): string {
  return `标题: ${data.title}\n作者: ${data.author}\nPID: ${data.pid}\n标签: ${data.tags.join(', ')}`
}
