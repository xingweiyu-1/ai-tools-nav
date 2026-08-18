---
name: Claude Code
category: 智能体
description: Anthropic 出品的终端原生编码智能体，能读取代码库、编辑文件、执行命令，并支持 Agent SDK 与 MCP 生态扩展。
icon: 🟠
website: https://claude.com/claude-code
github: anthropics/claude-code
price: 免费增值
tags:
  - CLI
  - 终端智能体
  - Anthropic
  - MCP
features:
  - 终端原生交互，Agentic 模式自动规划并执行多步任务
  - 深度理解大型代码库，可跨文件进行重构与调试
  - 支持 MCP（Model Context Protocol）接入外部工具与数据源
  - 提供 Agent SDK，可将智能体嵌入自有应用
  - 具备权限控制、审计日志等企业级安全能力
publishedAt: 2026-03-01
---

Claude Code 是 Anthropic 推出的命令行编码智能体，运行在终端中，由 Claude 系列模型驱动。它以「Agentic」的方式工作：给定一个任务，它会自主读取仓库、编写代码、运行测试并迭代，直到完成。

相比传统 AI 补全工具，Claude Code 更强调**端到端的任务闭环**。你可以直接说出「修复登录接口的超时问题」，它会定位问题、修改代码、跑测试并给出结果。配合 MCP 协议，还能让智能体调用浏览器、数据库等外部能力，形成真正的开发工作流。

**适合谁**：习惯终端工作流、愿意把「从需求到提交」的整段过程交给智能体的开发者；以及需要可编程、可插拔 Agent 能力的团队。免费额度可体验，重度使用需订阅 Claude 付费方案。
