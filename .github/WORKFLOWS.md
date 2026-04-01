# GitHub Workflows & 发布指南

本目录包含 GitHub Actions workflows 和发布相关文档。

## 📁 文件说明

- **workflows/publish.yml** - 自动发布 workflow（使用 NPM Token）✅
- **PUBLISH.md** - 详细发布配置和使用指南
- **COMMIT_CONVENTION.md** - Commit message 规范
- **SETUP_COMPLETE.md** - 配置完成总结（推荐阅读）⭐
- **TRUSTED_PUBLISHER_SETUP.md** - Trusted Publisher 配置（参考）
- **TROUBLESHOOTING_404.md** - 404 错误排查

## 🚀 快速开始

### 1. 配置 NPM Token ✅

已配置 **NPM Automation Token**，稳定可靠！

确保 GitHub Secret 已设置：
- Name: `NPM_TOKEN`
- Value: 你的 npm automation token

如需重新配置：
1. npm 官网 → Access Tokens → Generate (Automation 类型)
2. GitHub Settings → Secrets → Actions → 更新 `NPM_TOKEN`

### 2. 使用规范的 Commit Message

```bash
# 修复 bug (patch: 0.1.5 → 0.1.6)
git commit -m "fix: resolve login issue"

# 新功能 (minor: 0.1.6 → 0.2.0)
git commit -m "feat: add search feature"

# 破坏性变更 (major: 0.2.0 → 1.0.0)
git commit -m "feat!: breaking change"
```

### 3. 推送到 main/master 分支

```bash
git push origin main
# 自动触发发布流程 ✅
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
2. Run workflow → 选择版本类型 (patch/minor/major)
3. 点击 Run workflow

## 📦 发布产物

每次发布会自动创建：

- ✅ npm 包
- ✅ Git tag (v0.1.6)
- ✅ GitHub Release (含 changelog)
- ✅ Workflow summary

## 📖 详细文档

- [⭐ 配置完成总结](./SETUP_COMPLETE.md) - 推荐先看这个
- [完整发布指南](./PUBLISH.md) - 详细使用说明
- [Commit 规范详解](./COMMIT_CONVENTION.md) - 完整的规范说明

## 🔗 相关链接

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [npm 文档](https://docs.npmjs.com/)

## ✅ 当前状态

- ✅ NPM Token 配置完成
- ✅ 自动发布正常工作
- ✅ 版本管理自动化
- ✅ GitHub Release 自动创建

一切就绪，专注开发即可！🚀
