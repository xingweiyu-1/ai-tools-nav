---
name: YYLO
category: 智能体
description: 命令行编码智能体编排器：统一调度多个编码 agent、可重复工作流与带回执的仓库变更。
icon: 🎼
website: https://github.com/yylo-dev/yylo
github: yylo-dev/yylo
price: 开源
tags:
  - CLI
  - 终端智能体
  - 智能体编排
features:
  - 编排多个编码智能体与可重复工作流
  - 回执（receipt）支撑的仓库变更
  - 类型化任务、验证、合并与发布就绪边界
  - ypl（yy pi --live）交互式终端智能体会话
  - 每次运行后输出迭代、工具调用、成本与会话摘要
publishedAt: 2026-09-22
---

YYLO 是一个命令行编码智能体编排器（command-line orchestrator for coding agents），面向两类使用者：想要快速智能体循环的开发者，以及需要类型化任务、验证、合并与发布就绪边界的项目运营者。

它把编码智能体的调用、可重复工作流与带回执的仓库变更统一在一个 CLI 里：`yylo` / `yy` 命令等价，npm 包为 `@yylo/cli`；`ypl`（`yy pi --live`）启动交互式终端智能体会话，工具调用、流式输出与状态栏直接渲染在终端中，每次运行结束还会打印迭代次数、工具调用、成本与会话 id 的执行摘要。

**适合谁**：需要在终端里统一调度多个编码智能体、并为任务 / 验证 / 合并建立清晰边界的开发者与项目运营者。
