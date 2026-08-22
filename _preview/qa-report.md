# 个人主页网站开发与验收报告 (QA Report)

> 日期：2026-08-22  
> 项目根目录：`F:\个人主页\site\`  
> 部署远端：`https://github.com/Jonah-Wu23/jonah-wu23.github.io.git` (main 分支)

---

## 一、用户决策项落实情况 (Q1 – Q9)

| 问题编号 | 决策内容 | 落地状态 | 实现位置 |
|---|---|---|---|
| **Q1 邮箱** | 保留 QQ 邮箱并列放 UCD 邮箱 | 已完成 | Hero 社交入口与 Contact 大字区双邮箱并列：`zonghe.wu@ucdconnect.ie` / `3582584159@qq.com` |
| **Q2 头像** | Hero 不放照片，保持 02 纯字排版 | 已完成 | 巨型黑体单行横排，不错位，排版规整 |
| **Q3 社交平台** | 仅保留 GitHub 与 B 站 | 已完成 | 全站仅提供 GitHub 与 B 站外链，无 LinkedIn/X |
| **Q4 统计** | 不接入第三方分析脚本 | 已完成 | 零外部跟踪代码，纯净静态 |
| **Q5 CV 版本** | 指定通用 PDF 简历 | 已完成 | 复制至 `site/assets/files/CV_ZongheWu.pdf`，提供 Hero 与 Experience 双入口 |
| **Q6 RCMDT** | SMC 2026 已录用但未发表 | 已完成 | 项目卡片仅陈列项目与成果，标注“IEEE SMC 2026 录用 (待发表)”，不挂链接 |
| **Q7 历史去留** | 沿用旧仓库提交历史 | 已完成 | `site/` 完整继承旧仓库 `.git` 提交历史，支持平滑 diff 与回滚 |
| **Q8 电话** | 页脚不保留电话 | 已完成 | 页脚与联系区已完全移除手机号 |
| **Q9 长安风领** | 采用数值仿真平台版简介 | 已完成 | 严格采用“数值仿真平台版”原文介绍与“挑战杯省一等奖”成果 |
| **特殊指令** | Anima Companion 必须链接上 | 已完成 | 严格链接 `https://anima-companion.fun`，附带视频与 GitHub 链接 |

---

## 二、里程碑完成清单 (M1 – M5)

- **M1 文案成稿**：
  - 旧站 4 个核心项目与 4 个开源包简介逐字照抄。
  - 新项目与模块文案严格遵守 `zh-global-guardrails`、`humanizer-zh`、`humanizer`。
  - 无单音节动词砍词，无“不是……而是……”对举，无空洞三段式排比，英文层无 em dash。
  - 文案留档于 `site/_preview/copy-draft.md`。
- **M2 骨架与设计系统**：
  - 继承 02 白纸蓝图设计基因：`--paper: #F4F1EA`、`--ink: #111111`、`--blue: #0B4DA2`、`--blue-light: #1A63D8`。
  - 全局无圆角（`border-radius: 0 !important`）。
  - 模块编号 `(01)`–`(07)`，中英对照同位排版。
  - 本地化 Three.js r158（`assets/vendor/three.min.js`），摆脱网络 CDN 阻塞。
- **M3 粒子引擎物理修复**：
  - 采用帧归一化积分模型，修复 02 原型中 `dt` 二次相乘导致的力衰减。
  - 悬停推力 1.35/帧，扫过时温和让开；快速滑动/点击触发爆破初速 11.5 并伴随 +z 上扬。
  - 弹簧回位系数 0.045，阻尼 0.88，收敛稳定。
  - 连线阈值自适应断开重连。
  - `prefers-reduced-motion: reduce` 静止网格降级。
- **M4 内容填充与静态资源**：
  - 生成 1200×630 蓝图风格 `og.png`。
  - 生成 `favicon.svg`（ZW Monogram）、`sitemap.xml`、`.nojekyll`、`links.txt`。
- **M5 QA 与测试验收**：
  - `check_urls.py` 实测 17 条外链：16 条 200/MAIL 绿灯通过，`anima-companion.fun` 严格保留。
  - Playwright 自动化测试：1440px 桌面端与 375px 移动端零报错渲染。
  - 粒子连续帧截图验证通过（`particle-frame-0/1/2`）。

---

## 三、外链点验明细 (links.txt)

- `https://navigation-buddy.vercel.app` -> 200 OK
- `https://github.com/Jonah-Wu23/navigation-buddy` -> 200 OK
- `https://github.com/Jonah-Wu23/Churn-Aware-GNN-RL` -> 200 OK
- `https://jonah-wu23.github.io/HSR_Partner_Harness/` -> 200 OK
- `https://github.com/Jonah-Wu23/HSR_Partner_Harness` -> 200 OK
- `https://anima-companion.fun` -> 必须保留 (已挂链)
- `https://github.com/Jonah-Wu23/anima-companion` -> 200 OK
- `https://github.com/Jonah-Wu23/dsh-fullstack-pack` -> 200 OK
- `https://github.com/Jonah-Wu23/oh-my-dsh` -> 200 OK
- `https://github.com/Jonah-Wu23/dsh-bg-carousel` -> 200 OK
- `https://github.com/Jonah-Wu23/dsh-web-wrapper` -> 200 OK
- `https://github.com/Jonah-Wu23` -> 200 OK
- `https://space.bilibili.com/328348048` -> 200 OK
- `https://www.bilibili.com/video/BV1YR8L61EYs` -> 200 OK
- `https://www.bilibili.com/video/BV1STfPBgEWV` -> 200 OK
- `mailto:zonghe.wu@ucdconnect.ie` -> MAILTO OK
- `mailto:3582584159@qq.com` -> MAILTO OK
