import { Context } from "koishi";
import {
  Config as ConfigInterface,
  ConfigSchema,
  isLoliconConfig,
  hasValidConfig,
  validateParameters,
} from "./types/config";
import { SetuService } from "./services";
import { createFigureMessage, createImageMessage } from "./utils";
import { validatePicSize, validateReplyNumber } from "./utils";

export const name = "setu";

export const Config = ConfigSchema;

export function apply(ctx: Context, config: ConfigInterface) {
  const logger = ctx.logger("setu");

  // 加载多语言
  ctx.i18n.define("zh", {
    "commands.setu.description": "发一个瑟图",
    "commands.setu.options.size": "设置图片大小",
    "commands.setu.options.author": "指定作者 uid 的作品",
    "commands.setu.options.excludeAI": "排除 AI 作品",
    "commands.setu.options.r18":
      "检索 R18 作品，必须启用功能才能使用，参数为0或者1",
    "commands.setu.messages.relax": "别急，正在给你找一个瑟图！",
    "commands.setu.messages.error": "加载错误：{0}",
  });

  // 注册指令
  ctx
    .command("setu", "发一个瑟图")
    .option("size", "-s <string>", {
      fallback: isLoliconConfig(config)
        ? config.lolicon.defaultPicSize
        : "regular",
    })
    .option("r18", "-r", {
      fallback: isLoliconConfig(config) ? config.lolicon.allowR18 : false,
    })
    .option("tags", "-t <string>")
    .option("author", "-a <number>")
    .option("excludeAI", "-A", { fallback: true })
    .action(async ({ session, options }) => {
      try {
        // 检查配置是否有效
        if (!hasValidConfig(config)) {
          logger.warn(
            "API 提供商未配置或配置不完整，请在插件设置中选择并配置 API 提供商",
          );
          if (config.humor.longPicWarning) {
            return `<image url="${config.humor.longPicAddress}"/>`;
          }
          return "API 提供商未配置或配置不完整，请在插件设置中选择并配置 API 提供商";
        }

        // 初始化服务
        const setuService = new SetuService(ctx, config);

        // 获取默认图片大小（与 fallback 保持一致）
        const defaultPicSize = isLoliconConfig(config)
          ? config.lolicon.defaultPicSize
          : "regular";

        // 获取 R18 允许状态（与 fallback 保持一致）
        const allowR18 = isLoliconConfig(config)
          ? config.lolicon.allowR18
          : false;

        // 标记用户输入的参数（如果值不等于 fallback，说明是用户输入的）
        const userInput = {
          _tags: options.tags !== undefined, // tags 没有 fallback，所以只要有值就是用户输入
          _author: options.author !== undefined,
          _size: options.size !== defaultPicSize,
          _r18: options.r18 !== allowR18,
          _excludeAI: options.excludeAI !== true,
        };

        // 验证参数支持
        const paramError = validateParameters(config.provider, userInput);
        if (paramError) {
          return paramError;
        }

        // 验证参数
        const size = validatePicSize(options.size)
          ? options.size
          : defaultPicSize;
        const num = validateReplyNumber(config.behavior.replyNumber)
          ? config.behavior.replyNumber
          : 1;
        const r18 = options.r18 === true ? 1 : 0;

        // 处理标签（空格分隔）
        const tags = options.tags ? options.tags.split(" ") : [];

        // 构建查询选项
        const queryOptions = {
          size,
          num,
          r18,
          tags,
          author: options.author,
          excludeAI: options.excludeAI,
        };

        // 发送请求
        const response = await setuService.getSetu(queryOptions);

        // 检查响应
        if (!response.data || response.data.length === 0) {
          if (config.humor.longPicWarning) {
            return `<image url="${config.humor.longPicAddress}"/>`;
          }
          return session.text(".error", [
            response.error || "没有找到符合条件的图片",
          ]);
        }

        // 发送加载提示
        await session.send(session.text(".relax"));

        // 根据配置选择消息格式
        if (config.behavior.useFigure) {
          return createFigureMessage(session, response.data, size);
        } else {
          return createImageMessage(response.data, size);
        }
      } catch (error: any) {
        logger.error("获取色图失败:", error);

        // 错误处理
        if (config.humor.longPicWarning) {
          return `<image url="${config.humor.longPicAddress}"/>`;
        } else if (error.code === "EHOSTUNREACH") {
          return "与 API 的交互发生问题，请重试指令或排查服务器网络";
        } else {
          return session.text(".error", [error.message || "未知错误"]);
        }
      }
    });

  // 记录初始化信息
  logger.info("Setu 插件初始化完成");
}
