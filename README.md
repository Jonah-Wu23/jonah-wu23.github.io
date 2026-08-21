# 吴宗河个人主页 (Zonghe Wu's Homepage)

> **AI Product · Agent · Mobility** —— 展示导航 Agent 原型、真实路网决策系统与开源作品的极简静态单页。

---

## 🛠️ 技术特性

- **纯静态架构**：手写 HTML5 + CSS3 + 原生 JavaScript，零框架、零外部构建依赖，秒开即用。
- **设计系统**：基于 Neutral Modern 骨架与 Arc Browser 视觉风格（暖白底 `#F4F2ED`、深墨字 `#17150F`、`#FF7A45` ➔ `#F53D6B` ➔ `#7B5CFF` 活力渐变）。
- **动效体验**：集成 Antigravity 原生 Canvas 粒子悬浮力场与丝滑弹簧交互。

---

## 💻 本地预览

在项目根目录下启动静态 HTTP 服务器：

```bash
# 启动本地服务
python -m http.server 8000
```

打开浏览器访问 [http://localhost:8000](http://localhost:8000) 即可进行本地预览与自验。

---

## 🚀 部署说明

本仓库即为 **GitHub Pages** 的部署源：

1. 托管仓库：`Jonah-Wu23/jonah-wu23.github.io`
2. 分支设置：`main` 分支根目录（`/`）
3. 部署机制：将代码推送至 `main` 分支即触发 GitHub Pages 自动部署上线
4. 线上访问地址：[https://jonah-wu23.github.io](https://jonah-wu23.github.io)

---

## 📁 目录结构

```text
site/
├── index.html              # 页面骨架与结构
├── assets/
│   ├── css/
│   │   ├── tokens.css      # 设计令牌与 CSS 变量
│   │   └── main.css        # 页面样式与响应式布局
│   └── js/
│       ├── particles.js    # 悬浮粒子动画引擎
│       └── main.js         # 交互逻辑与动效触发
├── favicon.svg             # 矢量品牌 Monogram 图标
├── og.png                  # 社交分享预览图 (1200×630)
├── links.txt               # 外链清单 (供 QA 点验)
├── .nojekyll               # 绕过 GitHub Pages Jekyll 处理
├── .gitignore              # Git 忽略配置
└── README.md               # 项目说明与维护文档
```

---

## 📬 联系方式

- **GitHub**：[https://github.com/Jonah-Wu23](https://github.com/Jonah-Wu23)
- **Bilibili**：[https://space.bilibili.com/328348048](https://space.bilibili.com/328348048)
- **Email**：[3582584159@qq.com](mailto:3582584159@qq.com)
