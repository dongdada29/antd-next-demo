// 模拟API服务 - 演示如何使用模拟数据
import {
  MOCK_DATA_SETS,
  MockUser,
  MockProduct,
  MockOrder,
  MockAPIResponse,
  MockPaginatedResponse,
  createSuccessResponse,
  createPaginatedResponse,
  createErrorResponse,
  mockApiCall,
  filterMockUsers,
  filterMockProducts,
  findMockUserById,
  findMockProductById,
  findMockOrderById,
} from '../lib/mockData';

// 用户相关API
export const mockUserApi = {
  // 获取用户列表
  getUsers: async (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    status?: string;
    department?: string;
  }): Promise<MockPaginatedResponse<MockUser>> => {
    const { page = 1, pageSize = 10, ...filters } = params || {};
    const filteredUsers = filterMockUsers(filters);
    const response = createPaginatedResponse(filteredUsers, page, pageSize);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    return response;
  },

  // 获取用户详情
  getUserById: async (id: number): Promise<MockAPIResponse<MockUser | null>> => {
    const user = findMockUserById(id);
    if (!user) {
      throw createErrorResponse('用户不存在', 404);
    }
    return mockApiCall(user, 200);
  },

  // 创建用户
  createUser: async (userData: Partial<MockUser>): Promise<MockAPIResponse<MockUser>> => {
    const newUser: MockUser = {
      id: Math.max(...MOCK_DATA_SETS.users.map(u => u.id)) + 1,
      name: userData.name || '新用户',
      email: userData.email || 'new@example.com',
      phone: userData.phone,
      avatar: userData.avatar,
      title: userData.title,
      department: userData.department,
      status: userData.status || 'pending',
      bio: userData.bio,
      joinDate: new Date().toISOString(),
      lastLogin: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_DATA_SETS.users.push(newUser);
    return mockApiCall(newUser, 500);
  },

  // 更新用户
  updateUser: async (id: number, userData: Partial<MockUser>): Promise<MockAPIResponse<MockUser>> => {
    const userIndex = MOCK_DATA_SETS.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw createErrorResponse('用户不存在', 404);
    }
    
    const updatedUser = {
      ...MOCK_DATA_SETS.users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_DATA_SETS.users[userIndex] = updatedUser;
    return mockApiCall(updatedUser, 400);
  },

  // 删除用户
  deleteUser: async (id: number): Promise<MockAPIResponse<boolean>> => {
    const userIndex = MOCK_DATA_SETS.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw createErrorResponse('用户不存在', 404);
    }
    
    MOCK_DATA_SETS.users.splice(userIndex, 1);
    return mockApiCall(true, 300);
  },
};

// 产品相关API
export const mockProductApi = {
  // 获取产品列表
  getProducts: async (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    category?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<MockPaginatedResponse<MockProduct>> => {
    const { page = 1, pageSize = 10, ...filters } = params || {};
    const filteredProducts = filterMockProducts(filters);
    const response = createPaginatedResponse(filteredProducts, page, pageSize);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    return response;
  },

  // 获取产品详情
  getProductById: async (id: number): Promise<MockAPIResponse<MockProduct | null>> => {
    const product = findMockProductById(id);
    if (!product) {
      throw createErrorResponse('产品不存在', 404);
    }
    return mockApiCall(product, 200);
  },

  // 创建产品
  createProduct: async (productData: Partial<MockProduct>): Promise<MockAPIResponse<MockProduct>> => {
    const newProduct: MockProduct = {
      id: Math.max(...MOCK_DATA_SETS.products.map(p => p.id)) + 1,
      name: productData.name || '新产品',
      description: productData.description || '产品描述',
      price: productData.price || 0,
      category: productData.category || '其他',
      image: productData.image,
      status: productData.status || 'draft',
      stock: productData.stock || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_DATA_SETS.products.push(newProduct);
    return mockApiCall(newProduct, 600);
  },

  // 更新产品
  updateProduct: async (id: number, productData: Partial<MockProduct>): Promise<MockAPIResponse<MockProduct>> => {
    const productIndex = MOCK_DATA_SETS.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw createErrorResponse('产品不存在', 404);
    }
    
    const updatedProduct = {
      ...MOCK_DATA_SETS.products[productIndex],
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_DATA_SETS.products[productIndex] = updatedProduct;
    return mockApiCall(updatedProduct, 500);
  },

  // 删除产品
  deleteProduct: async (id: number): Promise<MockAPIResponse<boolean>> => {
    const productIndex = MOCK_DATA_SETS.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw createErrorResponse('产品不存在', 404);
    }
    
    MOCK_DATA_SETS.products.splice(productIndex, 1);
    return mockApiCall(true, 300);
  },
};

// 订单相关API
export const mockOrderApi = {
  // 获取订单列表
  getOrders: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    userId?: number;
  }): Promise<MockPaginatedResponse<MockOrder>> => {
    const { page = 1, pageSize = 10, status, userId } = params || {};
    
    let filteredOrders = MOCK_DATA_SETS.orders;
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    if (userId) {
      filteredOrders = filteredOrders.filter(order => order.userId === userId);
    }
    
    const response = createPaginatedResponse(filteredOrders, page, pageSize);
    await new Promise(resolve => setTimeout(resolve, 350));
    return response;
  },

  // 获取订单详情
  getOrderById: async (id: number): Promise<MockAPIResponse<MockOrder | null>> => {
    const order = findMockOrderById(id);
    if (!order) {
      throw createErrorResponse('订单不存在', 404);
    }
    return mockApiCall(order, 250);
  },

  // 更新订单状态
  updateOrderStatus: async (id: number, status: MockOrder['status']): Promise<MockAPIResponse<MockOrder>> => {
    const orderIndex = MOCK_DATA_SETS.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw createErrorResponse('订单不存在', 404);
    }
    
    const updatedOrder = {
      ...MOCK_DATA_SETS.orders[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_DATA_SETS.orders[orderIndex] = updatedOrder;
    return mockApiCall(updatedOrder, 400);
  },
};

// 统计数据API
export const mockStatsApi = {
  // 获取仪表盘统计数据
  getDashboardStats: async (): Promise<MockAPIResponse<{
    totalUsers: number;
    activeUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    todayOrders: number;
  }>> => {
    const stats = {
      totalUsers: MOCK_DATA_SETS.users.length,
      activeUsers: MOCK_DATA_SETS.users.filter(u => u.status === 'active').length,
      totalProducts: MOCK_DATA_SETS.products.length,
      totalOrders: MOCK_DATA_SETS.orders.length,
      totalRevenue: MOCK_DATA_SETS.orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + order.totalAmount, 0),
      todayOrders: MOCK_DATA_SETS.orders.filter(o => {
        const today = new Date().toDateString();
        const orderDate = new Date(o.createdAt).toDateString();
        return today === orderDate;
      }).length,
    };
    
    return mockApiCall(stats, 200);
  },
};