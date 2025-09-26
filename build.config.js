/**
 * 构建优化配置
 * Build optimization configuration
 */

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  // 环境配置
  env: {
    isDev,
    isProd,
  },
  
  // 构建优化选项
  optimization: {
    // 代码分割策略
    splitChunks: {
      // 第三方库最小大小 (KB)
      vendorMinSize: 20,
      // 公共代码最小大小 (KB)
      commonMinSize: 10,
      // 最大并行请求数
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
    },
    
    // 压缩选项
    minify: {
      // 移除注释
      removeComments: isProd,
      // 移除空白字符
      collapseWhitespace: isProd,
      // 移除冗余属性
      removeRedundantAttributes: isProd,
      // 移除空属性
      removeEmptyAttributes: isProd,
    },
    
    // 缓存策略
    cache: {
      // 构建缓存
      buildCache: true,
      // 模块缓存
      moduleCache: true,
      // 缓存目录
      cacheDirectory: '.next/cache',
    },
  },
  
  // 性能预算
  performance: {
    // 入口文件最大大小 (KB)
    maxEntrypointSize: 250,
    // 资源文件最大大小 (KB)
    maxAssetSize: 250,
    // 性能提示
    hints: isProd ? 'warning' : false,
  },
  
  // 现代浏览器配置
  modernBuild: {
    // 目标浏览器
    targets: [
      'Chrome >= 87',
      'Firefox >= 78', 
      'Safari >= 14',
      'Edge >= 87'
    ],
    // 启用现代特性
    features: {
      // ES模块
      esModules: true,
      // 动态导入
      dynamicImport: true,
      // 可选链
      optionalChaining: true,
      // 空值合并
      nullishCoalescing: true,
    },
  },
  
  // 开发环境优化
  development: {
    // 快速刷新
    fastRefresh: true,
    // 源码映射
    sourceMap: 'eval-cheap-module-source-map',
    // 监听选项
    watchOptions: {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    },
  },
  
  // 生产环境优化
  production: {
    // 源码映射
    sourceMap: 'source-map',
    // 压缩选项
    compress: {
      // 移除console
      drop_console: true,
      // 移除debugger
      drop_debugger: true,
      // 纯函数调用
      pure_funcs: ['console.log', 'console.info'],
    },
    // 混淆选项
    mangle: {
      // 保留类名
      keep_classnames: true,
      // 保留函数名
      keep_fnames: true,
    },
  },
};