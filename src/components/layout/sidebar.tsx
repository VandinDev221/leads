'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  BookmarkCheck,
  History,
  LayoutDashboard,
  Settings,
  Building2,
} from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Buscar Leads', href: '/', icon: Search },
    { name: 'Meus Leads', href: '/my-leads', icon: BookmarkCheck },
    { name: 'Histórico', href: '/history', icon: History },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col min-h-screen border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-wide text-white">
            LeadFinder
          </h1>
          <span className="text-xs text-blue-400 font-medium">Local Prospecting B2B</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-150',
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive ? 'text-white' : 'text-slate-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status Card */}
      <div className="p-4 m-4 bg-slate-800/80 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">Provedor Ativo</span>
        </div>
        <p className="text-xs text-slate-400 truncate">
          {process.env.NEXT_PUBLIC_PROVIDER_NAME || 'OpenStreetMap / Mock'}
        </p>
      </div>
    </aside>
  );
}
