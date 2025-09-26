import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, Search, Calendar, Settings, User } from 'lucide-react';

export default function ExamplesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          shadcn/ui 组件示例
        </h1>
        <p className="text-muted-foreground">
          探索各种 shadcn/ui 组件的使用方法和样式变体
        </p>
      </div>

      <div className="grid gap-6">
        {/* 按钮示例 */}
        <Card>
          <CardHeader>
            <CardTitle>按钮组件</CardTitle>
            <CardDescription>
              不同变体和大小的按钮示例
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">按钮变体</h4>
                <div className="flex flex-wrap gap-2">
                  <Button>默认</Button>
                  <Button variant="secondary">次要</Button>
                  <Button variant="destructive">危险</Button>
                  <Button variant="outline">轮廓</Button>
                  <Button variant="ghost">幽灵</Button>
                  <Button variant="link">链接</Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">按钮大小</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm">小号</Button>
                  <Button size="default">默认</Button>
                  <Button size="lg">大号</Button>
                  <Button size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 输入框示例 */}
        <Card>
          <CardHeader>
            <CardTitle>输入组件</CardTitle>
            <CardDescription>
              表单输入框和标签的使用示例
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱地址"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="search">搜索</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="搜索内容..."
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 卡片示例 */}
        <Card>
          <CardHeader>
            <CardTitle>卡片组件</CardTitle>
            <CardDescription>
              不同样式的卡片布局示例
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    用户信息
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    这是一个简单的用户信息卡片示例。
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    日程安排
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    显示今日的重要日程和任务。
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* 完整示例链接 */}
        <Card>
          <CardHeader>
            <CardTitle>完整示例</CardTitle>
            <CardDescription>
              查看更复杂的组件组合和实际应用场景
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/examples/basic-form">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">基础表单</CardTitle>
                    <CardDescription>
                      完整的表单组件，包含验证和提交功能
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              
              <Link href="/examples/data-table">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">数据表格</CardTitle>
                    <CardDescription>
                      可排序、可搜索的数据表格组件
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}