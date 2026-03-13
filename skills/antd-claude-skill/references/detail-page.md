# 详情页 (Detail Page) 参考模板

使用 `ProDescriptions` + `PageContainer` 创建详情展示页。

---

## 完整示例

### `types.ts`
```tsx
import { z } from 'zod'

// 路由参数
export const routeParamsSchema = z.object({
  id: z.string().min(1, 'id 不能为空'),
})
export type RouteParams = z.infer<typeof routeParamsSchema>

// 详情数据
export const resourceDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  category: z.string(),
  amount: z.number().optional(),
  tags: z.array(z.string()).default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type ResourceDetail = z.infer<typeof resourceDetailSchema>

// 操作日志（示例关联数据）
export const operationLogSchema = z.object({
  id: z.string(),
  action: z.string(),
  operator: z.string(),
  operatedAt: z.string(),
  remark: z.string().optional(),
})
export type OperationLog = z.infer<typeof operationLogSchema>
```

### `api.ts`
```tsx
import type { ResourceDetail, OperationLog } from './types'

export async function fetchResourceDetail(id: string): Promise<ResourceDetail> {
  const res = await fetch(`/api/resources/${id}`)
  if (!res.ok) throw new Error(`获取详情失败: ${res.status}`)
  return res.json()
}

export async function fetchOperationLogs(id: string): Promise<OperationLog[]> {
  const res = await fetch(`/api/resources/${id}/logs`)
  if (!res.ok) throw new Error(`获取日志失败: ${res.status}`)
  return res.json()
}

export async function deleteResource(id: string): Promise<void> {
  const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`删除失败: ${res.status}`)
}
```

### `index.tsx`
```tsx
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components'
import type { ProDescriptionsItemProps, ProColumns } from '@ant-design/pro-components'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Popconfirm, Space, Spin, Tag, Typography, message } from 'antd'
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import dayjs from 'dayjs'

import { routeParamsSchema } from './types'
import type { ResourceDetail, OperationLog } from './types'
import { fetchResourceDetail, fetchOperationLogs, deleteResource } from './api'

const { Text } = Typography

// ==================== 样式 ====================
const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const DetailCard = styled(Card)`
  .ant-descriptions-item-label {
    color: rgba(0, 0, 0, 0.45);
    width: 120px;
  }

  .ant-descriptions-item-content {
    color: rgba(0, 0, 0, 0.85);
  }
`

const LogCard = styled(Card)`
  .ant-pro-table-search {
    display: none; /* 日志表格不需要搜索栏 */
  }
`

const StatusTag = styled(Tag)<{ $status: string }>`
  border-radius: 10px;
  padding: 0 10px;
  font-size: 12px;
  border: none;
  background-color: ${({ $status }) =>
    $status === 'active' ? '#f6ffed' : '#f5f5f5'};
  color: ${({ $status }) =>
    $status === 'active' ? '#52c41a' : '#8c8c8c'};
