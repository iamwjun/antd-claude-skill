import React from 'react';
import { useParams, useNavigate, history, useQuery } from '@umijs/max';
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormDigit,
  ProFormRadio,
} from '@ant-design/pro-components';
import { Card, Spin, message, Button } from 'antd';
import styled from 'styled-components';

import { routeParamsSchema, productFormSchema } from './types';
import type { ProductFormValues, ProductDetail } from './types';

// ==================== 样式 ====================
const FormCard = styled(Card)`
  max-width: 900px;
  margin: 0 auto;

  .ant-card-body {
    padding: 32px;
  }

  .ant-pro-form-group-title {
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 16px;
  }
`;

const FooterBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: 24px;
`;

// ==================== API 请求函数 ====================
async function fetchProductDetail(id: string): Promise<ProductDetail> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error(`获取详情失败: ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || '获取详情失败');
  return data.data;
}

async function createProduct(data: ProductFormValues): Promise<ProductDetail> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`创建失败: ${res.status}`);
  const result = await res.json();
  if (!result.success) throw new Error(result.message || '创建失败');
  return result.data;
}

async function updateProduct(id: string, data: ProductFormValues): Promise<ProductDetail> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`更新失败: ${res.status}`);
  const result = await res.json();
  if (!result.success) throw new Error(result.message || '更新失败');
  return result.data;
}

// ==================== 主组件 ====================
const ProductFormPage: React.FC = () => {
  const rawParams = useParams();
  const navigate = useNavigate();

  // 解析路由参数
  const { id } = routeParamsSchema.parse(rawParams);
  const isEdit = Boolean(id);

  // 使用 useQuery 编辑时拉取详情数据
  const {
    data: detail,
    isLoading: isDetailLoading,
    error,
  } = useQuery({
    queryKey: ['product', 'detail', id],
    queryFn: () => fetchProductDetail(id!),
    enabled: isEdit && !!id,
  });

  // 错误提示
  React.useEffect(() => {
    if (error) {
      message.error((error as Error).message || '加载失败');
    }
  }, [error]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // 表单提交
  const handleFinish = async (values: Record<string, any>) => {
    const parseResult = productFormSchema.safeParse(values);
    if (!parseResult.success) {
      message.error('表单数据校验失败，请检查输入');
      console.error(parseResult.error.flatten());
      return false;
    }

    setIsSubmitting(true);
    try {
      if (isEdit && id) {
        await updateProduct(id, parseResult.data);
        message.success('更新成功');
      } else {
        await createProduct(parseResult.data);
        message.success('创建成功');
      }
      history.back();
      return true;
    } catch (error: any) {
      message.error(error.message || '操作失败');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isDetailLoading) {
    return (
      <PageContainer title={isEdit ? '编辑产品' : '新建产品'}>
        <Spin
          size="large"
          style={{ display: 'flex', justifyContent: 'center', padding: 80 }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={isEdit ? '编辑产品' : '新建产品'}
      breadcrumb={{
        items: [
          { title: '首页', path: '/' },
          { title: '产品管理', path: '/demo' },
          { title: isEdit ? '编辑' : '新建' },
        ],
      }}
    >
      <FormCard variant='borderless'>
        <ProForm
          layout="vertical"
          initialValues={
            isEdit && detail
              ? {
                  name: detail.name,
                  description: detail.description,
                  price: detail.price,
                  originalPrice: detail.originalPrice,
                  stock: detail.stock,
                  category: detail.category,
                  brand: detail.brand,
                  status: detail.status,
                  imageUrl: detail.imageUrl,
                  tags: detail.tags,
                }
              : {
                  status: 'on_sale',
                  tags: [],
                  stock: 0,
                }
          }
          onFinish={handleFinish}
          submitter={false}
        >
          {/* 基本信息 */}
          <ProForm.Group title="基本信息">
            <ProFormText
              name="name"
              label="产品名称"
              placeholder="请输入产品名称"
              rules={[{ required: true, message: '产品名称不能为空' }]}
              fieldProps={{ maxLength: 100, showCount: true }}
              width="xl"
            />
            <ProFormText
              name="brand"
              label="品牌"
              placeholder="请输入品牌"
              rules={[{ required: true, message: '品牌不能为空' }]}
              width="md"
            />
            <ProFormSelect
              name="category"
              label="分类"
              placeholder="请选择分类"
              rules={[{ required: true, message: '请选择分类' }]}
              options={[
                { label: '电子产品', value: 'electronics' },
                { label: '服装', value: 'clothing' },
                { label: '食品', value: 'food' },
                { label: '图书', value: 'books' },
                { label: '运动', value: 'sports' },
              ]}
              width="md"
            />
          </ProForm.Group>

          {/* 详细信息 */}
          <ProForm.Group title="详细信息">
            <ProFormTextArea
              name="description"
              label="产品描述"
              placeholder="请输入产品描述（选填）"
              fieldProps={{ maxLength: 1000, showCount: true, rows: 4 }}
              width="xl"
            />
            <ProFormText
              name="imageUrl"
              label="产品图片URL"
              placeholder="请输入图片URL（选填）"
              width="xl"
            />
          </ProForm.Group>

          {/* 价格与库存 */}
          <ProForm.Group title="价格与库存">
            <ProFormDigit
              name="price"
              label="售价"
              placeholder="请输入售价"
              rules={[{ required: true, message: '售价不能为空' }]}
              min={0.01}
              fieldProps={{ precision: 2, prefix: '¥' }}
              width="md"
            />
            <ProFormDigit
              name="originalPrice"
              label="原价"
              placeholder="请输入原价（选填）"
              min={0}
              fieldProps={{ precision: 2, prefix: '¥' }}
              width="md"
            />
            <ProFormDigit
              name="stock"
              label="库存"
              placeholder="请输入库存"
              rules={[{ required: true, message: '库存不能为空' }]}
              min={0}
              fieldProps={{ precision: 0 }}
              width="md"
            />
          </ProForm.Group>

          {/* 状态 */}
          <ProForm.Group title="产品状态">
            <ProFormRadio.Group
              name="status"
              label="销售状态"
              options={[
                { label: '在售', value: 'on_sale' },
                { label: '下架', value: 'off_sale' },
              ]}
            />
          </ProForm.Group>

          <FooterBar>
            <Button onClick={() => history.back()}>取消</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {isEdit ? '保存修改' : '立即创建'}
            </Button>
          </FooterBar>
        </ProForm>
      </FormCard>
    </PageContainer>
  );
};

export default ProductFormPage;
