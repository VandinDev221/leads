'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  BookmarkCheck,
  History,
  LayoutDashboard,
  Settings,
  Building2,
  Kanban,
  Clock,
  CheckSquare,
  Bookmark,
  Layers,
  FileText,
  DollarSign,
  Zap,
} from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar() {
  const pathname = usePathname();
  const [overdueCount, setOverdueCount] = useState<number>(0);

  useEffect(() => {
    async function fetchFollowUpsCount() {
      try {
        const res = await fetch('/api/followups?timeframe=OVERDUE');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setOverdueCount(data.data.length);
        }
      } catch (e) {
        // Silent catch
      }
    }
    fetchFollowUpsCount();
  }, []);

  const groups = [
    {
      title: 'BUSCAR & PIPELINE',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Encontrar Leads', href: '/', icon: Search },
        { name: 'Todos os Leads', href: '/leads', icon: BookmarkCheck },
        { name: 'Pipeline Kanban', href: '/pipeline', icon: Kanban },
        {
          name: 'Follow-ups',
          href: '/follow-ups',
          icon: Clock,
          badge: overdueCount > 0 ? overdueCount : undefined,
        },
        { name: 'Modo Prospecção', href: '/prospecting', icon: Zap },
        { name: 'Tarefas', href: '/tasks', icon: CheckSquare },
      ],
    },
    {
      title: 'ORGANIZAÇÃO',
      items: [
        { name: 'Listas / Segmentos', href: '/lists', icon: Layers },
        { name: 'Buscas Salvas', href: '/searches', icon: Bookmark },
        { name: 'Histórico', href: '/history', icon: History },
      ],
    },
    {
      title: 'COMERCIAL',
      items: [
        { name: 'Templates de Abordagem', href: '/templates', icon: FileText },
        { name: 'Propostas Comercial', href: '/proposals', icon: DollarSign },
      ],
    },
    {
      title: 'SISTEMA',
      items: [{ name: 'Configurações', href: '/settings', icon: Settings }],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col min-h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Header com Nome do SaaS */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight tracking-wide text-white">
            LeadFinder
          </h1>
          <span className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider block">
            Plataforma B2B SaaS
          </span>
        </div>
      </div>

      {/* Navegação Agrupada */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.title} className="space-y-1">
            <span className="block px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {group.title}
            </span>
            {group.items.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center justify-between px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-150',
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={clsx('w-4 h-4', isActive ? 'text-white' : 'text-slate-400')}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-red-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Dica de Atalho */}
      <div className="p-3 m-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-between text-slate-400 text-xs">
        <span className="text-[11px] font-medium">Busca Global</span>
        <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-slate-300">
          Ctrl + K
        </kbd>
      </div>
    </aside>
  );
}
