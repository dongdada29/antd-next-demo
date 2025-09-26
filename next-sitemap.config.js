/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/admin/*', '/private/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
    ],
  },
  transform: async (config, path) => {
    // 自定义页面优先级
    const priority = getPriority(path);
    const changefreq = getChangeFreq(path);
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};

function getPriority(path) {
  if (path === '/') return 1.0;
  if (path.startsWith('/examples')) return 0.8;
  if (path.startsWith('/docs')) return 0.7;
  return 0.5;
}

function getChangeFreq(path) {
  if (path === '/') return 'daily';
  if (path.startsWith('/examples')) return 'weekly';
  if (path.startsWith('/docs')) return 'monthly';
  return 'monthly';
}