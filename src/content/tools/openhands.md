---
name: OpenHands
category: 智能体
description: 开源的全自主软件智能体平台（原 OpenDevin），能独立完成从需求理解、代码修改到运行调试的完整软件开发循环。
icon: 🖐️
website: https://all-hands.dev
github: All-Hands-AI/OpenHands
price: 开源
tags:
  - 自主智能体
  - 开源
  - 沙箱执行
features:
  - 自主完成「需求 → 编码 → 运行 → 调试」完整循环
  - 内置沙箱执行环境，安全运行代码
  - 支持事件驱动架构与自定义 Agent 实现
  - 可作为 CLI 或平台运行，支持 Docker 部署
  - 开源社区活跃，支持接入主流模型
publishedAt: 2026-03-01
---

OpenHands（原 OpenDevin）是一个开源的自主软件智能体平台，目标是让 AI 像软件工程师一样**独立完成开发任务**。给定一个需求，它会规划步骤、修改代码、运行程序、观察输出并修正，直到任务完成。

它的关键设计是**事件驱动架构**与沙箱执行：智能体的所有行为都记录为事件流，便于回放与调试；代码在 Docker 沙箱中运行，保证安全。OpenHands 也提供 Python SDK，允许开发者构建自己的 Agent。

**适合谁**：对「完全自主编码智能体」感兴趣的开发者与研究者，以及想在自己的服务器上部署开源智能体平台的团队。
