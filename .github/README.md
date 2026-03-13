# GitHub Workflows & 发布指南

本目录包含 GitHub Actions workflows 和发布相关文档。

## 📁 文件说明

- **workflows/publish.yml** - 自动发布 workflow
- **PUBLISH.md** - 详细发布配置和使用指南
- **COMMIT_CONVENTION.md** - Commit message 规范

## 🚀 快速开始

### 1. 配置 NPM Token

```bash
# 1. 登录 npm 获取 Automation token
# 2. GitHub Settings → Secrets → New secret
# Name: NPM_TOKEN
# Value: <your-npm-token>
```

### 2. 使用规范的 Commit Message

```bash
# 修复 bug (patch: 0.1.1 → 0.1.2)
git commit -m "fix: resolve issue"

# 新功能 (minor: 0.1.2 → 0.2.0)
git commit -m "feat: add feature"

# 破坏性变更 (major: 0.2.0 → 1.0.0)
git commit -m "feat!: breaking change"
```

### 3. 推送到 main/master 分支

```bash
git push origin main
# 自动触发发布流程
```

## 📋 Commit Message 快速参考

| Type | 版本影响 | 示例 |
|------|---------|------|
| `fix:` | patch | `fix: resolve login issue` |
| `feat:` | minor | `feat: add search feature` |
| `feat!:` | major | `feat!: redesign API` |
| `docs:` | patch | `docs: update README` |
| `chore:` | patch | `chore: update deps` |

## 🎯 手动触发发布

1. GitHub → Actions → "Publish to NPM"
2. Run workflow → 选择版本类型
3. 点击 Run workflow

## 📦 发布产物

每次发布会自动创建：

- ✅ npm 包
- ✅ Git tag (v0.1.2)
- ✅ GitHub Release (含 changelog)

## 📖 详细文档

- [完整发布指南](./PUBLISH.md)
- [Commit 规范详解](./COMMIT_CONVENTION.md)

## 🔗 相关链接

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [npm 文档](https://docs.npmjs.com/)
