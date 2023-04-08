<!-- 一个一个一个基于前人开发的色图插件。 -->

<!-- markdownlint-disable -->
<div align="center">
    <hr>
    <img src="https://raw.githubusercontent.com/ShizukuWorld/koishi-plugin-setu/master/assets/koimu.png" height="200" alt="@emuotori/koishi-plugin-setu">
    <h1>@emuotori/koishi-plugin-setu</h1>
    <b>A simple setu program powered by Koishi. 一个一个一个简易的色图插件。</b>
</div>
<!-- markdownlint-restore -->

---

[![Github Issue](https://img.shields.io/github/issues/ShizukuWorld/koishi-plugin-setu)](https://github.com/ShizukuWorld/koishi-plugin-setu/issues)
[![Github Forks](https://img.shields.io/github/forks/ShizukuWorld/koishi-plugin-setu)](https://github.com/ShizukuWorld/koishi-plugin-setu/fork)
[![Github Stars](https://img.shields.io/github/stars/ShizukuWorld/koishi-plugin-setu)](https://github.com/ShizukuWorld/koishi-plugin-setu)
[![GitHub License](https://img.shields.io/github/license/ShizukuWorld/koishi-plugin-setu)](https://github.com/ShizukuWorld/koishi-plugin-setu/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/@emuotori/koishi-plugin-setu?style=flat-square)](https://www.npmjs.com/package/@emuotori/koishi-plugin-setu)

---

![Alt](https://repobeats.axiom.co/api/embed/5862d722880c186b852fa0c7a6c26891efe50b35.svg "Repobeats analytics image")

---

## 介绍

- 就是一个很普通的色图插件呀！
- 加了一点功能，但是保留了生草的代码设计，我故意的，这样你才知道我是nooooob。
- 一切后果自负嗷，别在不允许用的地方用。
- 这个ICON是koimu，是的，我使用了PS（
- 已弃坑，PR随意！

## 指令
<!-- markdownlint-disable -->
|    指令     |    功能    |
|:---------:|:--------:|
|   setu    |   获取色图   |
| help setu |  查看帮助菜单  |

| 参数 |   允许值    |                                             说明                                             |
|:--:|:--------:|:------------------------------------------------------------------------------------------:|
| -r |   1,0    |                                     获取限制色图(1为获取，默认值为0)                                     |
| -s |  string  | 获取图片的大小，在未指定的时候会沿用config中的设置。<br/>后跟随字符串，允许的值有`original`,`regular` ,`small`,`thumb`,`mini` |
| -a | int(UID) |                                搜索特定作者的作品，后跟数字，为作者Pixiv的UID                                 |
| -A |    -     |                                       不需要跟随值，排除AI作品                                        |
<!-- markdownlint-restore -->

## 参考

- 基于 [koishi-plugin-setu](https://github.com/Lipraty/koishi-plugin-setu) 开发。
- 想要使用？机器人项目`Koishi`地址：[官网](https://koishi.chat/)、[开源地址](https://github.com/koishijs/koishi)。

## 注意

- 在某些情况下，你必须确保你的服务器支持ipv6连接（即你的服务器具有公网ipv6地址），否则与lolicon api的通讯无法建立。请详见[#3](https://github.com/ShizukuWorld/koishi-plugin-setu/issues/3)。遇到这种问题请您在本地环境下测试是否是网络问题，该问题暂不会被解决。
- 在某些平台下，发送限制色图会被AI识别并立即进入风控，你所获取的图片全部来自解析而未经处理。可行的解决方案包括更换平台，引入噪点或使用引用。最好情况下请不要使用允许限制色图。

## 许可

保持Koishi开发许可证平行，`shizukuworld/koishi-plugin-setu`和npm`@emuotori/koishi-plugin-setu`采用`MIT`许可证进行开源

```text
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

此外，由于本插件具有风险功能，使用本插件的功能，即表明一切后果由用户承担，本库仅展示技术实现。请务必不要在具有限制的平台（QQ，Kook，等）启用限制功能，您极有可能会违背当地法律。

## 感谢

感谢Koishi项目组和Lipraty的开源项目。
