---
name: OpenAI Codex
category: 智能体
description: OpenAI 开源的轻量终端编码智能体，可在沙箱中执行代码，把自然语言任务转化为可运行的工程改动。
icon: 🌀
website: https://developers.openai.com/codex/
github: openai/codex
price: 付费
tags:
  - CLI
  - 终端智能体
  - OpenAI
features:
  - 轻量级 CLI，安装即可在终端内完成编码任务
  - 沙箱化执行环境，安全运行代码与命令
  - 支持与 ChatGPT / Claude 等多模型配合使用
  - 可作 CI 中的自动化编码智能体
publishedAt: 2026-03-01
---

OpenAI Codex 是 OpenAI 开源的终端编码智能体。它继承了「Codex」这个名字的使命：把一句自然语言指令，变成对代码库的真实改动。

Codex 的亮点在于**沙箱执行**：它可以在隔离环境中运行命令、执行测试并查看结果，从而在动手前先验证思路。它与 ChatGPT Plus / Pro 订阅打通，也支持在 CI 流水线中以无人值守方式运行，自动处理 GitHub Issue。

**适合谁**：OpenAI 生态用户，希望用一个轻量 CLI 在终端和 CI 中自动完成代码任务的开发者。
