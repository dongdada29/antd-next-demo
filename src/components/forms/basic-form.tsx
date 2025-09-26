'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

interface BasicFormProps {
  title?: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void | Promise<void>;
  submitText?: string;
  loading?: boolean;
  className?: string;
}

export function BasicForm({
  title = '表单',
  description,
  fields,
  onSubmit,
  submitText = '提交',
  loading = false,
  className,
}: BasicFormProps) {
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // 清除错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (field: FormField, value: string): string => {
    if (field.required && !value.trim()) {
      return `${field.label}是必填项`;
    }

    if (field.validation) {
      const { pattern, minLength, maxLength } = field.validation;
      
      if (pattern && !new RegExp(pattern).test(value)) {
        return `${field.label}格式不正确`;
      }
      
      if (minLength && value.length < minLength) {
        return `${field.label}至少需要${minLength}个字符`;
      }
      
      if (maxLength && value.length > maxLength) {
        return `${field.label}不能超过${maxLength}个字符`;
      }
    }

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证所有字段
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name] || '');
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(field => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={cn(errors[field.name] && 'border-destructive')}
                disabled={loading}
              />
              {errors[field.name] && (
                <p className="text-sm text-destructive">{errors[field.name]}</p>
              )}
            </div>
          ))}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? '提交中...' : submitText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// 预定义的表单配置
export const formConfigs = {
  login: [
    {
      name: 'email',
      label: '邮箱',
      type: 'email' as const,
      placeholder: '请输入邮箱地址',
      required: true,
    },
    {
      name: 'password',
      label: '密码',
      type: 'password' as const,
      placeholder: '请输入密码',
      required: true,
      validation: {
        minLength: 6,
      },
    },
  ],
  
  register: [
    {
      name: 'username',
      label: '用户名',
      type: 'text' as const,
      placeholder: '请输入用户名',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 20,
      },
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'email' as const,
      placeholder: '请输入邮箱地址',
      required: true,
    },
    {
      name: 'password',
      label: '密码',
      type: 'password' as const,
      placeholder: '请输入密码',
      required: true,
      validation: {
        minLength: 8,
      },
    },
  ],
  
  contact: [
    {
      name: 'name',
      label: '姓名',
      type: 'text' as const,
      placeholder: '请输入您的姓名',
      required: true,
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'email' as const,
      placeholder: '请输入邮箱地址',
      required: true,
    },
    {
      name: 'phone',
      label: '电话',
      type: 'tel' as const,
      placeholder: '请输入电话号码',
      validation: {
        pattern: '^1[3-9]\\d{9}$',
      },
    },
  ],
};