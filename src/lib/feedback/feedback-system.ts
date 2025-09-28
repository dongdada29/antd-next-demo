/**
 * 用户反馈和改进建议收集系统
 * 
 * 提供多种反馈收集方式，包括评分、建议、错误报告等
 */

export interface Feedback {
  id: string;
  type: 'rating' | 'suggestion' | 'bug' | 'feature' | 'general';
  category: 'ui' | 'performance' | 'ai' | 'documentation' | 'other';
  title: string;
  description: string;
  rating?: number; // 1-5 星评分
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  user: {
    id?: string;
    email?: string;
    name?: string;
    anonymous: boolean;
  };
  metadata: {
    userAgent: string;
    url: string;
    timestamp: Date;
    version: string;
    environment: 'development' | 'staging' | 'production';
    sessionId?: string;
  };
  attachments?: FeedbackAttachment[];
  tags: string[];
  votes: {
    upvotes: number;
    downvotes: number;
  };
  responses: FeedbackResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedbackAttachment {
  id: string;
  type: 'image' | 'video' | 'file' | 'log';
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface FeedbackResponse {
  id: string;
  author: {
    name: string;
    role: 'user' | 'moderator' | 'developer';
  };
  content: string;
  createdAt: Date;
}

export interface FeedbackSubmission {
  type: Feedback['type'];
  category: Feedback['category'];
  title: string;
  description: string;
  rating?: number;
  priority?: Feedback['priority'];
  user?: {
    email?: string;
    name?: string;
    anonymous?: boolean;
  };
  attachments?: File[];
  tags?: string[];
}

export interface FeedbackFilters {
  type?: Feedback['type'];
  category?: Feedback['category'];
  status?: Feedback['status'];
  priority?: Feedback['priority'];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  minRating?: number;
  maxRating?: number;
}

export interface FeedbackStats {
  total: number;
  byType: Record<Feedback['type'], number>;
  byCategory: Record<Feedback['category'], number>;
  byStatus: Record<Feedback['status'], number>;
  byPriority: Record<Feedback['priority'], number>;
  averageRating: number;
  responseTime: {
    average: number; // 平均响应时间（小时）
    median: number;
  };
  resolutionRate: number; // 解决率百分比
}

export class FeedbackService {
  private apiUrl: string;
  private apiKey?: string;

  constructor(apiUrl: string = '/api/feedback', apiKey?: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  /**
   * 提交反馈
   */
  async submitFeedback(feedback: FeedbackSubmission): Promise<Feedback> {
    const formData = new FormData();
    
    // 添加基本信息
    formData.append('type', feedback.type);
    formData.append('category', feedback.category);
    formData.append('title', feedback.title);
    formData.append('description', feedback.description);
    
    if (feedback.rating) {
      formData.append('rating', feedback.rating.toString());
    }
    
    if (feedback.priority) {
      formData.append('priority', feedback.priority);
    }

    // 添加用户信息
    if (feedback.user) {
      formData.append('user', JSON.stringify(feedback.user));
    }

    // 添加标签
    if (feedback.tags) {
      formData.append('tags', JSON.stringify(feedback.tags));
    }

    // 添加附件
    if (feedback.attachments) {
      feedback.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }

    // 添加元数据
    const metadata = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV as 'development' | 'staging' | 'production',
      sessionId: this.getSessionId()
    };
    formData.append('metadata', JSON.stringify(metadata));

    const response = await this.makeRequest('', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`提交反馈失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取反馈列表
   */
  async getFeedback(
    filters?: FeedbackFilters,
    page = 1,
    limit = 20
  ): Promise<{
    feedback: Feedback[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'dateRange') {
            params.append('startDate', value.start.toISOString());
            params.append('endDate', value.end.toISOString());
          } else if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await this.makeRequest(`?${params}`);
    
    if (!response.ok) {
      throw new Error(`获取反馈失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取单个反馈详情
   */
  async getFeedbackById(id: string): Promise<Feedback> {
    const response = await this.makeRequest(`/${id}`);
    
    if (!response.ok) {
      throw new Error(`获取反馈详情失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 更新反馈状态
   */
  async updateFeedbackStatus(
    id: string,
    status: Feedback['status'],
    response?: string
  ): Promise<Feedback> {
    const body: any = { status };
    if (response) {
      body.response = response;
    }

    const httpResponse = await this.makeRequest(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });

    if (!httpResponse.ok) {
      throw new Error(`更新状态失败: ${httpResponse.statusText}`);
    }

    return httpResponse.json();
  }

  /**
   * 为反馈投票
   */
  async voteFeedback(
    id: string,
    vote: 'up' | 'down'
  ): Promise<{ upvotes: number; downvotes: number }> {
    const response = await this.makeRequest(`/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote })
    });

    if (!response.ok) {
      throw new Error(`投票失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 添加反馈回复
   */
  async addFeedbackResponse(
    id: string,
    content: string
  ): Promise<FeedbackResponse> {
    const response = await this.makeRequest(`/${id}/responses`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error(`添加回复失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取反馈统计
   */
  async getFeedbackStats(
    dateRange?: { start: Date; end: Date }
  ): Promise<FeedbackStats> {
    const params = new URLSearchParams();
    
    if (dateRange) {
      params.append('startDate', dateRange.start.toISOString());
      params.append('endDate', dateRange.end.toISOString());
    }

    const response = await this.makeRequest(`/stats?${params}`);
    
    if (!response.ok) {
      throw new Error(`获取统计失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 搜索反馈
   */
  async searchFeedback(
    query: string,
    filters?: FeedbackFilters
  ): Promise<Feedback[]> {
    const params = new URLSearchParams({ q: query });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && key !== 'dateRange') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await this.makeRequest(`/search?${params}`);
    
    if (!response.ok) {
      throw new Error(`搜索失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取热门反馈
   */
  async getTrendingFeedback(limit = 10): Promise<Feedback[]> {
    const response = await this.makeRequest(`/trending?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`获取热门反馈失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取用户的反馈
   */
  async getUserFeedback(userId?: string): Promise<Feedback[]> {
    const endpoint = userId ? `/user/${userId}` : '/user';
    const response = await this.makeRequest(endpoint);
    
    if (!response.ok) {
      throw new Error(`获取用户反馈失败: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 删除反馈
   */
  async deleteFeedback(id: string): Promise<void> {
    const response = await this.makeRequest(`/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`删除反馈失败: ${response.statusText}`);
    }
  }

  /**
   * 获取会话 ID
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('feedback-session-id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('feedback-session-id', sessionId);
    }
    
    return sessionId;
  }

  /**
   * 发起 HTTP 请求
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.apiUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      ...options.headers
    };

    // 只有在发送 JSON 数据时才设置 Content-Type
    if (options.body && typeof options.body === 'string') {
      headers['Content-Type'] = 'application/json';
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return fetch(url, {
      ...options,
      headers
    });
  }
}

/**
 * 反馈小部件
 */
export class FeedbackWidget {
  private service: FeedbackService;
  private container: HTMLElement | null = null;
  private isVisible = false;

  constructor(service: FeedbackService) {
    this.service = service;
  }

  /**
   * 初始化反馈小部件
   */
  init(): void {
    this.createWidget();
    this.attachEventListeners();
  }

  /**
   * 显示反馈小部件
   */
  show(): void {
    if (this.container) {
      this.container.style.display = 'block';
      this.isVisible = true;
    }
  }

  /**
   * 隐藏反馈小部件
   */
  hide(): void {
    if (this.container) {
      this.container.style.display = 'none';
      this.isVisible = false;
    }
  }

  /**
   * 切换显示状态
   */
  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * 销毁小部件
   */
  destroy(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }

  /**
   * 创建小部件 DOM
   */
  private createWidget(): void {
    this.container = document.createElement('div');
    this.container.id = 'feedback-widget';
    this.container.innerHTML = `
      <div class="feedback-widget-container">
        <button class="feedback-trigger" aria-label="提供反馈">
          💬 反馈
        </button>
        <div class="feedback-form" style="display: none;">
          <div class="feedback-header">
            <h3>提供反馈</h3>
            <button class="feedback-close" aria-label="关闭">&times;</button>
          </div>
          <form class="feedback-form-content">
            <div class="form-group">
              <label for="feedback-type">反馈类型</label>
              <select id="feedback-type" required>
                <option value="">请选择</option>
                <option value="suggestion">建议</option>
                <option value="bug">错误报告</option>
                <option value="feature">功能请求</option>
                <option value="rating">评分</option>
                <option value="general">一般反馈</option>
              </select>
            </div>
            <div class="form-group">
              <label for="feedback-category">分类</label>
              <select id="feedback-category" required>
                <option value="">请选择</option>
                <option value="ui">用户界面</option>
                <option value="performance">性能</option>
                <option value="ai">AI 功能</option>
                <option value="documentation">文档</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="form-group">
              <label for="feedback-title">标题</label>
              <input type="text" id="feedback-title" required maxlength="100">
            </div>
            <div class="form-group">
              <label for="feedback-description">详细描述</label>
              <textarea id="feedback-description" required rows="4" maxlength="1000"></textarea>
            </div>
            <div class="form-group rating-group" style="display: none;">
              <label>评分</label>
              <div class="rating-stars">
                <span class="star" data-rating="1">⭐</span>
                <span class="star" data-rating="2">⭐</span>
                <span class="star" data-rating="3">⭐</span>
                <span class="star" data-rating="4">⭐</span>
                <span class="star" data-rating="5">⭐</span>
              </div>
            </div>
            <div class="form-group">
              <label for="feedback-email">邮箱（可选）</label>
              <input type="email" id="feedback-email" placeholder="用于接收回复">
            </div>
            <div class="form-actions">
              <button type="button" class="btn-cancel">取消</button>
              <button type="submit" class="btn-submit">提交反馈</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      #feedback-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .feedback-trigger {
        background: #007bff;
        color: white;
        border: none;
        border-radius: 25px;
        padding: 12px 20px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        transition: all 0.3s ease;
      }
      
      .feedback-trigger:hover {
        background: #0056b3;
        transform: translateY(-2px);
      }
      
      .feedback-form {
        position: absolute;
        bottom: 60px;
        right: 0;
        width: 350px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        border: 1px solid #e0e0e0;
      }
      
      .feedback-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #e0e0e0;
      }
      
      .feedback-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .feedback-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      }
      
      .feedback-form-content {
        padding: 20px;
      }
      
      .form-group {
        margin-bottom: 16px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        font-size: 14px;
      }
      
      .form-group input,
      .form-group select,
      .form-group textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
      }
      
      .rating-stars {
        display: flex;
        gap: 4px;
      }
      
      .star {
        cursor: pointer;
        font-size: 20px;
        opacity: 0.3;
        transition: opacity 0.2s;
      }
      
      .star.active,
      .star:hover {
        opacity: 1;
      }
      
      .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 20px;
      }
      
      .btn-cancel,
      .btn-submit {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }
      
      .btn-cancel {
        background: #f8f9fa;
        color: #666;
      }
      
      .btn-submit {
        background: #007bff;
        color: white;
      }
      
      .btn-submit:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.container);
  }

  /**
   * 绑定事件监听器
   */
  private attachEventListeners(): void {
    if (!this.container) return;

    const trigger = this.container.querySelector('.feedback-trigger') as HTMLButtonElement;
    const form = this.container.querySelector('.feedback-form') as HTMLElement;
    const closeBtn = this.container.querySelector('.feedback-close') as HTMLButtonElement;
    const cancelBtn = this.container.querySelector('.btn-cancel') as HTMLButtonElement;
    const submitBtn = this.container.querySelector('.btn-submit') as HTMLButtonElement;
    const formElement = this.container.querySelector('.feedback-form-content') as HTMLFormElement;
    const typeSelect = this.container.querySelector('#feedback-type') as HTMLSelectElement;
    const ratingGroup = this.container.querySelector('.rating-group') as HTMLElement;
    const stars = this.container.querySelectorAll('.star');

    // 显示/隐藏表单
    trigger.addEventListener('click', () => {
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    // 关闭表单
    const closeForm = () => {
      form.style.display = 'none';
    };

    closeBtn.addEventListener('click', closeForm);
    cancelBtn.addEventListener('click', closeForm);

    // 类型选择变化
    typeSelect.addEventListener('change', () => {
      if (typeSelect.value === 'rating') {
        ratingGroup.style.display = 'block';
      } else {
        ratingGroup.style.display = 'none';
      }
    });

    // 星级评分
    let selectedRating = 0;
    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        selectedRating = index + 1;
        stars.forEach((s, i) => {
          s.classList.toggle('active', i < selectedRating);
        });
      });
    });

    // 表单提交
    formElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      submitBtn.disabled = true;
      submitBtn.textContent = '提交中...';

      try {
        const formData = new FormData(formElement);
        const feedback: FeedbackSubmission = {
          type: formData.get('feedback-type') as Feedback['type'],
          category: formData.get('feedback-category') as Feedback['category'],
          title: formData.get('feedback-title') as string,
          description: formData.get('feedback-description') as string,
          rating: selectedRating || undefined,
          user: {
            email: formData.get('feedback-email') as string || undefined,
            anonymous: !formData.get('feedback-email')
          }
        };

        await this.service.submitFeedback(feedback);
        
        // 显示成功消息
        alert('感谢您的反馈！我们会认真考虑您的建议。');
        
        // 重置表单
        formElement.reset();
        selectedRating = 0;
        stars.forEach(s => s.classList.remove('active'));
        ratingGroup.style.display = 'none';
        
        closeForm();
      } catch (error) {
        console.error('提交反馈失败:', error);
        alert('提交失败，请稍后重试。');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '提交反馈';
      }
    });
  }
}

// 创建默认实例
export const feedbackService = new FeedbackService();

// 自动初始化反馈小部件（如果在浏览器环境中）
if (typeof window !== 'undefined') {
  const feedbackWidget = new FeedbackWidget(feedbackService);
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      feedbackWidget.init();
    });
  } else {
    feedbackWidget.init();
  }
  
  // 导出到全局，方便调试
  (window as any).feedbackWidget = feedbackWidget;
}