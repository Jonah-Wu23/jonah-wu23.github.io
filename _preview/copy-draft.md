# 吴宗河个人主页 · 全站中英文案初稿 (M1)

> 依据：《个人主页网站开发计划.md》第四章与第十一章决策
> 语言红线执行：zh-global-guardrails、humanizer-zh、humanizer

---

## 1. 页面 Meta 与 SEO

- **Title**: 吴宗河 Zonghe Wu · AI Product · Agent · Mobility
- **Meta Description**: 吴宗河（Zonghe Wu）个人主页。AI Product · Agent · Mobility。让空间智能看清前路，让AI伴随读懂人心。
- **Open Graph Title**: 吴宗河 Zonghe Wu · AI Product · Agent · Mobility
- **Open Graph Description**: 让空间智能看清前路，让AI伴随读懂人心。
- **Keywords**: 吴宗河, Jonah Wu, AI Product, Agent, Intelligent Transportation, Mobility Digital Twin, Next.js, Three.js

---

## 2. 顶部导航 (Nav)

- 关于 / About (#about)
- 作品 / Work (#work)
- 经历 / Experience (#experience)
- 技能 / Skills (#skills)
- 现状 / Now (#now)
- 联系 / Contact (#contact)

---

## 3. 首屏 Hero

- **编号标号**: P.01 / 2027
- **方向标签**: AI Product · Intelligent Transportation · Creative Technology
- **中文大名**: 吴宗河
- **英文/拼音对照**: ZONGHE WU / JONAH WU
- **定位句 (照抄旧站)**:
  - 中文：让空间智能看清前路，让AI伴随读懂人心。
  - 英文：Making spatial intelligence clear on the road ahead, making companion AI understand human hearts.
- **身份与坐标**:
  - 中文：2027 届本科 · 长安大学 × 爱尔兰都柏林大学 · 福建厦门
  - 英文：Class of 2027 · Chang'an Univ. × University College Dublin · Xiamen, China
- **行动按钮 (CTA)**:
  - 查看作品 / Work (#work)
  - 下载简历 / CV (assets/files/CV_ZongheWu.pdf)
- **社交入口**:
  - GitHub: https://github.com/Jonah-Wu23
  - B 站: https://space.bilibili.com/328348048
  - 邮箱: mailto:3582584159@qq.com / mailto:zonghe.wu@ucdconnect.ie

---

## 4. 滚动跑马灯 (Marquee)

长安大学 × 都柏林大学 · 2027 届 · 交通 × AI 产品 · 福建厦门 · CHANG'AN UNIV. × UCD · CLASS OF 2027 · AI PRODUCT · XIAMEN ·

---

## 5. 关于我 (About)

- **模块编号与标题**:
  - (01)
  - 中文：在交通与 AI 的交叉口造产品
  - 英文：BUILDING AT THE INTERSECTION OF MOBILITY & AI
- **正文段落**:
  - 中文：
    我是吴宗河，长安大学与爱尔兰都柏林大学双学位本科生（交通运输 / 交通、城市规划与环境政策），2027 届，坐标福建厦门。

    我专注于交通与 AI 产品的交叉领域。在复杂交通系统与生成式智能体之间，把工程算法与真实场景连接起来，转化为能够稳定运行、具备可引导性的交互产品。
  - 英文：
    I am Zonghe Wu, an undergraduate in a dual-degree program at Chang'an University and University College Dublin (Transportation / Transport, City Planning & Environmental Policy), graduating in 2027, based in Xiamen.

    I focus on the intersection of intelligent transportation and AI products. Working between complex mobility systems and generative agents, I turn engineering methods into reliable and steerable products.

---

## 6. 作品与项目 (Work)

### 方向一：AI & Agents (智能体与人机协作)

#### 01 / HSR Partner Harness
- **项目名**: HSR Partner Harness · 角色 × Agent 双轨工作台 / Dual-Track AI Workspace
- **中文简介 (照抄旧站)**: 该项目开发HSR Partner Harness双轨AI工作台，将角色陪伴对话与本地编程Agent整合进同一会话。用户可与角色讨论需求，角色会自主委派任务，由Codex等Agent助手真实操作项目文件，再将结果回传给角色继续协作。
- **英文对照**: A dual-track AI workspace integrating character dialogue with local coding agents in one session. Users discuss tasks with a companion character, which delegates file edits to agents and reviews the results.
- **角色**: 独立设计与开发 / Solo Designer & Developer
- **链接**:
  - 在线体验 / Live Demo: https://jonah-wu23.github.io/HSR_Partner_Harness/
  - 演示视频 / Video: https://www.bilibili.com/video/BV1YR8L61EYs
  - 开源仓库 / GitHub: https://github.com/Jonah-Wu23/HSR_Partner_Harness

#### 02 / Anima Companion
- **项目名**: Anima Companion · 多模态 3D 陪伴网站 / Multimodal 3D Companion
- **中文简介 (照抄旧站)**: 该项目开发二次元情感陪伴助手，融合LLM、语音交互与3D角色技术，支持文字与语音聊天、多角色切换、触摸互动、换装与回忆相册，为用户提供沉浸式、个性化的虚拟角色陪伴体验。
- **英文对照**: An emotional companion assistant combining LLMs, voice interaction, and 3D character rendering. Features voice chat, character switching, touch feedback, and costume options. Built as an MVP in 4 weeks, with 19 paying users.
- **角色**: 产品设计与全栈开发 / Product Lead & Full-Stack Developer
- **链接**:
  - 访问产品 / Website: https://anima-companion.fun
  - 演示视频 / Video: https://www.bilibili.com/video/BV1STfPBgEWV
  - 开源仓库 / GitHub: https://github.com/Jonah-Wu23/anima-companion

#### 03 / dsh 开源生态系列 (DeepSeek Harness Tools)
- **项目名**: dsh 开源系列 / DeepSeek Harness Ecosystem
- **中文简介 (照抄旧站四条)**:
  - dsh-fullstack-pack: DeepSeek Harness 全栈开发整合包：8 个核心 dsh 插件与 Tauri 桌面原生壳，内置便携 Node 运行时，国内镜像一键分发。
  - oh-my-dsh: 固定工具面与会话事件日志管理，提供长程恢复和上下文压缩机制。
  - dsh-bg-carousel: DSH 桌面背景轮播与轻量化视效管理组件。
  - dsh-web-wrapper: DSH Web 桌面分发壳与进程生命周期管理工具。
- **英文对照**: A modular developer toolchain for DeepSeek Harness, including a full-stack pack with 8 plugins and a Tauri desktop wrapper, session recovery managers, and UI components.
- **角色**: 开源作者 / Creator & Maintainer
- **链接**:
  - dsh-fullstack-pack: https://github.com/Jonah-Wu23/dsh-fullstack-pack
  - oh-my-dsh: https://github.com/Jonah-Wu23/oh-my-dsh
  - dsh-bg-carousel: https://github.com/Jonah-Wu23/dsh-bg-carousel
  - dsh-web-wrapper: https://github.com/Jonah-Wu23/dsh-web-wrapper

---

### 方向二：Mobility & Intelligence (智慧交通与算法)

#### 04 / Navigation Buddy
- **项目名**: Navigation Buddy · 导航 Agent 原型 / Steerable Navigation Agent
- **中文简介 (照抄旧站)**: 该项目开发Navigation Buddy智能导航Demo，将用户自然语言偏好解析为可执行的软约束与长期记忆，并据此重排候选路线。系统支持偏好跨场景自动生效、阈值调整与记忆管理，让导航从“最快最短”走向“更懂用户”。
- **英文对照**: A navigation agent demo that translates natural-language preferences into executable constraints and memory, reranking candidate routes beyond simple shortest-path heuristics.
- **角色**: 核心算法与前端开发 / Algorithm & Frontend Developer
- **链接**:
  - 在线体验 / Live Demo: https://navigation-buddy.vercel.app
  - 开源仓库 / GitHub: https://github.com/Jonah-Wu23/navigation-buddy

#### 05 / 留乘智行 (Churn-Aware DRT)
- **项目名**: 留乘智行 · 需求响应公交调度系统 / Demand-Responsive Transit System
- **中文简介 (照抄旧站)**: 该项目提出面向需求响应公交的智能调度系统，融合乘客流失感知、尾部风险控制与空间公平机制，结合图强化学习实现动态路径优化与运力分配。系统提升公交服务效率，降低小汽车出行需求，为城市绿色交通提供技术方案。
- **英文对照**: An intelligent DRT dispatching platform using GNN and reinforcement learning. Incorporates passenger churn modeling and tail-risk control, reaching a 70.68% steady service rate.
- **角色**: 研究设计与评估负责 / Research Design & Evaluation Lead
- **链接**:
  - 开源仓库 / GitHub: https://github.com/Jonah-Wu23/Churn-Aware-GNN-RL

#### 06 / RCMDT
- **项目名**: RCMDT · 公交走廊数字孪生鲁棒校准 / Bus Corridor Digital Twin Calibration
- **中文简介 (4.3 原文)**: 该项目提出RCMDT公交走廊数字孪生鲁棒校准框架，通过观测语义审计、贝叶斯优化与IES同化，识别非交通“幽灵拥堵”，提升仿真与真实运行数据的一致性，为公交运行分析与数字孪生可信应用提供支持。
- **英文对照**: A robust calibration framework for bus corridor digital twins, combining semantic auditing, Bayesian optimization, and iterative ensemble smoothing to eliminate ghost congestion.
- **角色**: 第一作者 · 研究设计与验证 / First Author, Design & Validation
- **状态**: IEEE SMC 2026 录用 (Accepted) · 暂无论文公开链接

---

### 方向三：Research & Experiments (科研与工程实践)

#### 07 / 长安风领 (数值仿真平台版)
- **项目名**: 长安风领 · 数值仿真平台 / WindVanguard CFD Simulation Platform
- **中文简介 (4.3 原文)**: 该项目提出“长安风领（WindVanguard）”数值仿真平台，基于国产开源CFD软件“风雷”与自研代理模型，融合风洞实验数据驱动的LES参数反演技术，实现高可信度桥梁风场模拟与优化。同时开发轻量化交互系统，兼顾工程应用与流体力学科普教学。
- **英文对照**: An AI-powered CFD simulation platform for bridge wind hazard assessment. Integrates surrogate models with wind-tunnel calibration, reducing evaluation cycles from 4 weeks to 2 days.
- **角色**: 主开发者 / Principal Developer
- **荣誉**: 第十三届“挑战杯”大学生创业计划竞赛 陕西省金奖

#### 08 / PaveFormer
- **项目名**: PaveFormer · 智能路面性能预测模型 / Pavement Performance Forecasting
- **中文简介 (4.3 原文)**: 该项目提出PaveFormer智能路面性能预测模型，利用轻量化Transformer与相关性感知动态通道处理技术，融合路面多源监测数据，实现路面病害演化趋势预测。模型兼顾预测精度与物理一致性，为道路养护决策提供稳定可靠的数据支持。
- **英文对照**: A Transformer-based pavement deterioration prediction model using correlation-aware dynamic channels and physical monotonicity constraints.
- **角色**: 第二作者 · 方法设计与评测 / Second Author, Method & Evaluation
- **状态**: WTC 2026 录用发表 (Published)

#### 09 / 全生命周期生态路面系统
- **项目名**: 全生命周期生态路面系统 / Lifecycle Eco-Pavement System
- **中文简介 (4.3 原文)**: 该项目提出“全生命周期生态路面系统”，通过废旧轮胎、废油等城市废弃资源制备低碳路面材料，结合零碳施工与智能养护技术，打造绿色、耐久、智能化道路基础设施。项目实现道路减碳、资源循环利用及环境净化，推动交通领域向零碳可持续发展转型。
- **英文对照**: A green road engineering initiative using recycled urban waste materials and intelligent maintenance to reduce infrastructure carbon emissions.
- **角色**: 核心团队成员 / Core Team Member

#### 10 / 白厄一周年线下企划
- **项目名**: 白厄一周年线下企划 / Public Display Coordination
- **中文简介 (M1 新写)**: 该项目为个人统筹策划的线下数字大屏联动展示，完成 24 家商场户外大屏的商务对接、素材规格适配与播出监播，所有屏幕均按期顺利落地。
- **英文对照**: An independent promotional project coordinating outdoor digital displays across 24 shopping centers, managing technical delivery and scheduling.
- **角色**: 独立统筹与执行 / Solo Project Coordinator

---

## 7. 经历 (Experience)

- **模块编号与标题**: (03) 经历 / EXPERIENCE
- **教育背景 / Education**:
  - 长安大学 × 爱尔兰都柏林大学（4+0 双学位） / Chang'an University × University College Dublin (Joint Programme)
    - 2023.09 – 2027.06（预计毕业） / 2023.09 – 2027.06 (Expected)
    - 工学学士（交通运输）/ 理学学士（交通、城市规划与环境政策） / B.Eng. in Transportation / B.Sc. in Transport, City Planning & Environmental Policy
- **实习经历 / Internships**:
  - 厦门路桥工程设计院有限公司（原厦门市惟成市政工程设计院） / Xiamen Weicheng Municipal Engineering Design Institute
    - 2026.01 – 2026.02 · 交通规划与智能仿真实习生 / Transportation Planning & Simulation Intern
    - 搭建 SUMO 复杂交叉口微观仿真，通过交通语义过滤异常样本并优化配时，平均延误降低 10.7%。 / Built SUMO intersection models, removed anomalous samples via semantic filtering, and reduced delays.
  - 天度（厦门）科技股份有限公司 / Tiandu (Xiamen) Technology Co., Ltd.
    - 2025.07 – 2025.08 · 虚拟仿真与 AI 研发实习生 / Virtual Simulation & AI R&D Intern
    - 负责 AI 虚拟仿真教学平台的前端交互界面开发与功能测试。 / Developed and tested front-end interfaces for an AI simulation platform.
  - 龙海泰尔福德汽车电子研发有限公司 / Longhai Telford Automotive Electronics R&D Co., Ltd.
    - 2025.01 – 2025.02 · 汽车智能算法研发实习生 / Automotive Algorithm R&D Intern
    - 参与整车控制仿真模型测试数据处理与可视化，协助算法联调。 / Processed simulation test data and assisted in vehicle algorithm debugging.

---

## 8. 专业技能 (Skills)

- **模块编号与标题**: (04) 技能 / SKILLS
- Product / 产品能力: 需求分析 / User Research · 原型设计 / Wireframing · Agent 交互设计 / Agent UX · 需求规格化 / PRD
- AI & Algorithms / 算法: 图强化学习 / GNN+RL · 物理约束网络 / PINN · 贝叶斯优化 / Bayesian Opt · LLM Prompt / Tool Use
- Engineering / 工程开发: Python · FastAPI · Next.js / React · Three.js · PyQt5 · Git
- Domain / 交通领域: SUMO 交通仿真 · Synchro 信号配时 · 交通建模 / Modeling · 数字孪生 / Digital Twin
- Tools / 工具栈: VS Code / Codex · Figma · OR-Tools · PyTorch

---

## 9. 荣誉与亮点 (Highlights)

- **模块编号与标题**: (05) 荣誉亮点 / HIGHLIGHTS
- IEEE SMC 2026 录用论文（第一作者） / IEEE SMC 2026 Accepted Paper (First Author)
- 第十三届“挑战杯”大学生创业计划竞赛 陕西省金奖 / Challenge Cup Competition Shaanxi Gold Award (First Prize)
- 全国大学生交通运输科技大赛 陕西赛区一等奖 / 三等奖 / National Transport Science & Tech Competition Shaanxi Prizes
- Anima Companion 独立开发上线 4 周，19 名陌生用户付费 / Anima Companion: solo-built MVP, 19 paying users

---

## 10. 现状 (Now)

- **模块编号与标题**: (06) 现状 / NOW
- **中文**: 2026 年秋：正在申请港新方向硕士研究生，同时持续打磨导航智能体与交通 AI 工具。
- **英文**: Fall 2026: applying to master's programs in Hong Kong and Singapore while refining navigation agents and mobility AI tools.

---

## 11. 联系与页脚 (Contact & Footer)

- **模块编号与标题**: (07) 联系 / CONTACT
- **中文导语**: 欢迎交流 AI 产品、交通智能体与创造性技术。
- **英文导语**: Open to discussions on AI products, mobility agents, and creative technology.
- **邮箱大字**:
  - 3582584159@qq.com (mailto:3582584159@qq.com)
  - zonghe.wu@ucdconnect.ie (mailto:zonghe.wu@ucdconnect.ie)
- **社交入口**:
  - GitHub: https://github.com/Jonah-Wu23
  - B 站: https://space.bilibili.com/328348048
- **页脚 Footer**:
  - © 2026 吴宗河 Zonghe Wu · 厦门 / Xiamen, China
  - 最后更新 / Last updated: 2026-08-22