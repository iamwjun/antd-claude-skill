import React, { useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from '@umijs/max';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Space, Popconfirm, Tag, message, Image } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { productListQuerySchema } from './types';
import type { ProductListQuery, Product } from './types';

// ==================== 样式 ====================
const TableWrapper = styled.div`
  .ant-pro-table-search {
    margin-bottom: 0;
  }

  .status-tag {
    min-width: 56px;
    text-align: center;
  }

  .price-text {
    color: #ff4d4f;
    font-weight: 600;
    font-size: 14px;
  }

  .original-price {
    text-decoration: line-through;
    color: #999;
    font-size: 12px;
    margin-left: 8px;
  }
`;

const HeaderExtra = styled(Space)`
  .ant-btn-primary {
    border-radius: 6px;
  }
`;

// ==================== API 请求函数 ====================
async function fetchProductList(params: ProductListQuery) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== 'all') {
      searchParams.set(k, String(v));
    }
  });

  const res = await fetch(`/api/products?${searchParams}`);
  if (!res.ok) throw new Error(`请求失败: ${res.status}`);
  const data = await res.json();
  return data;
}

async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`删除失败: ${res.status}`);
}

// ==================== 主组件 ====================
const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const actionRef = useRef<ActionType>();

  // 删除操作
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // ProTable 数据请求
  const request = async (params: any, sort: any, filter: any) => {
    try {
      const { current, pageSize, ...restParams } = params;

      // 构建查询参数
      const queryParams = {
        page: current || 1,
        pageSize: pageSize || 20,
        ...restParams,
      };

      const response = await fetchProductList(queryParams);

      if (response.success) {
        return {
          data: response.data.list,
          success: true,
          total: response.data.total,
        };
      }

      return {
        data: [],
        success: false,
        total: 0,
      };
    } catch (error) {
      message.error('加载数据失败');
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 表格列定义
  const columns: ProColumns<Product>[] = [
    {
      title: '产品图片',
      dataIndex: 'imageUrl',
      search: false,
      width: 100,
      render: (_, record) =>
        record.imageUrl ? (
          <Image
            src={record.imageUrl}
            alt={record.name}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={false}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              background: '#f0f0f0',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
            }}
          >
            暂无图片
          </div>
        ),
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      ellipsis: true,
      render: (_, record) => (
        <a onClick={() => navigate(`/demo/${record.id}`)}>{record.name}</a>
      ),
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      width: 120,
    },
    {
      title: '分类',
      dataIndex: 'category',
      valueType: 'select',
      width: 120,
      valueEnum: {
        electronics: { text: '电子产品' },
        clothing: { text: '服装' },
        food: { text: '食品' },
        books: { text: '图书' },
        sports: { text: '运动' },
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      search: false,
      width: 150,
      render: (_, record) => (
        <div>
          <span className="price-text">¥{record.price.toFixed(2)}</span>
          {record.originalPrice && record.originalPrice > record.price && (
            <span className="original-price">¥{record.originalPrice.toFixed(2)}</span>
          )}
        </div>
      ),
    },
    {
      title: '库存',
      dataIndex: 'stock',
      search: false,
      width: 100,
      render: (_, record) => (
        <span style={{ color: record.stock < 10 ? '#ff4d4f' : undefined }}>
          {record.stock}
        </span>
      ),
    },
    {
      title: '销量',
      dataIndex: 'salesCount',
      search: false,
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      width: 100,
      valueEnum: {
        on_sale: { text: '在售', status: 'Success' },
        off_sale: { text: '下架', status: 'Default' },
      },
      render: (_, record) => (
        <Tag className="status-tag" color={record.status === 'on_sale' ? 'green' : 'default'}>
          {record.status === 'on_sale' ? '在售' : '下架'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/demo/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/demo/${record.id}/edit`)}
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
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="产品管理"
      breadcrumb={{
        items: [{ title: '首页', path: '/' }, { title: '产品管理' }],
      }}
      extra={
        <HeaderExtra>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/demo/create')}
          >
            新建产品
          </Button>
        </HeaderExtra>
      }
    >
      <TableWrapper>
        <ProTable<Product>
          rowKey="id"
          columns={columns}
          actionRef={actionRef}
          request={request}
          search={{
            labelWidth: 'auto',
            defaultCollapsed: false,
          }}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          toolBarRender={() => []}
          options={{
            reload: true,
          }}
        />
      </TableWrapper>
    </PageContainer>
  );
};

export default ProductListPage;
