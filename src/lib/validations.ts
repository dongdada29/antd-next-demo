// 表单验证工具函数

/**
 * 验证邮箱格式
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证手机号格式
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证密码强度
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  message: string;
} => {
  if (password.length < 6) {
    return {
      isValid: false,
      strength: 'weak',
      message: '密码长度至少6位',
    };
  }
  
  let score = 0;
  
  // 包含小写字母
  if (/[a-z]/.test(password)) score++;
  // 包含大写字母
  if (/[A-Z]/.test(password)) score++;
  // 包含数字
  if (/\d/.test(password)) score++;
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  // 长度大于8
  if (password.length >= 8) score++;
  
  if (score < 3) {
    return {
      isValid: true,
      strength: 'weak',
      message: '密码强度较弱，建议包含大小写字母、数字和特殊字符',
    };
  } else if (score < 4) {
    return {
      isValid: true,
      strength: 'medium',
      message: '密码强度中等',
    };
  } else {
    return {
      isValid: true,
      strength: 'strong',
      message: '密码强度很强',
    };
  }
};

/**
 * 验证身份证号
 */
export const validateIdCard = (idCard: string): boolean => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idCardRegex.test(idCard);
};

/**
 * 验证URL格式
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证IP地址
 */
export const validateIP = (ip: string): boolean => {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

/**
 * 验证中文姓名
 */
export const validateChineseName = (name: string): boolean => {
  const nameRegex = /^[\u4e00-\u9fa5]{2,4}$/;
  return nameRegex.test(name);
};

/**
 * 通用表单验证器
 */
export const createValidator = (rules: Array<{
  validator: (value: any) => boolean;
  message: string;
}>) => {
  return (value: any): { isValid: boolean; message?: string } => {
    for (const rule of rules) {
      if (!rule.validator(value)) {
        return {
          isValid: false,
          message: rule.message,
        };
      }
    }
    return { isValid: true };
  };
};