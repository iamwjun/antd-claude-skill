# 列表页 (Table Page) 参考模板

使用 `ProTable` + `PageContainer` 创建标准列表页。

---

## 完整示例

### `types.ts`
```tsx
import { z } from 'zod'

// URL 查询参数 schema
export const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  keyword: z.string().optional(),
  status: z.enum(['active', 'inactive', 'all']).optional().default('all'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})
export type ListQuery = z.infer<typeof listQuerySchema>

// 列表项数据类型
export const resourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Resource = z.infer<typeof resourceSchema>

// API 响应
export const listResponseSchema = z.object({
  data: z.array(resourceSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})
export type ListResponse = z.infer<typeof listResponseSchema>
```

### `api.ts`
```tsx
import type { ListQuery, ListResponse, Resource } from './types'

export async function fetchResourceList(params: ListQuery): Promise<ListResponse> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') searchParams.set(k, String(v))
  })
  const res = await fetch(`/api/resources?${searchParams}`)
  if (!res.ok) throw new Error(`请求失败: ${res.status}`)
  return res.json()
}

export async function deleteResource(id: string): Promise<void> {
  const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`删除失败: ${res.status}`)
}
```

### `index.tsx`
```tsx
import React, { useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Space, Popconfirm, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'

import { listQuerySchema } from './types'
import type { ListQuery, Resource } from './types'
import { fetchResourceList, deleteResource } from './api'

// ==================== 样式 ====================
const TableWrapper = styled.div`
  .ant-pro-table-search {
    margin-bottom: 0;
  }

  .status-tag {
    min-width: 56px;
    text-align: center;
  }
`

const HeaderExtra = styled(Space)`
  .ant-btn-primary {
    border-radius: 6px;
  }
`

// ==================== Query Keys ====================
const QUERY_KEYS = {
  list: (params: ListQuery) => ['resource', 'list', params] as const,
}

// ==================== 主组件 ====================
const ResourceListPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  // 解析 URL 参数（zod safeParse 容错处理）
  const rawParams = Object.fromEntries(searchParams.entries())
  const parseResult = listQuerySchema.safeParse(rawParams)
  const params = parseResult.success
    ? parseResult.data
    : listQuerySchema.parse({})

  // 更新 URL 参数
  const updateParams = useCallback(
    (newParams: Partial<ListQuery>) => {
      const merged = { ...params, ...newParams }
      const next = new URLSearchParams()
      Object.entries(merged).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== null) {
          next.set(k, String(v))
        }
      })
      setSearchParams(next)
    },
    [params, setSearchParams]
  )

  // 查询列表数据
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.list(params),
    queryFn: () => fetchResourceList(params),
    staleTime: 30 * 1000,
  })

  // 删除操作
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['resource'] })
    },
    onError: (err: Error) => {
      message.error(err.message || '删除失败')
    },
  })

  // 表格列定义
  const columns: ProColumns<Resource>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      render: (_, record) => (
        <a onClick={() => navigate(`/resources/${record.id}`)}>{record.name}</a>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        active: { text: '启用', status: 'Success' },
        inactive: { text: '停用', status: 'Default' },
      },
      render: (_, record) => (
        <Tag
          className="status-tag"
          color={record.status === 'active' ? 'green' : 'default'}
        >
          {record.status === 'active' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      search: false,
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/resources/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            description="删除后不可恢复"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" size="small" danger loading={isDeleting}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <PageContainer
      title="资源管理"
      breadcrumb={{
        items: [
          { title: '首页', path: '/' },
          { title: '资源管理' },
        ],
      }}
      extra={
        <HeaderExtra>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/resources/create')}
          >
            新建资源
          </Button>
        </HeaderExtra>
      }
    >
      <TableWrapper>
        <ProTable<Resource>
          rowKey="id"
          columns={columns}
          dataSource={data?.data}
          loading={isLoading}
          search={{
            labelWidth: 'auto',
            defaultCollapsed: false,
          }}
          // 受控分页
          pagination={{
            current: params.page,
            pageSize: params.pageSize,
            total: data?.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => updateParams({ page, pageSize }),
          }}
          // 搜索表单提交
          onSubmit={(values) => {
            updateParams({ ...values, page: 1 })
          }}
          onReset={() => {
            setSearchParams(new URLSearchParams())
          }}
          toolBarRender={() => []}
          options={{
            reload: () => {
              queryClient.invalidateQueries({ queryKey: ['resource'] })
            },
          }}
        />
      </TableWrapper>
    </PageContainer>
  )
}

export default ResourceListPage
```

---

## ProTable 关键配置说明

| 配置项 | 说明 |
|--------|------|
| `request` vs `dataSource` | 使用 `dataSource` 配合 `useQuery` 受控，不用 `request` 回调 |
| `search` | 设置 `labelWidth: 'auto'` 自适应，`defaultCollapsed` 控制默认展开 |
| `pagination` | 受控模式，改变时调用 `updateParams` 更新 URL |
| `onSubmit` | 搜索表单提交时重置到第 1 页 |
| `options.reload` | 手动刷新时 invalidate query |
| `valueEnum` | 配合 search 时支持下拉筛选 |

## 常用 ProColumns valueType

```tsx
valueType: 'text'      // 文本输入
valueType: 'select'    // 下拉选择（配合 valueEnum）
valueType: 'date'      // 日期选择
valueType: 'dateRange' // 日期范围
valueType: 'dateTime'  // 日期时间
valueType: 'digit'     // 数字
valueType: 'textarea'  // 多行文本（搜索时不常用）
```
