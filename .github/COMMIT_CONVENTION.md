# Commit Message 规范

本项目使用 Conventional Commits 规范，以支持自动版本管理和发布。

## 📝 格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## 🏷️ Type 类型

| Type | 说明 | 版本影响 |
|------|------|---------|
| `feat` | 新功能 | minor (0.1.0 → 0.2.0) |
| `feat!` | 破坏性新功能 | major (0.2.0 → 1.0.0) |
| `fix` | Bug 修复 | patch (0.1.1 → 0.1.2) |
| `fix!` | 破坏性修复 | major (0.2.0 → 1.0.0) |
| `docs` | 文档更新 | patch |
| `style` | 代码格式（不影响功能） | patch |
| `refactor` | 重构（不改变功能） | patch |
| `perf` | 性能优化 | patch |
| `test` | 测试相关 | patch |
| `chore` | 构建、工具等 | patch |
| `ci` | CI 配置 | patch |

## 📋 示例

### 新功能

```bash
# 简单新功能
git commit -m "feat: add table search feature"

# 带范围
git commit -m "feat(table): add pagination support"

# 带描述
git commit -m "feat: add export to excel" -m "Users can now export table data to Excel format"
```

### Bug 修复

```bash
# 简单修复
git commit -m "fix: resolve login timeout issue"

# 带范围
git commit -m "fix(auth): prevent token expiration"
```

### 破坏性变更

```bash
# 方式 1: 使用感叹号
git commit -m "feat!: redesign authentication API"

# 方式 2: 使用 footer
git commit -m "feat: update API endpoints" -m "BREAKING CHANGE: /api/v1 endpoints removed"

# 方式 3: 组合使用
git commit -m "fix!: change form validation rules" -m "BREAKING CHANGE: all forms now require email validation"
```

### 其他类型

```bash
# 文档
git commit -m "docs: update README with new examples"

# 重构
git commit -m "refactor: simplify table component logic"

# 性能
git commit -m "perf: optimize list rendering"

# 测试
git commit -m "test: add unit tests for form validation"

# 构建/工具
git commit -m "chore: update dependencies"
git commit -m "ci: add auto-release workflow"
```

## ⚙️ 多行 Commit

对于复杂的更改，可以使用多行描述：

```bash
git commit -m "feat: add advanced search" -m "
Features:
- Full text search
- Filter by date range
- Export results

Fixes #123
"
```

或使用编辑器：

```bash
git commit
```

然后在编辑器中输入：

```
feat: add advanced search

Add comprehensive search functionality including:
- Full text search across all fields
- Date range filtering
- Export search results to CSV

This resolves the search performance issues mentioned in #123.

BREAKING CHANGE: Search API endpoint changed from /search to /api/search
```

## 🚀 自动发布行为

根据 commit message，自动发布流程会：

| Commit Message | 版本变化 | 示例 |
|---------------|---------|------|
| `fix: bug description` | 0.1.1 → 0.1.2 | Bug 修复 |
| `feat: new feature` | 0.1.2 → 0.2.0 | 新功能 |
| `feat!: breaking change` | 0.2.0 → 1.0.0 | 破坏性变更 |
| `fix!: breaking fix` | 0.2.0 → 1.0.0 | 破坏性修复 |

## ✅ 最佳实践

1. **保持简洁** - 描述应该简短明了
2. **使用现在时** - "add feature" 而不是 "added feature"
3. **首字母小写** - "feat: add table" 而不是 "feat: Add table"
4. **不要使用句号** - 描述结尾不加句号
5. **关联 Issue** - 在 footer 中添加 "Fixes #123" 或 "Closes #456"

## ❌ 不推荐的写法

```bash
# ❌ 太简略
git commit -m "update"
git commit -m "fix bug"

# ❌ 没有 type
git commit -m "update table component"

# ❌ 首字母大写
git commit -m "feat: Add new feature"

# ❌ 使用句号
git commit -m "fix: resolve issue."

# ❌ 使用过去时
git commit -m "feat: added search feature"
```

## ✅ 推荐的写法

```bash
# ✅ 清晰明确
git commit -m "feat: add table pagination"
git commit -m "fix: resolve login timeout issue"

# ✅ 带范围
git commit -m "feat(table): add export to excel"
git commit -m "fix(auth): prevent token expiration"

# ✅ 破坏性变更
git commit -m "feat!: redesign API structure"
git commit -m "fix!: change validation rules"
```

## 🔗 相关资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [语义化版本](https://semver.org/lang/zh-CN/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
