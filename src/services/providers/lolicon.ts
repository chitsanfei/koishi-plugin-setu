import { ApiProvider, SetuOptions, LoliconResponse } from "../../types/api";

export class LoliconProvider implements ApiProvider {
  public readonly name = "lolicon";

  constructor(
    private apiUrl: string,
    private allowR18: boolean,
  ) {}

  async getSetu(options: SetuOptions): Promise<LoliconResponse> {
    // 检查 R18 请求是否被允许
    if (options.r18 && options.r18 > 0 && !this.allowR18) {
      return {
        error: "未开启 R18 内容功能，无法获取限制级色图",
        data: [],
      };
    }

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        r18: options.r18 || 0,
        num: options.num || 1,
        size: options.size || "regular",
        proxy: options.proxy,
        author: options.author,
        excludeAI: options.excludeAI,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}
