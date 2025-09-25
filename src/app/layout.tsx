import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { QueryProvider } from '@/providers/QueryProvider';
import './globals.css';

export const metadata = {
  title: 'AI Generated App',
  description: 'Created with AI assistance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <QueryProvider>
          <AntdRegistry>
            <ConfigProvider locale={zhCN}>
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}