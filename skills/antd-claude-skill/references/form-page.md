# 表单页 (Form Page) 参考模板

使用 `ProForm` + `PageContainer` 创建新建/编辑表单页。

---

## 完整示例

### `types.ts`
```tsx
import { z } from 'zod'

// 路由参数（编辑时有 id）
export const routeParamsSchema = z.object({
  id: z.string().optional(),
})
export type RouteParams = z.infer<typeof routeParamsSchema>

// 表单数据 schema（同时用于前端校验和类型推导）
export const resourceFormSchema = z.object({
  name: z.string().min(1, '名称不能为空').max(50, '名称不超过50字'),
  description: z.string().max(500, '描述不超过500字').optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  category: z.string().min(1, '请选择分类'),
  tags: z.array(z.string()).optional().default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  amount: z.coerce.number().min(0, '金额不能为负').optional(),
})
export type ResourceFormValues = z.infer<typeof resourceFormSchema>

// 详情响应（用于编辑时回填）
export const resourceDetailSchema = resourceFormSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type ResourceDetail = z.infer<typeof resourceDetailSchema>
```

### `api.ts`
```tsx
import type { ResourceFormValues, ResourceDetail } from './types'

export async function fetchResourceDetail(id: string): Promise<ResourceDetail> {
  const res = await fetch(`/api/resources/${id}`)
  if (!res.ok) throw new Error(`获取详情失败: ${res.status}`)
  return res.json()
}

export async function createResource(data: ResourceFormValues): Promise<ResourceDetail> {
  const res = await fetch('/api/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`创建失败: ${res.status}`)
  return res.json()
}

export async function updateResource(
  id: string,
  data: ResourceFormValues
): Promise<ResourceDetail> {
  const res = await fetch(`/api/resources/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`更新失败: ${res.status}`)
  return res.json()
}
```

### `index.tsx`
```tsx
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormCheckbox,
} from '@ant-design/pro-components'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Spin, message, Space, Button } from 'antd'
import styled from 'styled-components'

import { routeParamsSchema, resourceFormSchema } from './types'
import type { ResourceFormValues } from './types'
import { fetchResourceDetail, createResource, updateResource } from './api'

