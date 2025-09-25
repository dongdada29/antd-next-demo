// 模拟数据生成工具

export interface MockUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  title?: string;
  department?: string;
  status: 'active' | 'inactive' | 'pending';
  bio?: string;
  joinDate: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  status: 'active' | 'inactive' | 'draft';
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface MockOrder {
  id: number;
  orderNo: string;
  userId: number;
  userName: string;
  products: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// 随机生成工具函数
const randomInt = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomChoice = <T>(array: T[]): T => 
  array[Math.floor(Math.random() * array.length)];

const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
};

// 姓名数据
const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
const lastNames = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明'];

const generateName = (): string => {
  const firstName = randomChoice(firstNames);
  const lastName = randomChoice(lastNames);
  const lastName2 = Math.random() > 0.5 ? randomChoice(lastNames) : '';
  return firstName + lastName + lastName2;
};

// 邮箱生成
const emailDomains = ['gmail.com', 'qq.com', '163.com', 'sina.com', 'outlook.com'];
const generateEmail = (name: string): string => {
  const domain = randomChoice(emailDomains);
  const username = name.toLowerCase() + randomInt(100, 999);
  return `${username}@${domain}`;
};

// 手机号生成
const generatePhone = (): string => {
  const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139'];
  const prefix = randomChoice(prefixes);
  const suffix = Array.from({ length: 8 }, () => randomInt(0, 9)).join('');
  return prefix + suffix;
};

// 用户数据生成器
export const generateMockUsers = (count: number = 10): MockUser[] => {
  const departments = ['技术部', '产品部', '运营部', '市场部', '人事部', '财务部'];
  const titles = ['工程师', '产品经理', '运营专员', '市场专员', '人事专员', '财务专员'];
  const statuses: MockUser['status'][] = ['active', 'inactive', 'pending'];
  
  return Array.from({ length: count }, (_, index) => {
    const name = generateName();
    const joinDate = randomDate(new Date(2020, 0, 1), new Date());
    const createdAt = joinDate;
    const updatedAt = randomDate(new Date(joinDate), new Date());
    
    return {
      id: index + 1,
      name,
      email: generateEmail(name),
      phone: generatePhone(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      title: randomChoice(titles),
      department: randomChoice(departments),
      status: randomChoice(statuses),
      bio: `我是${name}，来自${randomChoice(departments)}，负责相关工作。`,
      joinDate,
      lastLogin: Math.random() > 0.3 ? randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()) : undefined,
      createdAt,
      updatedAt,
    };
  });
};

// 产品数据生成器
export const generateMockProducts = (count: number = 20): MockProduct[] => {
  const categories = ['电子产品', '服装', '家居', '图书', '运动', '美妆'];
  const productNames = [
    '智能手机', '笔记本电脑', '无线耳机', '智能手表', '平板电脑',
    '休闲T恤', '牛仔裤', '运动鞋', '连衣裙', '外套',
    '沙发', '餐桌', '床垫', '台灯', '收纳盒',
    '编程书籍', '小说', '历史书', '科普读物', '工具书'
  ];
  const statuses: MockProduct['status'][] = ['active', 'inactive', 'draft'];
  
  return Array.from({ length: count }, (_, index) => {
    const name = randomChoice(productNames);
    const category = randomChoice(categories);
    const createdAt = randomDate(new Date(2023, 0, 1), new Date());
    const updatedAt = randomDate(new Date(createdAt), new Date());
    
    return {
      id: index + 1,
      name: `${name} ${index + 1}`,
      description: `这是一个优质的${name}，具有出色的性能和设计。`,
      price: randomInt(10, 5000),
      category,
      image: `https://picsum.photos/300/200?random=${index + 1}`,
      status: randomChoice(statuses),
      stock: randomInt(0, 100),
      createdAt,
      updatedAt,
    };
  });
};// 订单数
据生成器
export const generateMockOrders = (count: number = 15, users?: MockUser[], products?: MockProduct[]): MockOrder[] => {
  const statuses: MockOrder['status'][] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
  const mockUsers = users || generateMockUsers(10);
  const mockProducts = products || generateMockProducts(20);
  
  return Array.from({ length: count }, (_, index) => {
    const user = randomChoice(mockUsers);
    const orderProducts = Array.from({ length: randomInt(1, 4) }, () => {
      const product = randomChoice(mockProducts);
      const quantity = randomInt(1, 3);
      return {
        id: product.id,
        name: product.name,
        quantity,
        price: product.price,
      };
    });
    
    const totalAmount = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const createdAt = randomDate(new Date(2023, 0, 1), new Date());
    const updatedAt = randomDate(new Date(createdAt), new Date());
    
    return {
      id: index + 1,
      orderNo: `ORD${String(index + 1).padStart(6, '0')}`,
      userId: user.id,
      userName: user.name,
      products: orderProducts,
      totalAmount,
      status: randomChoice(statuses),
      createdAt,
      updatedAt,
    };
  });
};

