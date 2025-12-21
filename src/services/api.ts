import { Context } from "koishi";
import {
  Config,
  isLoliconConfig,
  isCustomConfig,
  isNekobotConfig,
} from "../types/config";
import { SetuOptions, LoliconResponse } from "../types/api";
import { ApiProvider } from "../types/api";
import { LoliconProvider } from "./providers/lolicon";
import { CustomProvider } from "./providers/custom";
import { NekobotProvider } from "./providers/nekobot";

export class SetuService {
  private provider: ApiProvider;

  constructor(
    private ctx: Context,
    private config: Config,
  ) {
    this.provider = this.createProvider(this.config);
  }

  private createProvider(config: Config): ApiProvider {
    if (isLoliconConfig(config)) {
      return new LoliconProvider(
        config.lolicon.apiUrl,
        config.lolicon.allowR18,
        this.ctx,
      );
    } else if (isCustomConfig(config)) {
      return new CustomProvider(config.custom.apiUrl);
    } else if (isNekobotConfig(config)) {
      return new NekobotProvider(
        config.nekobot.apiUrl,
        config.nekobot.defaultTag,
        this.ctx,
      );
    } else {
      throw new Error("未选择 API 提供商");
    }
  }

  async getSetu(options: SetuOptions): Promise<LoliconResponse> {
    try {
      return await this.provider.getSetu(options);
    } catch (error) {
      const logger = this.ctx.logger("setu");
      logger.error(`获取色图失败:`, error);
      throw error;
    }
  }

  getProviderName(): string {
    return this.provider.name;
  }
}
