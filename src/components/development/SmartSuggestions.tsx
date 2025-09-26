'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Alert,
  List,
  Button,
  Space,
  Tag,
  Typography,
  Tooltip,
  Modal,
  Spin
} from 'antd';
import {
  BulbOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { DevelopmentGuidanceSystem } from '../../lib/development-guidance';
import { DevelopmentStage } from '../../lib/development-stage-manager';

const { Text, Paragraph } = Typography;

interface SmartSuggestionsProps {
  stage: DevelopmentStage;
  context?: any;
  onSuggestionApply?: (suggestion: string) => void;
  maxSuggestions?: number;
}

interface SuggestionItem {
  id: string;
  text: string;
  type: 'tip' | 'warning' | 'improvement' | 'best-practice';
  priority: 'high' | 'medium' | 'low';
  applied?: boolean;
  dismissed?: boolean;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  stage,
  context,
  onSuggestionApply,
  maxSuggestions = 5
}) => {
  const [guidanceSystem] = useState(() => new DevelopmentGuidanceSystem());
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // 生成智能建议
  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const rawSuggestions = guidanceSystem.getSmartSuggestions(stage, context);
      const bestPractices = guidanceSystem.getBestPractices(stage);
      const commonMistakes = guidanceSystem.getCommonMistakes(stage);

      const suggestionItems: SuggestionItem[] = [
        ...rawSuggestions.slice(0, 2).map((text, index) => ({
          id: `tip-${index}`,
          text,
          type: 'tip' as const,
          priority: 'high' as const
        })),
        ...bestPractices.slice(0, 2).map((text, index) => ({
          id: `practice-${index}`,
          text,
          type: 'best-practice' as const,
          priority: 'medium' as const
        })),
        ...commonMistakes.slice(0, 1).map((text, index) => ({
          id: `warning-${index}`,
          text: `避免: ${text}`,
          type: 'warning' as const,
          priority: 'high' as const
        }))
      ];

      // 根据优先级排序并限制数量
      const sortedSuggestions = suggestionItems
        .sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        })
        .slice(0, maxSuggestions);

      setSuggestions(sortedSuggestions);
    } catch (error) {
      console.error('生成建议失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateSuggestions();
  }, [stage, context]);

  // 应用建议
  const applySuggestion = (suggestion: SuggestionItem) => {
    setSuggestions(prev => 
      prev.map(s => 
        s.id === suggestion.id ? { ...s, applied: true } : s
      )
    );
    onSuggestionApply?.(suggestion.text);
  };

  // 忽略建议
  const dismissSuggestion = (suggestion: SuggestionItem) => {
    setSuggestions(prev => 
      prev.map(s => 
        s.id === suggestion.id ? { ...s, dismissed: true } : s
      )
    );
  };

  // 获取建议类型的配置
  const getSuggestionConfig = (type: SuggestionItem['type']) => {
    switch (type) {
      case 'tip':
        return {
          color: '#1890ff',
          icon: <BulbOutlined />,
          tagColor: 'blue',
          label: '提示'
        };
      case 'warning':
        return {
          color: '#faad14',
          icon: <InfoCircleOutlined />,
          tagColor: 'orange',
          label: '注意'
        };
      case 'improvement':
        return {
          color: '#52c41a',
          icon: <BulbOutlined />,
          tagColor: 'green',
          label: '改进'
        };
      case 'best-practice':
        return {
          color: '#722ed1',
          icon: <BulbOutlined />,
          tagColor: 'purple',
          label: '最佳实践'
        };
      default:
        return {
          color: '#1890ff',
          icon: <BulbOutlined />,
          tagColor: 'blue',
          label: '建议'
        };
    }
  };

  // 获取优先级标签
  const getPriorityTag = (priority: SuggestionItem['priority']) => {
    switch (priority) {
      case 'high':
        return <Tag color="red" size="small">高</Tag>;
      case 'medium':
        return <Tag color="orange" size="small">中</Tag>;
      case 'low':
        return <Tag color="green" size="small">低</Tag>;
    }
  };

  const activeSuggestions = suggestions.filter(s => !s.dismissed);

  if (loading) {
    return (
      <Card title="智能建议" size="small">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
          <div style={{ marginTop: '8px' }}>
            <Text type="secondary">正在生成建议...</Text>
          </div>
        </div>
      </Card>
    );
  }

  if (activeSuggestions.length === 0) {
    return (
      <Card 
        title="智能建议" 
        size="small"
        extra={
          <Button 
            size="small" 
            icon={<ReloadOutlined />}
            onClick={generateSuggestions}
          >
            刷新
          </Button>
        }
      >
        <Alert
          message="暂无建议"
          description="当前阶段没有可用的智能建议"
          type="info"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card 
      title="智能建议" 
      size="small"
      extra={
        <Button 
          size="small" 
          icon={<ReloadOutlined />}
          onClick={generateSuggestions}
          loading={loading}
        >
          刷新
        </Button>
      }
    >
      <List
        size="small"
        dataSource={activeSuggestions}
        renderItem={(suggestion) => {
          const config = getSuggestionConfig(suggestion.type);
          
          return (
            <List.Item
              style={{
                opacity: suggestion.applied ? 0.6 : 1,
                backgroundColor: suggestion.applied ? '#f6ffed' : 'transparent',
                borderRadius: '4px',
                padding: '8px',
                marginBottom: '4px'
              }}
              actions={
                suggestion.applied ? [
                  <Tag key="applied" color="green" icon={<CheckOutlined />}>
                    已应用
                  </Tag>
                ] : [
                  <Tooltip key="apply" title="应用此建议">
                    <Button
                      size="small"
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={() => applySuggestion(suggestion)}
                    />
                  </Tooltip>,
                  <Tooltip key="dismiss" title="忽略此建议">
                    <Button
                      size="small"
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={() => dismissSuggestion(suggestion)}
                    />
                  </Tooltip>
                ]
              }
            >
              <List.Item.Meta
                avatar={
                  <div style={{ color: config.color }}>
                    {config.icon}
                  </div>
                }
                title={
                  <Space size="small">
                    <Tag color={config.tagColor} size="small">
                      {config.label}
                    </Tag>
                    {getPriorityTag(suggestion.priority)}
                  </Space>
                }
                description={
                  <Text 
                    style={{ 
                      fontSize: '13px',
                      textDecoration: suggestion.applied ? 'line-through' : 'none'
                    }}
                  >
                    {suggestion.text}
                  </Text>
                }
              />
            </List.Item>
          );
        }}
      />

      {activeSuggestions.length > 0 && (
        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 这些建议基于当前开发阶段自动生成
          </Text>
        </div>
      )}
    </Card>
  );
};

export default SmartSuggestions;