// API响应格式模拟器
export interface MockAPIResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface MockPaginatedResponse<T> {
  code: number;
  message: string;
  data: {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  timestamp: number;
}

// 成功响应生成器
export const createSuccessResponse = <T>(data: T): MockAPIResponse<T> => ({
  code: 200,
  message: 'success',
  data,
  timestamp: Date.now(),
});

// 分页响应生成器
export const createPaginatedResponse = <T>(
  list: T[],
  page: number = 1,
  pageSize: number = 10
): MockPaginatedResponse<T> => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedList = list.slice(startIndex, endIndex);
  const total = list.length;
  const totalPages = Math.ceil(total / pageSize);

  return {
    code: 200,
    message: 'success',
    data: {
      list: paginatedList,
      total,
      page,
      pageSize,
      totalPages,
    },
    timestamp: Date.now(),
  };
};

// 错误响应生成器
export const createErrorResponse = (message: string, code: number = 400): MockAPIResponse<null> => ({
  code,
  message,
  data: null,
  timestamp: Date.now(),
});

// 模拟API延迟
export const mockDelay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// 模拟API调用
export const mockApiCall = async <T>(
  data: T,
  delay: number = 500,
  errorRate: number = 0.1
): Promise<MockAPIResponse<T>> => {
  await mockDelay(delay);
  
  // 模拟错误
  if (Math.random() < errorRate) {
    throw createErrorResponse('模拟网络错误', 500);
  }
  
  return createSuccessResponse(data);
};

// 预设数据集
export const MOCK_DATA_SETS = {
  users: generateMockUsers(50),
  products: generateMockProducts(100),
  orders: generateMockOrders(200),
};

// 刷新数据集
export const refreshMockData = () => {
  MOCK_DATA_SETS.users = generateMockUsers(50);
  MOCK_DATA_SETS.products = generateMockProducts(100);
  MOCK_DATA_SETS.orders = generateMockOrders(200, MOCK_DATA_SETS.users, MOCK_DATA_SETS.products);
};

// 根据ID查找数据
export const findMockUserById = (id: number): MockUser | undefined => 
  MOCK_DATA_SETS.users.find(user => user.id === id);

export const findMockProductById = (id: number): MockProduct | undefined => 
  MOCK_DATA_SETS.products.find(product => product.id === id);

export const findMockOrderById = (id: number): MockOrder | undefined => 
  MOCK_DATA_SETS.orders.find(order => order.id === id);

// 搜索和过滤工具
export const filterMockUsers = (filters: {
  keyword?: string;
  status?: string;
  department?: string;
}): MockUser[] => {
  return MOCK_DATA_SETS.users.filter(user => {
    if (filters.keyword && !user.name.includes(filters.keyword) && !user.email.includes(filters.keyword)) {
      return false;
    }
    if (filters.status && user.status !== filters.status) {
      return false;
    }
    if (filters.department && user.department !== filters.department) {
      return false;
    }
    return true;
  });
};

export const filterMockProducts = (filters: {
  keyword?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}): MockProduct[] => {
  return MOCK_DATA_SETS.products.filter(product => {
    if (filters.keyword && !product.name.includes(filters.keyword) && !product.description.includes(filters.keyword)) {
      return false;
    }
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    if (filters.status && product.status !== filters.status) {
      return false;
    }
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }
    return true;
  });
};