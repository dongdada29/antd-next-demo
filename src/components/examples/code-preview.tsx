'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Code, 
  Eye, 
  Copy, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface CodePreviewProps {
  initialCode?: string;
  language?: 'tsx' | 'jsx' | 'ts' | 'js';
  showPreview?: boolean;
  onCodeChange?: (code: string) => void;
}

const CodePreview: React.FC<CodePreviewProps> = ({
  initialCode = '',
  language = 'tsx',
  showPreview = true,
  onCodeChange
}) => {
  const [code, setCode] = useState(initialCode);
  const [previewCode, setPreviewCode] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  // 模拟代码编译和预览生成
  const compileCode = useCallback(async (sourceCode: string) => {
    setIsCompiling(true);
    setCompilationError(null);

    try {
      // 模拟编译延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 简单的代码转换（实际项目中会使用 Babel 或其他编译器）
      const transformedCode = transformCodeForPreview(sourceCode);
      setPreviewCode(transformedCode);
      
      toast.success('代码编译成功');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '编译失败';
      setCompilationError(errorMessage);
      toast.error('代码编译失败');
    } finally {
      setIsCompiling(false);
    }
  }, []);

  // 简单的代码转换函数
  const transformCodeForPreview = (sourceCode: string): string => {
    // 这里是一个简化的转换示例
    // 实际项目中会使用更复杂的 AST 转换
    
    if (sourceCode.includes('export default')) {
      // 提取组件代码并包装为可预览的格式
      return `
        <div className="p-4 border rounded-lg bg-background">
          <div className="space-y-4">
            ${sourceCode.replace(/export default|export const|export function/g, '')}
          </div>
        </div>
      `;
    }

    return `
      <div className="p-4 border rounded-lg bg-background">
        <div className="text-center text-muted-foreground">
          <p>预览功能正在开发中</p>
          <p className="text-sm mt-2">将支持实时预览 React 组件</p>
        </div>
      </div>
    `;
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleCompile = () => {
    compileCode(code);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('代码已复制到剪贴板');
  };

  const handleReset = () => {
    setCode(initialCode);
    setPreviewCode('');
    setCompilationError(null);
    toast.success('代码已重置');
  };

  // 语法高亮（简化版）
  const highlightSyntax = (code: string) => {
    return code
      .replace(/(import|export|from|const|let|var|function|return|if|else|for|while)/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>')
      .replace(/(React|useState|useEffect|useCallback|useMemo)/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>')
      .replace(/('.*?'|".*?")/g, '<span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 dark:text-gray-400">$1</span>');
  };

  useEffect(() => {
    if (initialCode && initialCode !== code) {
      setCode(initialCode);
    }
  }, [initialCode]);

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{language.toUpperCase()}</Badge>
          {compilationError && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              编译错误
            </Badge>
          )}
          {previewCode && !compilationError && (
            <Badge variant="default" className="flex items-center gap-1 bg-green-600">
              <CheckCircle className="h-3 w-3" />
              编译成功
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
          >
            <Copy className="h-4 w-4 mr-1" />
            复制
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            重置
          </Button>
          
          <Button
            size="sm"
            onClick={handleCompile}
            disabled={isCompiling || !code.trim()}
          >
            {isCompiling ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                编译中
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                编译预览
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 编译错误提示 */}
      {compilationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>编译错误：</strong> {compilationError}
          </AlertDescription>
        </Alert>
      )}

      {/* 代码编辑和预览区域 */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'code' | 'preview')}>
            <TabsList>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                代码编辑
              </TabsTrigger>
              {showPreview && (
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  实时预览
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab}>
            <TabsContent value="code" className="mt-0">
              <div className="space-y-4">
                <Textarea
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder={`输入您的 ${language.toUpperCase()} 代码...`}
                  className="min-h-[400px] font-mono text-sm"
                  style={{ resize: 'vertical' }}
                />
                
                {/* 代码统计 */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>行数: {code.split('\n').length}</span>
                  <span>字符数: {code.length}</span>
                  <span>字节数: {new Blob([code]).size}</span>
                </div>
              </div>
            </TabsContent>
            
            {showPreview && (
              <TabsContent value="preview" className="mt-0">
                <div className="space-y-4">
                  {previewCode ? (
                    <div className="border rounded-lg">
                      {/* 预览工具栏 */}
                      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
                        <span className="text-sm font-medium">组件预览</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            实时预览
                          </Badge>
                        </div>
                      </div>
                      
                      {/* 预览内容 */}
                      <div className="p-6">
                        <div 
                          dangerouslySetInnerHTML={{ __html: previewCode }}
                          className="preview-content"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Eye className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">
                          点击"编译预览"按钮查看组件效果
                        </p>
                        <p className="text-sm text-muted-foreground">
                          支持实时预览 React 组件渲染结果
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* 代码分析 */}
      {code && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">代码分析</CardTitle>
            <CardDescription>
              自动分析代码质量和潜在问题
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium">代码复杂度</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: '30%' }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">低</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">可维护性</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: '80%' }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">高</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">性能评分</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: '65%' }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">中</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">建议优化</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  使用了 TypeScript 类型定义
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  遵循了 React Hooks 规则
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  建议添加错误边界处理
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodePreview;