<div align="center">
  <img src="https://raw.githubusercontent.com/chitsanfei/koishi-plugin-setu/master/assets/koimu.png" height="200" alt="koishi-plugin-setu">
  <h1>koishi-plugin-setu</h1>
  <b>一个支持多 API 提供商的色图插件，基于 Koishi 框架开发</b>
</div>

---

[![npm version](https://img.shields.io/npm/v/@nenekusanagi/koishi-plugin-setu.svg)](https://www.npmjs.com/package/@nenekusanagi/koishi-plugin-setu)
[![GitHub stars](https://img.shields.io/github/stars/chitsanfei/koishi-plugin-setu)](https://github.com/chitsanfei/koishi-plugin-setu/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/chitsanfei/koishi-plugin-setu)](https://github.com/chitsanfei/koishi-plugin-setu/issues)
[![GitHub forks](https://img.shields.io/github/forks/chitsanfei/koishi-plugin-setu)](https://github.com/chitsanfei/koishi-plugin-setu/network)
[![GitHub license](https://img.shields.io/github/license/chitsanfei/koishi-plugin-setu)](https://github.com/chitsanfei/koishi-plugin-setu/blob/master/LICENSE)

---

## ✨ 功能特性

- 🎯 支持多种 API 提供商（Lolicon API、Nekobot API、自定义 API）
- 🔍 灵活的参数筛选（大小、作者、标签、AI 作品排除等）
- 🛡️ 完善的参数验证和错误处理机制
- 🤖 支持 R18 内容控制
- 📊 智能参数适配（不同 API 自动使用对应支持的参数）
- 🎨 可配置的消息格式（集合回复或直接发送）
- 🖼️ 龙图提示
- 🏷️ 多标签搜索支持（Nekobot API）
- ⚡ 现代化的 TypeScript 架构设计

## 📦 安装

### 通过 npm 安装

```bash
npm install @nenekusanagi/koishi-plugin-setu
```

### 通过 Koishi 插件市场

在 Koishi 控制台的「插件市场」中搜索 `setu` 并安装。

## ⚙️ 配置说明

### API 提供商配置

在插件设置中选择并配置 API 提供商：

#### 1. Lolicon API（默认）

- **API 地址**：默认 `https://api.lolicon.app/setu/v2`
- **默认图片大小**：regular（可选择 original、regular、small、thumb、mini）
- **R18 控制**：可开启/关闭限制级内容（开启后使用 `-r` 参数有效）

#### 2. Nekobot API

- **API 地址**：默认 `https://nekobot.xyz/api/image`
- **默认标签**：neko（无 `-t` 参数时使用）
- **⚠️ 警告**：本接口没有对限制级色图进行限制，用户可能会请求到限制级色图

#### 3. 自定义 API

- **API 地址**：用户自定义
- **参数支持**：禁用所有命令参数（由用户自行决定 API 格式）

### 其他配置

- **通用参数**：
  - 单日个人使用次数限制（默认 10 次）

- **机器人行为**：
  - 使用集合回复（解决部分平台发图问题）
  - 一次请求的图片数量（1-10，默认 1）

- **幽默**：
  - 启用错误提示龙图
  - 龙图图片地址（默认 GitHub 托管）

## 🎮 使用方法

### 基础指令

```
setu                    # 获取随机色图
help setu              # 查看帮助菜单
```

### 可用参数

|    参数     | 适用 API |               说明                |        示例         |
| :---------: | :------: | :-------------------------------: | :-----------------: |
| `-s <size>` | Lolicon  |           设置图片大小            |   `setu -s small`   |
|    `-r`     | Lolicon  | 获取限制级色图（需开启 R18 功能） |      `setu -r`      |
| `-t <tags>` | Nekobot  | 指定标签（支持多标签，空格分隔）  | `setu -t neko anal` |
| `-a <uid>`  | Lolicon  |        指定作者 UID 的作品        |  `setu -a 123456`   |
|    `-A`     | Lolicon  |           排除 AI 作品            |      `setu -A`      |

### 使用示例

```bash
# 获取普通色图
setu

# 获取小图
setu -s small

# 获取限制级色图（需在配置中开启 R18）
setu -r

# 获取特定作者的作品
setu -a 123456

# 排除 AI 作品
setu -A

# 使用 Nekobot API 获取 neko 标签图片
setu -t neko

# 使用多个标签（Nekobot API）
setu -t neko anal
```

## 📋 API 参数支持矩阵

|       参数       | Lolicon API | Nekobot API | 自定义 API |
| :--------------: | :---------: | :---------: | :--------: |
|   `-s/--size`    |     ✅      |     ❌      |     ❌     |
|    `-r/--r18`    |     ✅      |     ❌      |     ❌     |
|   `-t/--tags`    |     ❌      |     ✅      |     ❌     |
|  `-a/--author`   |     ✅      |     ❌      |     ❌     |
| `-A/--excludeAI` |     ✅      |     ❌      |     ❌     |

## ⚠️ 重要提示

### 网络要求

- 确保服务器支持 IPv6 连接（与 Lolicon API 通信需要）
- 网络不稳定时可能需要多次尝试

### 使用限制

- **请在合法合规的环境下使用本插件**
- **不要在不支持的平台（如 QQ、Kook 等）启用限制级功能**
- **使用 R18 功能前请确保符合当地法律法规**
- **一切后果由用户自行承担，本插件仅展示技术实现**

### 平台兼容性

- 部分平台可能对图片发送有限制，建议启用「使用集合回复」功能
- 发送限制级内容可能被平台 AI 识别并风控

## 🔧 开发信息

### 项目结构

```
src/
├── types/          # 类型定义
│   ├── config.ts   # 配置类型
│   └── api.ts      # API 类型
├── services/       # 服务层
│   ├── api.ts      # 主服务
│   └── providers/  # API 提供商
│       ├── lolicon.ts
│       ├── nekobot.ts
│       └── custom.ts
├── utils/          # 工具函数
└── index.ts        # 插件入口
```

### 技术栈

- **框架**：Koishi v4
- **语言**：TypeScript
- **架构**：模块化设计，支持多 API 提供商

## 📚 参考资料

- [Koishi 官网](https://koishi.chat/)
- [Koishi GitHub](https://github.com/koishijs/koishi)
- [Lolicon API 文档](https://api.lolicon.app/#/setu)
- [Nekobot API 文档](https://nekobot.xyz/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目基于 [MIT](https://github.com/chitsanfei/koishi-plugin-setu/blob/master/LICENSE) 许可证开源。

```
MIT License

Copyright (c) 2024 koishi-plugin-setu Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 致谢

- 感谢 [Koishi](https://github.com/koishijs/koishi) 团队提供的优秀框架
- 感谢前人 [Lipraty](https://github.com/Lipraty) 的开源项目
- 感谢所有使用和贡献本项目的开发者们

---

<div align="center">
  <b>⭐ 如果这个项目对你有帮助，请给它一个星标！ ⭐</b>
</div>
