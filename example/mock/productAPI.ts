// 模拟产品数据
let mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'Apple 最新旗舰手机，搭载 A17 Pro 芯片，钛金属边框，全新相机系统',
    price: 9999,
    originalPrice: 10999,
    stock: 50,
    category: 'electronics',
    brand: 'Apple',
    status: 'on_sale',
    imageUrl: 'https://picsum.photos/300/300?random=1',
    tags: ['5G', '高端旗舰', '热销'],
    salesCount: 1250,
    rating: 4.8,
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-03-20 14:20:00',
  },
  {
    id: '2',
    name: 'MacBook Pro 16英寸',
    description: '强大的 M3 Max 芯片，适合专业创作者和开发者',
    price: 19999,
    originalPrice: 21999,
    stock: 30,
    category: 'electronics',
    brand: 'Apple',
    status: 'on_sale',
    imageUrl: 'https://picsum.photos/300/300?random=2',
    tags: ['高性能', '专业工具'],
    salesCount: 680,
    rating: 4.9,
    createdAt: '2024-02-01 09:00:00',
    updatedAt: '2024-03-18 11:15:00',
  },
  {
    id: '3',
    name: 'AirPods Pro 2代',
    description: '主动降噪无线耳机，支持空间音频',
    price: 1899,
    stock: 8,
    category: 'electronics',
    brand: 'Apple',
    status: 'on_sale',
    imageUrl: 'https://picsum.photos/300/300?random=3',
    tags: ['降噪', '无线'],
    salesCount: 2350,
    rating: 4.7,
    createdAt: '2024-01-20 14:00:00',
    updatedAt: '2024-03-22 16:30:00',
  },
  {
    id: '4',
    name: 'Nike Air Jordan 1',
    description: '经典篮球鞋，复古设计，舒适耐穿',
    price: 1299,
    originalPrice: 1499,
    stock: 120,
    category: 'sports',
    brand: 'Nike',
    status: 'on_sale',
    imageUrl: 'https://picsum.photos/300/300?random=4',
    tags: ['篮球', '经典', '限量'],
    salesCount: 890,
    rating: 4.6,
    createdAt: '2024-02-10 10:00:00',
    updatedAt: '2024-03-15 09:45:00',
  },
  {
    id: '5',
    name: '《人类简史》',
    description: '尤瓦尔·赫拉利经典历史著作，全球畅销书',
    price: 68,
    stock: 200,
    category: 'books',
    brand: '中信出版社',
    status: 'on_sale',
    imageUrl: 'https://picsum.photos/300/300?random=5',
    tags: ['历史', '畅销书', '推荐'],
    salesCount: 15600,
    rating: 4.9,
    createdAt: '2024-01-05 08:00:00',
    updatedAt: '2024-03-10 10:20:00',
  },
  {
    id: '6',
    name: 'Uniqlo 羊毛衫',
    description: '100%美利奴羊毛，保暖舒适，多色可选',
    price: 299,
    originalPrice: 399,
    stock: 0,
    category: 'clothing',
    brand: 'Uniqlo',
    status: 'off_sale',
    imageUrl: 'https://picsum.photos/300/300?random=6',
    tags: ['保暖', '羊毛'],
    salesCount: 3200,
    rating: 4.5,
    createdAt: '2023-11-01 10:00:00',
    updatedAt: '2024-03-01 15:00:00',
  },
];

// 生成唯一 ID
let idCounter = mockProducts.length + 1;

export default {
  // 获取产品列表
  'GET /api/products': (req: any, res: any) => {
    const { page = 1, pageSize = 20, keyword, status, category } = req.query;

    let filteredProducts = [...mockProducts];

    // 关键词搜索
    if (keyword) {
      const kw = String(keyword).toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p.description?.toLowerCase().includes(kw) ||
          p.brand.toLowerCase().includes(kw),
      );
    }

    // 状态筛选
    if (status && status !== 'all') {
      filteredProducts = filteredProducts.filter((p) => p.status === status);
    }

    // 分类筛选
    if (category) {
      filteredProducts = filteredProducts.filter((p) => p.category === category);
    }

    // 分页
    const pageNum = Number(page);
    const size = Number(pageSize);
    const total = filteredProducts.length;
    const start = (pageNum - 1) * size;
    const end = start + size;
    const list = filteredProducts.slice(start, end);

    res.json({
      success: true,
      data: {
        list,
        total,
      },
      page: pageNum,
      pageSize: size,
    });
  },

  // 获取产品详情
  'GET /api/products/:id': (req: any, res: any) => {
    const { id } = req.params;
    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在',
        errorCode: 404,
      });
    }

    res.json({
      success: true,
      data: product,
    });
  },

  // 创建产品
  'POST /api/products': (req: any, res: any) => {
    const newProduct = {
      id: String(idCounter++),
      ...req.body,
      salesCount: 0,
      rating: 0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    mockProducts.unshift(newProduct);

    res.json({
      success: true,
      data: newProduct,
      message: '创建成功',
    });
  },

  // 更新产品
  'PUT /api/products/:id': (req: any, res: any) => {
    const { id } = req.params;
    const index = mockProducts.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '产品不存在',
        errorCode: 404,
      });
    }

    const updatedProduct = {
      ...mockProducts[index],
      ...req.body,
      id, // 保持 ID 不变
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    mockProducts[index] = updatedProduct;

    res.json({
      success: true,
      data: updatedProduct,
      message: '更新成功',
    });
  },

  // 删除产品
  'DELETE /api/products/:id': (req: any, res: any) => {
    const { id } = req.params;
    const index = mockProducts.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '产品不存在',
        errorCode: 404,
      });
    }

    mockProducts.splice(index, 1);

    res.json({
      success: true,
      message: '删除成功',
    });
  },
};
