# antd-claude-skill

一个专为 Ant Design Pro-Components 设计的 Claude Code Skill，帮助你快速创建标准化的后台管理页面。

[![NPM Version](https://img.shields.io/npm/v/antd-claude-skill.svg)](https://www.npmjs.com/package/antd-claude-skill)
[![License](https://img.shields.io/npm/l/antd-claude-skill.svg)](https://github.com/iamwjun/antd-claude-skill/blob/main/LICENSE)

## ✨ 特性

- 🎯 **专为 Pro-Components 设计** - 使用 ProTable、ProForm、ProDescriptions 等组件
- 📝 **完整的代码模板** - 包含列表页、表单页、详情页的完整示例
- 🔒 **类型安全** - 使用 Zod 进行参数校验和类型推导
- 🚀 **现代化技术栈** - @tanstack/query + styled-components + React Router v6
- 📦 **一键安装** - 通过 npx 命令快速安装到你的项目

## 🚀 快速开始

### 安装 Skill

在你的项目目录下运行：

```bash
npx antd-claude-skill
```

CLI 会引导你选择安装位置：

- 当前项目 (`./.claude/skills`)
- 全局 Claude 目录 (`~/.claude/skills`)
- 自定义路径

### 使用 Skill

安装完成后，在 Claude Code 中直接说：

```
"创建一个用户列表页"
"创建一个新建用户的表单页"
"创建一个用户详情页"
```

Skill 会自动触发，生成符合规范的代码。

### 安装位置说明

**当前项目 (./.claude/skills)**
- 适合项目特定配置，团队共享
- 安装后位于项目根目录的 `.claude/skills/` 下

**全局 Claude 目录 (~/.claude/skills)**
- 适合个人常用配置，所有项目通用
- 安装后位于用户目录的 `.claude/skills/` 下

### 验证安装

```bash
# 当前项目
ls -la .claude/skills/pro-components-page/

# 全局
ls -la ~/.claude/skills/pro-components-page/
```

## 📖 Skill 功能

### 支持的页面类型

1. **列表页 (ProTable)**
   - 分页、搜索、筛选、排序
   - 批量操作、导出
   - URL 参数同步

2. **表单页 (ProForm)**
   - 新建/编辑复用
   - 表单验证（Zod）
   - 多种表单控件

3. **详情页 (ProDescriptions)**
   - 信息展示
   - 操作按钮
   - 关联数据展示

### 技术栈规范

| 技术 | 用途 |
|------|------|
| `@ant-design/pro-components` | 页面组件 |
| `@tanstack/react-query` | 接口请求 |
| `zod` | 参数校验 |
| `styled-components` | 样式 |
| `react-router-dom` | 路由 |

## 📁 项目结构

```
antd-claude-skill/
├── bin/                    # CLI 工具
│   └── cli.js              # 安装命令
├── src/                    # 参考源码
│   └── index.ts
├── skills/                 # Claude Skill
│   └── antd-claude-skill/
│       ├── skill.md       # Skill 定义
│       ├── references/    # 代码参考模板
│       │   ├── table-page.md
│       │   ├── form-page.md
│       │   └── detail-page.md
│       ├── templates/     # 组件模板
│       └── examples/      # 示例代码
├── package.json
├── tsconfig.json
├── rollup.config.mjs
└── README.md
```

## 🛠️ 本地开发

### 克隆仓库

```bash
git clone https://github.com/iamwjun/antd-claude-skill.git
cd antd-claude-skill
npm install
```

### 开发命令

```bash
# 构建组件库
npm run build

# 代码检查
npm run lint
```

### 本地测试 CLI

```bash
# 使用 npm link
npm link
add-skill

# 或直接运行
node bin/cli.js
```

## 📦 发布流程

本项目支持自动发布到 npm 和创建 GitHub Release。

### 自动发布（推荐）

使用规范的 commit message，推送到 main/master 分支即可自动发布：

```bash
# Bug 修复 → patch 版本 (0.1.1 → 0.1.2)
git commit -m "fix: resolve login issue"

# 新功能 → minor 版本 (0.1.2 → 0.2.0)
git commit -m "feat: add new component"

# 破坏性变更 → major 版本 (0.2.0 → 1.0.0)
git commit -m "feat!: redesign API"

# 推送触发自动发布
git push origin main
```

### 手动触发

在 GitHub Actions 页面手动运行 workflow，选择版本类型（patch/minor/major）。

详细说明请查看 [发布文档](./.github/PUBLISH.md)。

## 📝 文档

- [Skill 说明](./skills/antd-claude-skill/skill.md)
- [列表页模板](./skills/antd-claude-skill/references/table-page.md)
- [表单页模板](./skills/antd-claude-skill/references/form-page.md)
- [详情页模板](./skills/antd-claude-skill/references/detail-page.md)

## ❓ 常见问题

**Q: 如何卸载 Skill？**

A: 直接删除对应的 skill 目录即可：

```bash
# 删除项目 skill
rm -rf .claude/skills/pro-components-page

# 删除全局 skill
rm -rf ~/.claude/skills/pro-components-page
```

**Q: Skill 没有触发怎么办？**

A: 尝试以下方法：
1. 检查 `skill.md` 是否正确安装
2. 重启 Claude Code
3. 使用更明确的触发词，如 "使用 ProTable 创建列表页"

**Q: 可以同时安装到多个位置吗？**

A: 可以，但 Claude Code 会优先使用项目本地的 skill。

**Q: 如何更新 Skill？**

A: 重新运行安装命令，选择覆盖即可：

```bash
npx antd-claude-skill
# 选择 "Overwrite"
```

## 🤝 贡献

欢迎贡献代码！提交 Pull Request 或 Issue 即可。

## 📄 License

MIT

---

Made with ❤️ for Claude Code users

