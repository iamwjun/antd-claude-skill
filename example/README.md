# Antd Claude Skill - Example Project

这是 `antd-claude-skill` 的示例项目，展示如何使用 Ant Design Pro Components 快速构建后台管理页面。

## 📖 项目说明

本示例基于 UmiJS 4 + Ant Design Pro Components，实现了一个完整的产品管理 CRUD 系统。

## 🚀 快速开始

### 1. 安装依赖

在项目根目录运行：

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev:example
```

或者在 example 目录下运行：

```bash
cd example
npm run dev
```

### 3. 访问应用

打开浏览器访问：http://localhost:8000

## 📁 目录结构

```
example/
├── src/
│   └── pages/
│       ├── demo/              # 产品管理示例 ⭐
│       │   ├── types.ts       # 类型定义
│       │   ├── index.tsx      # 列表页
│       │   ├── form.tsx       # 表单页
│       │   ├── detail.tsx     # 详情页
│       │   └── README.md      # 详细说明
│       ├── Home/              # 首页
│       ├── Access/            # 权限演示
│       └── Table/             # CRUD 示例
├── mock/
│   ├── productAPI.ts          # 产品 API Mock ⭐
│   └── userAPI.ts             # 用户 API Mock
├── .umirc.ts                  # UmiJS 配置
└── package.json
```

## ✨ 示例功能

### 产品管理 (`/demo`)

完整的 CRUD 功能展示：

- **列表页**：分页、搜索、筛选、排序
- **新建页**：表单验证、数据提交
- **编辑页**：数据回填、更新
- **详情页**：信息展示、操作按钮

详细说明请查看：[`src/pages/demo/README.md`](./src/pages/demo/README.md)

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| `@umijs/max` | ^4.6.38 | React 应用框架 |
| `antd` | ^5.4.0 | UI 组件库 |
| `@ant-design/pro-components` | ^2.4.4 | ProTable、ProForm 等高级组件 |
| `styled-components` | ^6.1.0 | CSS-in-JS |
| `zod` | ^3.22.0 | 类型校验 |

## 📚 学习资源

### 示例代码位置

- 列表页：[`src/pages/demo/index.tsx`](./src/pages/demo/index.tsx)
- 表单页：[`src/pages/demo/form.tsx`](./src/pages/demo/form.tsx)
- 详情页：[`src/pages/demo/detail.tsx`](./src/pages/demo/detail.tsx)
- Mock API：[`mock/productAPI.ts`](./mock/productAPI.ts)

### 参考模板

项目基于 [`skills/pro-components-page/references/`](../skills/pro-components-page/references/) 目录下的模板创建：

- `table-page.md` - 列表页模板
- `form-page.md` - 表单页模板
- `detail-page.md` - 详情页模板

### 官方文档

- [Ant Design](https://ant.design/)
- [Pro Components](https://procomponents.ant.design/)
- [UmiJS](https://umijs.org/)

## 💡 开发提示

### Mock 数据

Mock 数据会在开发模式下自动启用，无需额外配置。

Mock API 文件位于 `mock/` 目录，修改后会自动重新加载。

### 路由配置

路由在 `.umirc.ts` 中配置：

```typescript
routes: [
  {
    name: '产品管理',
    path: '/demo',
    routes: [
      { path: '/demo', component: './demo' },
      { path: '/demo/create', component: './demo/form' },
      { path: '/demo/:id', component: './demo/detail' },
      { path: '/demo/:id/edit', component: './demo/form' },
    ],
  },
]
```

### 添加新页面

1. 在 `src/pages/` 创建新目录
2. 创建组件文件（`index.tsx`）
3. 在 `.umirc.ts` 添加路由配置
4. （可选）在 `mock/` 添加 API Mock

## 🔧 可用脚本

在 example 目录下：

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run format   # 格式化代码
```

在根目录下：

```bash
npm run dev:example  # 启动示例项目
```

## 📝 注意事项

1. **依赖管理**：example 的依赖在根目录的 `package.json` 中统一管理（devDependencies）
2. **Node 版本**：建议使用 Node.js 16+ 
3. **端口占用**：默认端口 8000，如被占用会自动使用其他端口

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT
