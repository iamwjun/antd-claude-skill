---
name: pro-components-page
description: 使用 Ant Design Pro-Components 创建标准页面组件的技能。当用户需要创建后台管理页面、列表页、表单页、详情页时必须使用此技能。触发场景包括：创建 ProTable 列表页、ProForm 表单页、ProDescriptions 详情页、使用 PageContainer 包裹的页面、需要结合 @tanstack/query 做接口请求、使用 zod 定义页面参数、使用 styled-components 写样式的任何页面组件。即使用户只是说"创建一个列表页"、"做个表单"、"写个详情页"也应触发此技能。
---

# Pro-Components Page Skill

使用 Ant Design Pro-Components 创建标准化后台页面组件。

## 技术栈规范

| 技术 | 用途 | 版本要求 |
|------|------|----------|
| `@ant-design/pro-components` | 页面组件 | ^2.x |
| `@tanstack/react-query` | 接口请求 | ^5.x |
| `zod` | 参数校验与类型定义 | ^3.x |
| `styled-components` | 样式 | ^6.x |
| `react-router-dom` | 路由参数 | ^6.x |

---

## 页面类型选择

根据用户需求选择对应类型，详细代码模板见 references/ 目录：

- **列表页 (Table)** → 读取 `references/table-page.md`
- **表单页 (Form)** → 读取 `references/form-page.md`
- **详情页 (Detail)** → 读取 `references/detail-page.md`

---

## 通用规范（所有页面类型必须遵守）

### 1. PageContainer 包裹
所有页面必须用 `PageContainer` 作为根容器：
```tsx
<PageContainer
  title="页面标题"
  breadcrumb={{ items: [...] }}
  extra={[/* 操作按钮 */]}
>
  {/* 页面内容 */}
</PageContainer>
```

### 2. Zod 定义页面参数
使用 zod schema 定义并验证所有参数（URL query params、路由参数、表单数据）：
```tsx
import { z } from 'zod'

// URL 查询参数
const pageQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  keyword: z.string().optional(),
  status: z.enum(['active', 'inactive', 'all']).default('all'),
})
type PageQuery = z.infer<typeof pageQuerySchema>

// 使用 safeParse 安全解析
const parseResult = pageQuerySchema.safeParse(rawParams)
if (!parseResult.success) {
  // 处理错误或使用默认值
  const params = pageQuerySchema.parse({}) // 使用所有默认值
}
const params = parseResult.data
```

### 3. @tanstack/query 接口请求
**查询（GET）** 使用 `useQuery`：
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// 定义 query keys 常量（便于缓存控制）
const QUERY_KEYS = {
  list: (params: PageQuery) => ['resource', 'list', params] as const,
  detail: (id: string) => ['resource', 'detail', id] as const,
}

const { data, isLoading, error } = useQuery({
  queryKey: QUERY_KEYS.list(params),
  queryFn: () => fetchResourceList(params),
  staleTime: 5 * 60 * 1000, // 5分钟
})
```

**变更（POST/PUT/DELETE）** 使用 `useMutation`：
```tsx
const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: createResource,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['resource'] })
    message.success('操作成功')
  },
  onError: (error) => {
    message.error(error.message || '操作失败')
  },
})
```

### 4. styled-components 样式
- 所有自定义样式使用 styled-components，禁止内联 style
- 组件命名以 `Styled` 前缀或语义化命名
- 复用 antd 的 design token 变量

```tsx
import styled from 'styled-components'

const PageWrapper = styled.div`
  .ant-pro-table {
    background: #fff;
  }
`

const ActionBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`
```

---

## 文件结构规范

```
src/pages/ResourceName/
├── index.tsx          # 页面入口（路由组件）
├── types.ts           # zod schema + 类型导出
├── api.ts             # API 函数定义
├── components/        # 页面内子组件（可选）
│   └── SomeModal.tsx
└── styles.ts          # styled-components 样式（可选，复杂页面抽离）
```

---

## 快速决策树

```
用户需求
  ├── 展示数据列表，支持分页/筛选/排序？ → 列表页 (Table)
  ├── 填写数据，新增或编辑记录？         → 表单页 (Form)
  └── 查看某条记录的详细信息？           → 详情页 (Detail)
```

---

## 参考文件说明

在生成代码前，**必须先读取**对应类型的参考文件：

- `references/table-page.md` — 列表页完整示例 + ProTable 配置说明
- `references/form-page.md` — 表单页完整示例 + ProForm 字段配置
- `references/detail-page.md` — 详情页完整示例 + ProDescriptions 配置

如果用户需要组合页面（如列表页内嵌新建表单弹窗），同时读取两份参考文件。
