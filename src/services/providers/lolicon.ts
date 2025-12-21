import { ApiProvider, SetuOptions, LoliconResponse } from "../../types/api";
import { Context } from "koishi";

export class LoliconProvider implements ApiProvider {
  public readonly name = "lolicon";

  constructor(
    private apiUrl: string,
    private allowR18: boolean,
    private ctx: Context,
  ) {}

  async getSetu(options: SetuOptions): Promise<LoliconResponse> {
    // 检查 R18 请求是否被允许
    if (options.r18 && options.r18 > 0 && !this.allowR18) {
      return {
        error: "未开启 R18 内容功能，无法获取限制级色图",
        data: [],
      };
    }

    try {
      const response = await this.ctx.http.post(this.apiUrl, {
        r18: options.r18 || 0,
        num: options.num || 1,
        size: options.size || "regular",
        proxy: options.proxy,
        author: options.author,
        excludeAI: options.excludeAI,
      });

      return response;
    } catch (error) {
      throw new Error(
        `HTTP error! ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
