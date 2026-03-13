# GitHub Actions 自动发布配置

## 📝 说明

已创建 GitHub Actions workflow，支持：

- ✅ **自动版本递增** - 根据 commit message 或手动选择
- ✅ **自动发布到 npm** - 构建并发布到 npm registry
- ✅ **自动创建 GitHub Release** - 包含 changelog
- ✅ **Git Tag 管理** - 自动创建和推送版本标签
- ✅ **使用 npm Trusted Publisher** - 无需配置 NPM_TOKEN，更安全

## ⚙️ 配置说明

### npm Trusted Publisher 已配置 ✅

本项目已配置 **npm Trusted Publisher**，这意味着：

- ✅ **无需手动配置 NPM_TOKEN** - 使用 OpenID Connect (OIDC) 自动验证
- ✅ **更高的安全性** - 避免 token 泄露风险
- ✅ **自动 Provenance** - 发布包含来源证明

### GitHub Actions 权限配置

确保仓库 Actions 权限已正确配置：

1. Settings → Actions → General
2. Workflow permissions 选择 **"Read and write permissions"**
3. 勾选 **"Allow GitHub Actions to create and approve pull requests"**

> 💡 这些权限用于推送版本标签和创建 GitHub Release

## 🚀 使用方式

### 方式 1: 自动发布（推荐）

通过 commit message 自动判断版本类型：

```bash
# Patch 版本 (0.1.1 → 0.1.2) - 修复 bug
git commit -m "fix: resolve login issue"

# Minor 版本 (0.1.2 → 0.2.0) - 新功能
git commit -m "feat: add new table component"

# Major 版本 (0.2.0 → 1.0.0) - 破坏性变更
git commit -m "feat!: redesign API"
# 或
git commit -m "fix!: breaking change in auth"

# 推送到 main/master 分支
git push origin main
```

**Commit Message 规范：**

| Prefix | 版本类型 | 说明 |
|--------|---------|------|
| `fix:` | patch | Bug 修复 |
| `feat:` | minor | 新功能 |
| `feat!:` 或 `fix!:` | major | 破坏性变更 |
| `chore:`, `docs:`, 等 | patch | 其他变更 |

### 方式 2: 手动触发

在 GitHub 仓库页面：

1. 点击 "Actions" 标签
2. 选择 "Publish to NPM" workflow
3. 点击 "Run workflow" 按钮
4. 选择版本类型：
   - **patch** - 修复版本 (0.1.1 → 0.1.2)
   - **minor** - 次版本 (0.1.2 → 0.2.0)
   - **major** - 主版本 (0.2.0 → 1.0.0)
5. 点击 "Run workflow" 确认

## 📋 Workflow 执行流程

```
触发 (push 或手动)
    ↓
检出代码 (包含完整历史)
    ↓
配置 Git 用户
    ↓
获取当前版本
    ↓
判断版本递增类型
    ↓
安装依赖
    ↓
构建项目
    ↓
自动递增版本号
    ↓
推送版本变更和 Tag
    ↓
生成 Changelog
    ↓
发布到 npm
    ↓
创建 GitHub Release
    ↓
生成发布摘要
```

## 🎯 版本递增规则

### 自动模式（基于 commit message）

```bash
# 检测最近一次 commit message

feat!: xxx          → major (1.0.0)
fix!: xxx           → major (1.0.0)
BREAKING CHANGE     → major (1.0.0)

feat: xxx           → minor (0.1.0)

fix: xxx            → patch (0.0.1)
docs: xxx           → patch (0.0.1)
chore: xxx          → patch (0.0.1)
```

### 手动模式（workflow_dispatch）

直接选择版本类型，忽略 commit message。

## 📦 发布产物

每次成功发布后，会创建以下内容：

1. **npm 包** - 发布到 npm registry
   - 链接：`https://www.npmjs.com/package/antd-claude-skill`
   - ✅ **包含 Provenance** - 可验证的来源证明

2. **Git Tag** - 创建版本标签
   - 格式：`v0.1.2`

3. **GitHub Release** - 创建发布记录
   - 包含版本号
   - 包含自动生成的 changelog
   - 链接：`https://github.com/your-org/antd-claude-skill/releases`

4. **Workflow Summary** - 发布摘要
   - 显示版本信息
   - 显示相关链接

## 🔐 关于 npm Trusted Publisher

### 什么是 Trusted Publisher？

npm Trusted Publisher 是一种基于 OpenID Connect (OIDC) 的身份验证机制，允许从 CI/CD 平台（如 GitHub Actions）直接发布包，无需手动管理 token。

### 优势

- ✅ **无需 token 管理** - 不需要创建和存储 NPM_TOKEN
- ✅ **更高安全性** - 避免 token 泄露风险
- ✅ **自动 Provenance** - 每个发布都包含可验证的来源证明
- ✅ **审计追踪** - 清晰记录每次发布的来源

