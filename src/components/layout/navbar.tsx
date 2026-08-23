'use client';

import { User } from 'lucide-react';

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export function Navbar({ title = 'Prospecção Comercial', subtitle }: NavbarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-800 leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Quick User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-700 leading-none">Comercial</p>
            <p className="text-xs text-slate-400 mt-0.5">LeadFinder Local</p>
          </div>
        </div>
      </div>
    </header>
  );
}
