# npm Trusted Publisher 故障排查 - 404 错误

## 问题现象

```
npm error 404  'antd-claude-skill@0.1.6' is not in this registry.
```

但是：
- ✅ Provenance 成功生成
- ✅ OIDC 认证通过
- ❌ 发布失败

## 解决方案

### 方案 1: 重新授权 Trusted Publisher（推荐）

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 进入包设置：https://www.npmjs.com/package/antd-claude-skill/access
3. 找到 **Trusted publishers** 部分
4. **删除现有的 Trusted Publisher**
5. **重新添加**（使用相同的配置）：
   ```
   Provider: GitHub Actions
   Owner: iamwjun
   Repository: antd-claude-skill
   Workflow: publish.yml
   ```
6. 保存后再次尝试发布

### 方案 2: 使用传统 Token 方式（临时方案）

如果方案 1 不行，可以临时切换回使用 NPM_TOKEN：

1. 生成 Automation Token：
   - npm 官网 → Access Tokens → Generate New Token
   - 选择 "Automation"
   - 复制 token

2. 配置 GitHub Secret：
   - GitHub 仓库 → Settings → Secrets → Actions
   - New secret: `NPM_TOKEN`

3. 修改 workflow：
```yaml
- name: Publish to NPM
  run: npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 方案 3: 手动发布一次激活 Trusted Publisher

这可能是 npm 的一个特性 - 第一次使用 Trusted Publisher 需要手动确认：

```bash
# 1. 本地登录
npm login

# 2. 手动发布当前版本
npm version patch
npm run build
npm publish --access public

# 3. 之后 workflow 应该就能用 Trusted Publisher 了
```

## 详细检查步骤

### 1. 验证 Trusted Publisher 配置

访问：https://www.npmjs.com/package/antd-claude-skill/access

应该看到：
```
Trusted publishers
└── GitHub Actions
    ├── Repository: iamwjun/antd-claude-skill
    ├── Workflow: publish.yml
    └── Status: public
```

### 2. 检查包的 Settings

访问：https://www.npmjs.com/settings/iamwujun/packages

确认：
- ✅ 包是 public
- ✅ 你有 maintainer 权限
- ✅ 没有其他限制

### 3. 检查 GitHub Actions 权限

GitHub 仓库 → Settings → Actions → General

确认：
- ✅ Workflow permissions: "Read and write permissions"
- ✅ "Allow GitHub Actions to create and approve pull requests" 已勾选

## 相关 Issue

这个问题在 npm 社区有过讨论：
- npm Trusted Publisher 有时需要"激活期"
- 第一次使用可能需要手动授权
- 删除并重新添加 Trusted Publisher 通常能解决

## 快速测试

删除并重新添加 Trusted Publisher 后，手动触发 workflow：

```bash
# GitHub Actions → Publish to NPM → Run workflow
# 选择 "patch" → Run workflow
```

如果还是失败，使用方案 2 临时切换回 Token 方式。