### 如何验证 Provenance

用户可以验证包的来源：

```bash
npm view antd-claude-skill
```

在输出中会看到 `provenance` 信息，显示包是从哪个 GitHub 仓库和 workflow 发布的。

## 📝 Changelog 生成规则

Changelog 会自动从 Git commits 生成：

- **首次发布：** 包含所有历史 commits
- **后续发布：** 包含上个 tag 到当前的所有 commits

格式示例：
```
- feat: add new table component (a1b2c3d)
- fix: resolve login issue (e4f5g6h)
- docs: update README (i7j8k9l)
```

## ⚠️ 重要提醒

### 1. 权限配置

Workflow 需要以下权限（已在 workflow 中配置）：

```yaml
permissions:
  contents: write    # 用于推送 tag 和创建 release
  packages: write    # 用于发布包
```

### 2. 避免循环触发

版本 commit message 使用 `[skip ci]` 标记：

```
chore: release v0.1.2 [skip ci]
```

这样可以避免触发新的 workflow 运行。

### 3. 分支保护

如果启用了分支保护规则，需要：

1. 允许 GitHub Actions 推送到保护分支
2. 或使用 Personal Access Token (PAT)

### 4. npm 包名称唯一性

确保 `package.json` 中的包名在 npm 上是唯一的。

## 🔧 故障排查

### 问题：推送 tag 失败

**错误信息：**
```
! [rejected]        v0.1.2 -> v0.1.2 (protected branch)
```

**解决方案：**

方法 1 - 允许 GitHub Actions 推送（推荐）：
1. Settings → Actions → General
2. 勾选 "Allow GitHub Actions to create and approve pull requests"
3. Workflow permissions 选择 "Read and write permissions"

方法 2 - 使用 PAT：
```yaml
- uses: actions/checkout@v4
  with:
    token: ${{ secrets.PAT_TOKEN }}
```

### 问题：npm publish 失败

**错误信息：**
```
403 Forbidden - PUT https://registry.npmjs.org/antd-claude-skill
```

**解决方案：**

1. 确认 npm Trusted Publisher 配置正确
   - 登录 npm 官网
   - 进入包设置 → Publishing Access
   - 确认 GitHub Actions 已授权

2. 检查 GitHub Actions 权限
   - Settings → Actions → General
   - Workflow permissions 应为 "Read and write permissions"
   - 确保 `id-token: write` 权限已启用

3. 确保包名未被占用（首次发布）

4. 对于 scoped package（如 `@org/package`），确保有发布权限

### 问题：Release 创建失败

**错误信息：**
```
Resource not accessible by integration
```

**解决方案：**

1. 检查 workflow permissions
2. 确保 `contents: write` 权限已启用

### 问题：版本号未更新

**可能原因：**

1. Commit message 格式不符合规范
2. 手动模式未正确选择版本类型

**解决方案：**

使用 `workflow_dispatch` 手动触发，明确选择版本类型。

## 🎨 自定义配置

### 修改版本递增规则

编辑 `.github/workflows/publish.yml` 中的 `Determine version bump type` 步骤：

```yaml
- name: Determine version bump type
  id: version-bump
  run: |
    COMMIT_MSG=$(git log -1 --pretty=%B)

    # 自定义规则
    if [[ $COMMIT_MSG =~ ^(release|v[0-9]) ]]; then
      BUMP_TYPE="major"
    elif [[ $COMMIT_MSG =~ ^(feature|add) ]]; then
      BUMP_TYPE="minor"
    else
      BUMP_TYPE="patch"
    fi

    echo "type=$BUMP_TYPE" >> $GITHUB_OUTPUT
```

### 自定义 Changelog 格式

修改 `Generate changelog` 步骤：

```yaml
- name: Generate changelog
  run: |
    git log $PREV_TAG..HEAD \
      --pretty=format:"### %s%n%b%n" \
      --reverse > changelog.txt
```

### 添加发布通知

在 workflow 末尾添加：

```yaml
- name: Send notification
  if: success()
  run: |
    curl -X POST ${{ secrets.WEBHOOK_URL }} \
      -H 'Content-Type: application/json' \
      -d '{"version": "${{ steps.bump-version.outputs.version }}"}'
```

## 📊 查看发布历史

### 1. GitHub Releases

访问：`https://github.com/your-org/antd-claude-skill/releases`

### 2. npm Versions

访问：`https://www.npmjs.com/package/antd-claude-skill?activeTab=versions`

### 3. Git Tags

```bash
# 列出所有 tags
git tag -l

# 查看 tag 详情
git show v0.1.2
```

## 🔗 相关链接

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions - softprops/action-gh-release](https://github.com/softprops/action-gh-release)
- [npm Publishing](https://docs.npmjs.com/cli/v9/commands/npm-publish)

