import { z } from 'zod';

// ==================== 列表页类型 ====================

// URL 查询参数 schema
export const productListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  keyword: z.string().optional(),
  status: z.enum(['on_sale', 'off_sale', 'all']).optional().default('all'),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});
export type ProductListQuery = z.infer<typeof productListQuerySchema>;

// 产品列表项数据类型
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  originalPrice: z.number().optional(),
  stock: z.number(),
  category: z.string(),
  brand: z.string(),
  status: z.enum(['on_sale', 'off_sale']),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).default([]),
  salesCount: z.number().default(0),
  rating: z.number().min(0).max(5).default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Product = z.infer<typeof productSchema>;

// API 响应
export const productListResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    list: z.array(productSchema),
    total: z.number(),
  }),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});
export type ProductListResponse = z.infer<typeof productListResponseSchema>;

// ==================== 表单页类型 ====================

// 路由参数（编辑时有 id）
export const routeParamsSchema = z.object({
  id: z.string().optional(),
});
export type RouteParams = z.infer<typeof routeParamsSchema>;

// 表单数据 schema
export const productFormSchema = z.object({
  name: z.string().min(1, '产品名称不能为空').max(100, '名称不超过100字'),
  description: z.string().max(1000, '描述不超过1000字').optional(),
  price: z.coerce.number().min(0.01, '价格必须大于0'),
  originalPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0, '库存不能为负'),
  category: z.string().min(1, '请选择分类'),
  brand: z.string().min(1, '请输入品牌'),
  status: z.enum(['on_sale', 'off_sale']).default('on_sale'),
  imageUrl: z.string().url('请输入有效的图片URL').optional(),
  tags: z.array(z.string()).optional().default([]),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;

// 详情响应（用于编辑时回填）
export const productDetailSchema = productFormSchema.extend({
  id: z.string(),
  salesCount: z.number().default(0),
  rating: z.number().min(0).max(5).default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ProductDetail = z.infer<typeof productDetailSchema>;

// ==================== 通用响应类型 ====================

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  errorCode: z.number().optional(),
});
export type ApiResponse = z.infer<typeof apiResponseSchema>;
