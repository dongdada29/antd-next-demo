// Global type definitions

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// API Documentation types
export * from './api-documentation';

// Development Stage types
export * from './development-stage';