import React from 'react';
import { useParams, useNavigate, history, useQuery } from '@umijs/max';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import type { ProDescriptionsItemProps } from '@ant-design/pro-components';
import { Button, Card, Popconfirm, Space, Spin, Tag, Typography, message, Image } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

import { routeParamsSchema } from './types';
import type { ProductDetail } from './types';

const { Text } = Typography;

// ==================== 样式 ====================
const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailCard = styled(Card)`
  .ant-descriptions-item-label {
    color: rgba(0, 0, 0, 0.45);
    width: 140px;
  }

  .ant-descriptions-item-content {
    color: rgba(0, 0, 0, 0.85);
  }
`;

const StatusTag = styled(Tag)<{ $status: string }>`
  border-radius: 10px;
  padding: 2px 12px;
  font-size: 13px;
  border: none;
  background-color: ${({ $status }) => ($status === 'on_sale' ? '#f6ffed' : '#f5f5f5')};
  color: ${({ $status }) => ($status === 'on_sale' ? '#52c41a' : '#8c8c8c')};
`;

const PriceText = styled.div`
  .current-price {
    color: #ff4d4f;
    font-size: 24px;
    font-weight: 600;
  }

  .original-price {
    text-decoration: line-through;
    color: #999;
    font-size: 14px;
    margin-left: 12px;
  }
`;

// ==================== API 请求函数 ====================
async function fetchProductDetail(id: string): Promise<ProductDetail> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error(`获取详情失败: ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || '获取详情失败');
  return data.data;
}

async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`删除失败: ${res.status}`);
}

// ==================== 主组件 ====================
const ProductDetailPage: React.FC = () => {
  const rawParams = useParams();
  const navigate = useNavigate();

  // 解析路由参数
  const parseResult = routeParamsSchema.safeParse(rawParams);
  if (!parseResult.success || !rawParams.id) {
    return <div>参数错误：缺少产品 ID</div>;
  }
  const { id } = parseResult.data;
  const productId = id || rawParams.id;

  // 使用 useQuery 获取详情
  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', 'detail', productId],
    queryFn: () => fetchProductDetail(productId!),
    enabled: !!productId,
  });

  // 错误提示
  React.useEffect(() => {
    if (error) {
      message.error((error as Error).message || '加载失败');
    }
  }, [error]);

  // 删除操作
  const [isDeleting, setIsDeleting] = React.useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(productId!);
      message.success('删除成功');
      history.push('/demo');
    } catch (err: any) {
      message.error(err.message || '删除失败');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer title="产品详情">
        <Spin
          size="large"
          style={{ display: 'flex', justifyContent: 'center', padding: 80 }}
        />
      </PageContainer>
    );
  }

  if (error || !detail) {
    return (
      <PageContainer title="产品详情">
        <Card>
          <Text type="danger">加载失败，请刷新重试</Text>
        </Card>
      </PageContainer>
    );
  }

  // ProDescriptions 列定义
  const descriptionItems: ProDescriptionsItemProps<ProductDetail>[] = [
    {
      title: '产品名称',
      dataIndex: 'name',
      span: 2,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: () => (
        <StatusTag $status={detail.status}>
          {detail.status === 'on_sale' ? '在售' : '下架'}
        </StatusTag>
      ),
    },
    {
      title: '产品图片',
      dataIndex: 'imageUrl',
      span: 3,
      render: () =>
        detail.imageUrl ? (
          <Image
            src={detail.imageUrl}
            alt={detail.name}
            width={200}
            style={{ borderRadius: 8 }}
          />
        ) : (
          <Text type="secondary">暂无图片</Text>
        ),
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: () => {
        const categoryMap: Record<string, string> = {
          electronics: '电子产品',
          clothing: '服装',
          food: '食品',
          books: '图书',
          sports: '运动',
        };
        return categoryMap[detail.category] || detail.category;
      },
    },
    {
      title: '产品描述',
      dataIndex: 'description',
      span: 3,
      render: () => detail.description || <Text type="secondary">暂无描述</Text>,
    },
    {
      title: '售价',
      dataIndex: 'price',
      render: () => (
        <PriceText>
          <span className="current-price">¥{detail.price.toFixed(2)}</span>
          {detail.originalPrice && detail.originalPrice > detail.price && (
            <span className="original-price">¥{detail.originalPrice.toFixed(2)}</span>
          )}
        </PriceText>
      ),
    },
    {
      title: '库存',
      dataIndex: 'stock',
      render: () => (
        <Text style={{ color: detail.stock < 10 ? '#ff4d4f' : undefined }}>
          {detail.stock} 件
          {detail.stock < 10 && <Text type="danger"> （库存不足）</Text>}
        </Text>
      ),
    },
    {
      title: '销量',
      dataIndex: 'salesCount',
      render: () => `${detail.salesCount} 件`,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      render: () => (
        <Space>
          <Text strong>{detail.rating.toFixed(1)}</Text>
          <Text type="secondary">/ 5.0</Text>
        </Space>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      span: 2,
      render: () => (
        <Space wrap size={4}>
          {detail.tags && detail.tags.length > 0 ? (
            detail.tags.map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))
          ) : (
            <Text type="secondary">暂无标签</Text>
          )}
        </Space>
      ),
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
  ];

  return (
    <PageContainer
      title="产品详情"
      breadcrumb={{
        items: [
          { title: '首页', path: '/' },
          { title: '产品管理', path: '/demo' },
          { title: detail.name },
        ],
      }}
      extra={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => history.back()}>
            返回
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/demo/${productId}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            description="删除后数据不可恢复，请谨慎操作"
            onConfirm={handleDelete}
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
        <DetailCard title="产品信息" variant='borderless'>
          <ProDescriptions<ProductDetail>
            dataSource={detail}
            columns={descriptionItems}
            column={3}
            bordered
          />
        </DetailCard>
      </DetailWrapper>
    </PageContainer>
  );
};

export default ProductDetailPage;
