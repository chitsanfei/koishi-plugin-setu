import { ApiProvider, SetuOptions, LoliconResponse } from '../../types/api'

export class CustomProvider implements ApiProvider {
  public readonly name = 'custom'

  constructor(private apiUrl: string) {}

  async getSetu(options: SetuOptions): Promise<LoliconResponse> {
    // 自定义 API 的实现
    // 这里需要根据具体的自定义 API 规范来实现
    // 目前只是一个占位实现
    throw new Error('自定义 API 尚未实现')
  }
}
