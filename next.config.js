const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 使用SWC编译器（比Babel更快）
  swcMinify: true,
  
  // 现代浏览器优化
  compiler: {
    // 移除console.log（生产环境）
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
    // 移除React DevTools（生产环境）
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    // 启用styled-components支持
    styledComponents: true,
  },
  
  // 实验性功能
  experimental: {
    // 现代化输出
    esmExternals: true,
    // 启用Turbo模式（开发环境）
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // 优化CSS
    optimizeCss: true,
  },
  
  // 构建优化
  output: 'standalone', // 优化部署
  
  // 压缩配置
  compress: true,
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1年
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 性能优化
  poweredByHeader: false,
  generateEtags: false,
  
  // Webpack配置优化
  webpack: (config, { dev, isServer, webpack }) => {
    // 路径别名
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    
    // 生产环境优化
    if (!dev && !isServer) {
      // 高级代码分割优化
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          default: false,
          vendors: false,
          
          // React 核心库
          react: {
            name: 'react',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 50,
            enforce: true,
          },
          
          // shadcn/ui 组件
          shadcn: {
            name: 'shadcn',
            chunks: 'all',
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            priority: 45,
            minChunks: 2,
          },
          
          // Tailwind CSS 相关
          tailwind: {
            name: 'tailwind',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](tailwindcss|@tailwindcss)[\\/]/,
            priority: 40,
          },
          
          // 第三方 UI 库
          uiLibs: {
            name: 'ui-libs',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|class-variance-authority)[\\/]/,
            priority: 35,
          },
          
          // 工具库
          utils: {
            name: 'utils',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](lodash|date-fns|clsx|cn)[\\/]/,
            priority: 30,
          },
          
          // 大型第三方库
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            minChunks: 2,
          },
          
          // 应用公共代码
          common: {
            name: 'common',
            chunks: 'all',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            test: /[\\/]src[\\/]/,
          },
          
          // 懒加载组件
          lazy: {
            name: 'lazy',
            chunks: 'async',
            test: /[\\/]src[\\/]components[\\/]/,
            priority: 15,
            minChunks: 1,
          },
        },
      };
      
      // 模块连接优化
      config.optimization.concatenateModules = true;
      
      // 启用 Tree Shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // 启用Bundle分析器（如果需要）
      if (process.env.ANALYZE === 'true') {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle-analyzer-report.html',
          })
        );
      }
      
      // 预加载关键资源
      config.plugins.push(
        new webpack.optimize.ModuleConcatenationPlugin()
      );
    }
    
    // 开发环境优化
    if (dev) {
      // 启用更快的刷新
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    
    // SVG处理
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // 头部优化
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;