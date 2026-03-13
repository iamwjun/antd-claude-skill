# npm Trusted Publisher 配置指南

## 📋 完整配置步骤

### 1. 前提条件

在配置 Trusted Publisher 之前，需要：

- ✅ **包已经存在** - 必须先手动发布至少一个版本到 npm
- ✅ **有包的维护权限** - 必须是包的 owner 或 maintainer
- ✅ **GitHub 仓库存在** - 仓库必须是公开的或有权限访问

⚠️ **重要：首次发布必须手动完成！**

### 2. 首次手动发布（如果还没发布过）

```bash
# 1. 登录 npm
npm login

# 2. 构建项目
npm run build

# 3. 首次发布（必须手动）
npm publish --access public

# 4. 验证发布成功
npm view antd-claude-skill
```

### 3. 在 npm 官网配置 Trusted Publisher

#### 步骤 A: 进入包设置

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 点击头像 → **Packages**
3. 找到并点击 **antd-claude-skill**
4. 点击 **Settings** 标签

#### 步骤 B: 配置 Publishing Access

1. 在左侧菜单找到 **Publishing Access**
2. 滚动到 **Trusted publishers** 部分
3. 点击 **Add trusted publisher**
4. 选择 **GitHub Actions**

#### 步骤 C: 填写配置信息

**必填字段：**

| 字段 | 值 | 说明 |
|------|-----|------|
| **Provider** | GitHub Actions | 选择 CI/CD 提供商 |
| **GitHub repository owner** | `iamwjun` | 你的 GitHub 用户名或组织名 |
| **GitHub repository name** | `antd-claude-skill` | 仓库名称（不含 owner） |
| **Workflow file path** | `.github/workflows/publish.yml` | workflow 文件的完整路径 |

**可选字段（推荐留空）：**

| 字段 | 建议 | 原因 |
|------|------|------|
| **Environment** | 留空 | 除非使用 GitHub Environments，否则留空 |
| **Branch** | 留空 | 允许从任何分支发布（已在 workflow 中限制） |

#### 步骤 D: 保存配置

点击 **Add trusted publisher** 完成配置。

## ⚠️ 重要注意事项

### 1. 首次发布限制

```
❌ 错误做法：
   直接配置 Trusted Publisher → workflow 发布 → 失败！

✅ 正确做法：
   1. 手动发布第一个版本 (npm publish)
   2. 配置 Trusted Publisher
   3. workflow 自动发布后续版本
```

**原因：** npm 要求包必须先存在，才能配置 Trusted Publisher。

### 2. 仓库名称精确匹配

```yaml
# ❌ 错误
GitHub repository owner: iamwjun/antd-claude-skill

# ✅ 正确
GitHub repository owner: iamwjun
GitHub repository name: antd-claude-skill
```

### 3. Workflow 文件路径

```yaml
# ❌ 错误
publish.yml
workflows/publish.yml

# ✅ 正确
.github/workflows/publish.yml
```

必须包含完整的相对路径，从仓库根目录开始。

### 4. 仓库可见性

- **公开仓库** ✅ - 完全支持
- **私有仓库** ⚠️ - 需要 npm Teams 或 Enterprise 订阅

### 5. Workflow 权限

确保 workflow 文件中有正确的权限：

```yaml
permissions:
  contents: write    # 用于推送 tag
  packages: write    # 用于发布包
  id-token: write    # ← 必须！用于 OIDC 认证
```

### 6. GitHub Actions 仓库设置

Settings → Actions → General → Workflow permissions:

```
✅ 必须选择："Read and write permissions"
✅ 必须勾选："Allow GitHub Actions to create and approve pull requests"
```

## 🔍 验证配置

### 检查清单

- [ ] 包已在 npm 上存在（至少一个版本）
- [ ] Trusted Publisher 已配置
  - [ ] Provider: GitHub Actions
  - [ ] Owner: `iamwjun`
  - [ ] Repo: `antd-claude-skill`
  - [ ] Workflow: `.github/workflows/publish.yml`
- [ ] Workflow 文件包含 `id-token: write` 权限
- [ ] GitHub Actions 权限设置正确
- [ ] Workflow 使用 `--provenance` 标志

### 测试发布

```bash
# 1. 创建测试提交
git commit -m "test: trigger publish" --allow-empty

# 2. 推送触发 workflow
git push origin main

# 3. 查看 Actions 日志
# GitHub → Actions → 查看运行日志
```

## 📊 配置后的发布流程

```
Developer 推送代码到 main
    ↓
GitHub Actions workflow 触发
    ↓
GitHub 生成 OIDC token（短期有效）
    ↓
npm 验证 OIDC token
    ↓ 验证通过 ✅
npm 授权发布
    ↓
包发布到 npm registry（含 Provenance）
```

## 🛠️ 故障排查

### 问题 1: "npm ERR! 404 Not Found"

**原因：** 包不存在或 Trusted Publisher 未配置

**解决：**
```bash
# 首次发布必须手动
npm login
npm publish --access public
```

### 问题 2: "npm ERR! 403 Forbidden"

**可能原因：**
1. Trusted Publisher 配置错误
2. Workflow 文件路径不匹配
3. 仓库名称拼写错误
4. 缺少 `id-token: write` 权限

**检查步骤：**
```bash
# 1. 检查包设置
npm view antd-claude-skill

# 2. 验证配置信息
# npm 官网 → Package Settings → Publishing Access

# 3. 检查 workflow 权限
# .github/workflows/publish.yml → permissions
```

### 问题 3: "OIDC token validation failed"

**原因：** GitHub Actions 权限配置错误

**解决：**
1. Settings → Actions → General
2. Workflow permissions → "Read and write permissions"
3. 勾选 "Allow GitHub Actions to create..."

### 问题 4: Provenance 未生成

**原因：** 缺少 `--provenance` 标志

**解决：**
```yaml
# 确保发布命令包含
npm publish --provenance --access public
```

## 📝 配置示例

### npm 包设置截图说明

配置完成后，在包设置页面应该看到：

```
Publishing Access
  ├── Automation tokens: (空)
  └── Trusted publishers:
      └── GitHub Actions
          ├── Repository: iamwjun/antd-claude-skill
          ├── Workflow: .github/workflows/publish.yml
          └── Status: Active ✅
```

### Workflow 配置示例

```yaml
name: Publish to NPM

on:
  push:
    branches:
      - main
      - master

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      id-token: write  # ← 关键！

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      # ... 其他步骤 ...

      - name: Publish to NPM
        run: npm publish --provenance --access public
        # 不需要 NODE_AUTH_TOKEN！
```

## 🎯 最佳实践

1. **首次发布前测试**
   ```bash
   # 使用 npm pack 预览
   npm pack
   tar -tzf antd-claude-skill-*.tgz
   ```

2. **使用 --dry-run 测试**
   ```bash
   npm publish --dry-run
   ```

3. **监控发布日志**
   - 查看 GitHub Actions 日志
   - 检查 npm 包页面的 Provenance

4. **定期验证配置**
   - 每次更新 workflow 文件后
   - 仓库重命名后
   - 转移仓库后

## 🔗 相关资源

- [npm Trusted Publishers 官方文档](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub OIDC 文档](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [npm Provenance 说明](https://github.blog/2023-04-19-introducing-npm-package-provenance/)

## 📞 需要帮助？

如果配置后仍然失败，请提供：
1. GitHub Actions 日志（发布步骤）
2. npm 包设置截图（Publishing Access 部分）
3. workflow 文件中的 permissions 配置
