import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '전자 방명록',
  description: '실시간 전자 방명록'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
