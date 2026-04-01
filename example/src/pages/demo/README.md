# 产品管理示例 (Product Management Demo)

这是一个基于 Ant Design Pro Components 的完整 CRUD 示例项目。

## 📁 文件结构

```
example/src/pages/demo/
├── types.ts          # 类型定义和 Zod Schema
├── index.tsx         # 产品列表页 (ProTable)
├── form.tsx          # 新建/编辑表单页 (ProForm)
└── detail.tsx        # 产品详情页 (ProDescriptions)

example/mock/
└── productAPI.ts     # Mock API 接口
```

## ✨ 功能特性

### 1. 列表页 (`index.tsx`)
- ✅ 分页查询
- ✅ 关键词搜索
- ✅ 状态筛选（在售/下架）
- ✅ 分类筛选
- ✅ 产品图片预览
- ✅ 价格展示（原价/折扣价）
- ✅ 库存预警（低于10件标红）
- ✅ 操作按钮（查看/编辑/删除）

### 2. 表单页 (`form.tsx`)
- ✅ 新建/编辑复用
- ✅ 表单验证（Zod Schema）
- ✅ 字段分组展示
- ✅ 自动回填（编辑模式）
- ✅ 支持字段：
  - 产品名称、品牌、分类
  - 描述、图片URL
  - 售价、原价、库存
  - 销售状态

### 3. 详情页 (`detail.tsx`)
- ✅ 信息展示（ProDescriptions）
- ✅ 产品图片预览
- ✅ 价格对比显示
- ✅ 库存状态提示
- ✅ 评分展示
- ✅ 标签显示
- ✅ 操作按钮（返回/编辑/删除）

## 🚀 运行示例

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev:example
```

### 3. 访问页面

打开浏览器访问：http://localhost:8000/demo

## 📊 Mock 数据

Mock API 提供了以下接口：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/products` | GET | 获取产品列表（支持分页、搜索、筛选） |
| `/api/products/:id` | GET | 获取产品详情 |
| `/api/products` | POST | 创建产品 |
| `/api/products/:id` | PUT | 更新产品 |
| `/api/products/:id` | DELETE | 删除产品 |

初始数据包含 6 个示例产品，涵盖电子产品、服装、图书、运动等分类。

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| `@ant-design/pro-components` | ProTable、ProForm、ProDescriptions |
| `@umijs/max` | 路由、请求等 |
| `antd` | UI 组件 |
| `zod` | 类型校验和推导 |
| `styled-components` | CSS-in-JS 样式 |

## 📖 核心代码说明

### 类型定义 (`types.ts`)

使用 Zod 定义数据结构，同时用于：
- TypeScript 类型推导
- 运行时数据校验
- URL 参数解析

```typescript
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  // ...
});

export type Product = z.infer<typeof productSchema>;
```

### 列表页要点

- 使用 `useState` 管理数据（未使用 `@tanstack/react-query`）
- URL 参数驱动（支持刷新保持状态）
- 受控分页

### 表单页要点

- 新建/编辑复用同一组件
- 通过路由参数 `id` 判断模式
- Zod 校验表单数据

### 详情页要点

- ProDescriptions 三列布局
- 自定义渲染（价格、图片、标签等）
- 错误状态处理

## 🔄 路由配置

```typescript
{
  name: '产品管理',
  path: '/demo',
  routes: [
    { path: '/demo', component: './demo' },                    // 列表
    { path: '/demo/create', component: './demo/form' },        // 新建
    { path: '/demo/:id', component: './demo/detail' },         // 详情
    { path: '/demo/:id/edit', component: './demo/form' },      // 编辑
  ],
}
```

## 💡 学习要点

1. **类型安全**：Zod Schema 提供完整的类型推导和运行时校验
2. **组件复用**：表单页通过路由参数实现新建/编辑复用
3. **状态管理**：URL 参数驱动，刷新不丢失状态
4. **错误处理**：加载状态、错误提示、空数据处理
5. **用户体验**：加载动画、操作确认、成功/失败提示

## 📝 扩展建议

- [ ] 添加批量操作（批量删除、批量上架）
- [ ] 添加导入导出功能
- [ ] 添加高级筛选（价格区间、库存范围）
- [ ] 添加排序功能
- [ ] 图片上传功能
- [ ] 使用 `@tanstack/react-query` 优化数据管理
- [ ] 添加操作日志

---

Made with ❤️ for Claude Code users