// ==================== 样式 ====================
const FormCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;

  .ant-card-body {
    padding: 32px;
  }

  .ant-pro-form-group-title {
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
`

const FooterBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: 24px;
`

// ==================== 主组件 ====================
const ResourceFormPage: React.FC = () => {
  const rawParams = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 解析路由参数
  const { id } = routeParamsSchema.parse(rawParams)
  const isEdit = Boolean(id)

  // 编辑时拉取详情数据（新建时跳过）
  const { data: detail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['resource', 'detail', id],
    queryFn: () => fetchResourceDetail(id!),
    enabled: isEdit,
    staleTime: 60 * 1000,
  })

  // 新建 mutation
  const { mutateAsync: handleCreate, isPending: isCreating } = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      message.success('创建成功')
      queryClient.invalidateQueries({ queryKey: ['resource'] })
      navigate('/resources')
    },
    onError: (err: Error) => {
      message.error(err.message || '创建失败')
    },
  })

  // 编辑 mutation
  const { mutateAsync: handleUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (data: ResourceFormValues) => updateResource(id!, data),
    onSuccess: () => {
      message.success('更新成功')
      queryClient.invalidateQueries({ queryKey: ['resource'] })
      navigate('/resources')
    },
    onError: (err: Error) => {
      message.error(err.message || '更新失败')
    },
  })

  const isSubmitting = isCreating || isUpdating

  // 表单提交（使用 zod 做最终校验）
  const handleFinish = async (values: Record<string, unknown>) => {
    const parseResult = resourceFormSchema.safeParse(values)
    if (!parseResult.success) {
      message.error('表单数据校验失败，请检查输入')
      console.error(parseResult.error.flatten())
      return false
    }
    if (isEdit) {
      await handleUpdate(parseResult.data)
    } else {
      await handleCreate(parseResult.data)
    }
    return true
  }

  if (isEdit && isDetailLoading) {
    return (
      <PageContainer title={isEdit ? '编辑资源' : '新建资源'}>
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', padding: 80 }} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={isEdit ? '编辑资源' : '新建资源'}
      breadcrumb={{
        items: [
          { title: '首页', path: '/' },
          { title: '资源管理', path: '/resources' },
          { title: isEdit ? '编辑' : '新建' },
        ],
      }}
    >
      <FormCard bordered={false}>
        <ProForm
          layout="vertical"
          // 编辑时回填初始值
          initialValues={
            isEdit && detail
              ? {
                  ...detail,
                  // 日期范围字段需要特殊处理
                  dateRange:
                    detail.startDate && detail.endDate
                      ? [detail.startDate, detail.endDate]
                      : undefined,
                }
              : { status: 'active', tags: [] }
          }
          onFinish={handleFinish}
          submitter={false} // 禁用默认提交按钮，使用自定义 FooterBar
        >
          {/* 基本信息分组 */}
          <ProForm.Group title="基本信息">
            <ProFormText
              name="name"
              label="名称"
              placeholder="请输入名称"
              rules={[{ required: true, message: '名称不能为空' }]}
              fieldProps={{ maxLength: 50, showCount: true }}
              width="lg"
            />
            <ProFormSelect
              name="category"
              label="分类"
              placeholder="请选择分类"
              rules={[{ required: true, message: '请选择分类' }]}
              options={[
                { label: '分类A', value: 'a' },
                { label: '分类B', value: 'b' },
                { label: '分类C', value: 'c' },
              ]}
              width="md"
            />
          </ProForm.Group>

          <ProForm.Group title="详细配置">
            <ProFormTextArea
              name="description"
              label="描述"
              placeholder="请输入描述（选填）"
              fieldProps={{ maxLength: 500, showCount: true, rows: 4 }}
              width="xl"
            />
            <ProFormSelect
              name="status"
              label="状态"
              options={[
                { label: '启用', value: 'active' },
                { label: '停用', value: 'inactive' },
              ]}
              width="sm"
            />
          </ProForm.Group>

          <ProForm.Group title="其他信息">
            <ProFormDateRangePicker
              name="dateRange"
              label="有效期"
              fieldProps={{
                format: 'YYYY-MM-DD',
              }}
            />
            <ProFormDigit
              name="amount"
              label="金额"
              placeholder="请输入金额"
              min={0}
              fieldProps={{ precision: 2, prefix: '¥' }}
              width="md"
            />
          </ProForm.Group>

          <FooterBar>
            <Button onClick={() => navigate(-1)}>取消</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {isEdit ? '保存修改' : '立即创建'}
            </Button>
          </FooterBar>
        </ProForm>
      </FormCard>
    </PageContainer>
  )
}

export default ResourceFormPage
```

---

## ProForm 字段速查表

| 组件 | 用途 | 关键 props |
|------|------|-----------|
| `ProFormText` | 单行文本 | `fieldProps.maxLength`, `fieldProps.showCount` |
| `ProFormTextArea` | 多行文本 | `fieldProps.rows` |
| `ProFormSelect` | 下拉选择 | `options`, `mode="multiple"` 多选 |
| `ProFormDigit` | 数字输入 | `min`, `max`, `fieldProps.precision` |
| `ProFormDatePicker` | 日期 | `fieldProps.format` |
| `ProFormDateRangePicker` | 日期范围 | `fieldProps.format` |
| `ProFormSwitch` | 开关 | - |
| `ProFormCheckbox` | 复选框 | `options` |
| `ProFormRadio` | 单选 | `options` |
| `ProFormUploadButton` | 文件上传 | `action`, `max` |

## 表单宽度规范

```tsx
width="xs"  // 104px
width="sm"  // 216px
width="md"  // 328px
width="lg"  // 440px
width="xl"  // 552px
```

## 新建/编辑复用策略

- 通过路由参数 `id` 是否存在区分新建/编辑
- 编辑时用 `useQuery` 获取详情，设置 `enabled: isEdit`
- `initialValues` 根据 `isEdit` 动态设置
- 提交时调用不同 mutation（createXxx / updateXxx）
