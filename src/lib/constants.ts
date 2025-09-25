// 应用常量定义

// API 相关常量
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
export const API_TIMEOUT = 10000; // 10秒超时

// 分页常量
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
} as const;

// 路由路径
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  PROFILE: '/profile',
} as const;

// 表单验证规则
export const VALIDATION_RULES = {
  REQUIRED: { required: true, message: '此字段为必填项' },
  EMAIL: {
    type: 'email' as const,
    message: '请输入有效的邮箱地址',
  },
  PHONE: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入有效的手机号码',
  },
  PASSWORD: {
    min: 6,
    message: '密码长度至少6位',
  },
} as const;

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 主题配置
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#1890ff',
  SUCCESS_COLOR: '#52c41a',
  WARNING_COLOR: '#faad14',
  ERROR_COLOR: '#f5222d',
  BORDER_RADIUS: 6,
} as const;