`

// ==================== 操作日志列定义 ====================
const logColumns: ProColumns<OperationLog>[] = [
  {
    title: '操作',
    dataIndex: 'action',
    width: 120,
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    width: 100,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true,
    render: (_, record) => record.remark || <Text type="secondary">-</Text>,
  },
  {
    title: '操作时间',
    dataIndex: 'operatedAt',
    width: 180,
    render: (_, record) => dayjs(record.operatedAt).format('YYYY-MM-DD HH:mm:ss'),
  },
]

// ==================== 主组件 ====================
const ResourceDetailPage: React.FC = () => {
  const rawParams = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 解析路由参数
  const parseResult = routeParamsSchema.safeParse(rawParams)
  if (!parseResult.success) {
    return <div>参数错误：缺少资源 ID</div>
  }
  const { id } = parseResult.data

  // 获取详情
  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['resource', 'detail', id],
    queryFn: () => fetchResourceDetail(id),
    staleTime: 60 * 1000,
    retry: 1,
  })

  // 获取操作日志（并行请求）
  const { data: logs = [], isLoading: isLogsLoading } = useQuery({
    queryKey: ['resource', 'logs', id],
    queryFn: () => fetchOperationLogs(id),
    staleTime: 30 * 1000,
  })

  // 删除操作
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteResource(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['resource'] })
      navigate('/resources')
    },
    onError: (err: Error) => {
      message.error(err.message || '删除失败')
    },
  })

  if (isLoading) {
    return (
      <PageContainer title="资源详情">
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', padding: 80 }} />
      </PageContainer>
    )
  }

  if (error || !detail) {
    return (
      <PageContainer title="资源详情">
        <Card>
          <Text type="danger">加载失败，请刷新重试</Text>
        </Card>
      </PageContainer>
    )
  }

  // ProDescriptions 列定义
  const descriptionItems: ProDescriptionsItemProps<ResourceDetail>[] = [
    {
      title: '资源名称',
      dataIndex: 'name',
      span: 2,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: () => (
        <StatusTag $status={detail.status}>
          {detail.status === 'active' ? '启用' : '停用'}
        </StatusTag>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
    },
    {
      title: '描述',
      dataIndex: 'description',
      span: 3,
      render: () => detail.description || <Text type="secondary">暂无描述</Text>,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      render: () =>
        detail.amount != null ? (
          <Text strong style={{ color: '#f5222d' }}>
            ¥{detail.amount.toFixed(2)}
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: () => (
        <Space wrap size={4}>
          {detail.tags.length > 0
            ? detail.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
            : <Text type="secondary">-</Text>}
        </Space>
      ),
    },
    {
      title: '有效期',
      render: () =>
        detail.startDate && detail.endDate
          ? `${detail.startDate} 至 ${detail.endDate}`
          : <Text type="secondary">-</Text>,
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
    },
  ]

  return (
    <PageContainer
      title="资源详情"
      breadcrumb={{
        items: [
          { title: '首页', path: '/' },
          { title: '资源管理', path: '/resources' },
          { title: detail.name },
        ],
      }}
      extra={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/resources/${id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            description="删除后数据不可恢复，请谨慎操作"
            onConfirm={() => handleDelete()}
            okText="确认删除"
            okButtonProps={{ danger: true }}
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      }
    >
      <DetailWrapper>
        {/* 基本信息 */}
        <DetailCard title="基本信息" bordered={false}>
          <ProDescriptions<ResourceDetail>
            dataSource={detail}
            columns={descriptionItems}
            column={3}
            bordered
          />
        </DetailCard>

        {/* 操作日志 */}
        <LogCard title="操作记录" bordered={false}>
          <ProTable<OperationLog>
            rowKey="id"
            columns={logColumns}
            dataSource={logs}
            loading={isLogsLoading}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            search={false}
            options={false}
            toolBarRender={false}
          />
        </LogCard>
      </DetailWrapper>
    </PageContainer>
  )
}

export default ResourceDetailPage
```

---

## ProDescriptions 关键配置

| 配置项 | 说明 |
|--------|------|
| `column` | 每行列数，通常 2-3 |
| `bordered` | 显示边框，更清晰 |
| `span` | 某一项占几列（默认 1） |
| `valueType` | 同 ProTable，自动格式化 |
| `render` | 自定义渲染，覆盖 valueType |
| `dataSource` | 直接传入数据对象 |

## 详情页并行请求模式

详情页通常需要加载多个关联数据，使用多个 `useQuery` 并行发起：

```tsx
// 这两个请求会并行发出，不会串行等待
const { data: detail } = useQuery({ queryKey: ['detail', id], ... })
const { data: logs } = useQuery({ queryKey: ['logs', id], ... })
const { data: related } = useQuery({ queryKey: ['related', id], ... })
```

## 错误与加载状态处理

```tsx
// 主数据加载中 → 全页 Spin
if (isLoading) return <PageContainer><Spin /></PageContainer>

// 主数据加载失败 → 错误提示
if (error || !detail) return <PageContainer><ErrorCard /></PageContainer>

// 关联数据（日志等）加载中 → 局部 loading，不影响主内容显示
```
