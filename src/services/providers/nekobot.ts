import { ApiProvider, SetuOptions, LoliconResponse } from "../../types/api";
import { Context } from "koishi";

export class NekobotProvider implements ApiProvider {
  public readonly name = "nekobot";

  constructor(
    private apiUrl: string,
    private defaultTag: string,
    private ctx: Context,
  ) {}

  async getSetu(options: SetuOptions): Promise<LoliconResponse> {
    // Nekobot API 只支持 -t 参数，支持多标签（空格分隔）
    const tags =
      options.tags && options.tags.length > 0
        ? options.tags.join(" ")
        : this.defaultTag;

    const apiUrl = `${this.apiUrl}?type=${encodeURIComponent(tags)}`;

    try {
      const data = await this.ctx.http.get(apiUrl);

      // Nekobot API 返回的数据结构：{ success: true, message: 'https://...' }
      if (!data.success || !data.message) {
        return {
          error: "获取图片失败：API 返回数据异常",
          data: [],
        };
      }

      return {
        data: [
          {
            pid: 0,
            p: 0,
            uid: 0,
            title: "",
            author: "",
            url: data.message,
            r18: false,
            width: 0,
            height: 0,
            tags: [tags],
            ext: "jpg",
            aiType: 0,
            uploadDate: 0,
            urls: {
              original: data.message,
              regular: data.message,
              small: data.message,
              thumb: data.message,
              mini: data.message,
            },
          },
        ],
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "未知错误",
        data: [],
      };
    }
  }
}
