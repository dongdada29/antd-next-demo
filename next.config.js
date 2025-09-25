/** @type {import('next').NextConfig} */
const nextConfig = {
  // 使用SWC编译器（比Babel更快）
  swcMinify: true,
  
  // 现代浏览器优化
  compiler: {
    // 移除console.log（生产环境）
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 实验性功能
  experimental: {
    // 优化字体加载
    optimizeFonts: true,
    // 现代化输出
    esmExternals: true,
  },
  
  // 构建优化
  output: 'standalone', // 优化部署
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;