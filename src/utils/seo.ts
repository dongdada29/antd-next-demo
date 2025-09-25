import { Metadata } from 'next';

// SEO配置接口
export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

// 默认SEO配置
const DEFAULT_SEO: Required<Omit<SEOConfig, 'publishedTime' | 'modifiedTime' | 'section' | 'tags'>> = {
  title: 'AI Generated App',
  description: 'Created with AI assistance using Next.js and Ant Design',
  keywords: ['Next.js', 'React', 'Ant Design', 'TypeScript', 'AI'],
  image: '/og-image.jpg',
  url: 'https://example.com',
  type: 'website',
  siteName: 'AI Generated App',
  locale: 'zh_CN',
  author: 'AI Assistant',
};

/**
 * 生成页面元数据
 */
export function generateMetadata(config: SEOConfig = {}): Metadata {
  const seo = { ...DEFAULT_SEO, ...config };
  
  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: seo.author }],
    
    // Open Graph
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url,
      siteName: seo.siteName,
      images: [
        {
          url: seo.image,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: seo.locale,
      type: seo.type === 'product' ? 'website' : seo.type,
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
    
    // 其他元数据
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  // 文章特定的元数据
  if (seo.type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: config.publishedTime,
      modifiedTime: config.modifiedTime,
      section: config.section,
      tags: config.tags,
    };
  }

  return metadata;
}

/**
 * 生成列表页元数据
 */
export function generateListMetadata(
  title: string,
  description: string,
  options?: {
    page?: number;
    totalItems?: number;
    category?: string;
  }
): Metadata {
  const { page, totalItems, category } = options || {};
  
  let finalTitle = title;
  let finalDescription = description;
  
  if (page && page > 1) {
    finalTitle = `${title} - 第${page}页`;
    finalDescription = `${description} 第${page}页`;
  }
  
  if (category) {
    finalTitle = `${category} - ${finalTitle}`;
    finalDescription = `${category}相关内容。${finalDescription}`;
  }
  
  if (totalItems) {
    finalDescription = `共${totalItems}条记录。${finalDescription}`;
  }

  return generateMetadata({
    title: finalTitle,
    description: finalDescription,
    type: 'website',
  });
}

/**
 * 生成详情页元数据
 */
export function generateDetailMetadata(
  item: {
    title?: string;
    name?: string;
    description?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    category?: string;
    tags?: string[];
  }
): Metadata {
  const title = item.title || item.name || '详情页';
  const description = item.description || `查看${title}的详细信息`;
  
  return generateMetadata({
    title,
    description,
    image: item.image,
    type: 'article',
    publishedTime: item.createdAt,
    modifiedTime: item.updatedAt,
    section: item.category,
    tags: item.tags,
  });
}

/**
 * 生成搜索页元数据
 */
export function generateSearchMetadata(
  query: string,
  results?: {
    total: number;
    page: number;
  }
): Metadata {
  const { total = 0, page = 1 } = results || {};
  
  const title = query ? `搜索"${query}"的结果` : '搜索';
  const description = query 
    ? `搜索"${query}"找到${total}条结果${page > 1 ? ` - 第${page}页` : ''}`
    : '搜索您需要的内容';

  return generateMetadata({
    title,
    description,
    type: 'website',
  });
}

/**
 * 生成结构化数据
 */
export function generateStructuredData(
  type: 'WebSite' | 'Article' | 'Product' | 'Organization' | 'BreadcrumbList',
  data: Record<string, any>
): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return JSON.stringify(structuredData);
}

/**
 * 生成网站结构化数据
 */
export function generateWebSiteStructuredData(
  name: string,
  url: string,
  description?: string
): string {
  return generateStructuredData('WebSite', {
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
}

/**
 * 生成文章结构化数据
 */
export function generateArticleStructuredData(
  article: {
    title: string;
    description: string;
    url: string;
    image: string;
    author: string;
    publishedAt: string;
    modifiedAt?: string;
  }
): string {
  return generateStructuredData('Article', {
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
  });
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>
): string {
  const itemListElement = breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return generateStructuredData('BreadcrumbList', {
    itemListElement,
  });
}

/**
 * 生成产品结构化数据
 */
export function generateProductStructuredData(
  product: {
    name: string;
    description: string;
    image: string;
    brand?: string;
    price?: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    rating?: {
      value: number;
      count: number;
    };
  }
): string {
  const structuredData: any = {
    name: product.name,
    description: product.description,
    image: product.image,
  };

  if (product.brand) {
    structuredData.brand = {
      '@type': 'Brand',
      name: product.brand,
    };
  }

  if (product.price && product.currency) {
    structuredData.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
    };
  }

  if (product.rating) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
    };
  }

  return generateStructuredData('Product', structuredData);
}

/**
 * SEO工具类
 */
export class SEOUtils {
  /**
   * 生成页面标题
   */
  static generateTitle(title: string, siteName?: string): string {
    if (!siteName) return title;
    return title === siteName ? title : `${title} - ${siteName}`;
  }

  /**
   * 截断描述文本
   */
  static truncateDescription(text: string, maxLength: number = 160): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * 清理和格式化关键词
   */
  static formatKeywords(keywords: string[]): string[] {
    return keywords
      .map(keyword => keyword.trim().toLowerCase())
      .filter(keyword => keyword.length > 0)
      .filter((keyword, index, array) => array.indexOf(keyword) === index);
  }

  /**
   * 生成规范URL
   */
  static generateCanonicalUrl(baseUrl: string, path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl.replace(/\/$/, '')}${cleanPath}`;
  }

  /**
   * 验证图片URL
   */
  static validateImageUrl(url: string): boolean {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
    } catch {
      return false;
    }
  }

  /**
   * 生成社交媒体分享URL
   */
  static generateShareUrls(url: string, title: string, description?: string) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || '');

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      weibo: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}&pic=`,
      wechat: url, // 微信需要特殊处理
    };
  }
}