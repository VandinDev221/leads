import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LeadFinder Local — Sistema de Prospecção Comercial B2B',
  description:
    'Localize empresas e estabelecimentos comerciais por categoria, localização e raio para acelerar sua prospecção de vendas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen flex text-slate-900 bg-slate-50 antialiased`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </body>
    </html>
  );
}
