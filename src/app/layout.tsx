import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/sidebar';
import { CommandPalette } from '@/components/common/command-palette';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LeadFinder Local — Plataforma B2B de Prospecção & Qualificação de Leads',
  description:
    'Encontre, qualifique, priorize e converta clientes comerciais B2B locais para serviços de software, sites e automação.',
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
        <div className="flex-1 flex flex-col min-w-0">
          {children}
          <CommandPalette />
        </div>
      </body>
    </html>
  );
}
