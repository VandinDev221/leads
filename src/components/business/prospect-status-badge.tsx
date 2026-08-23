'use client';

import { ProspectStatus } from '@/types/business';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface ProspectStatusBadgeProps {
  status: ProspectStatus;
  onChangeStatus?: (newStatus: ProspectStatus) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const STATUS_CONFIG: Record<
  ProspectStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  NOVO: {
    label: 'Novo',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
  },
  CONTATAR: {
    label: 'Contatar',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  CONTATADO: {
    label: 'Contatado',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  RESPONDEU: {
    label: 'Respondeu',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  INTERESSADO: {
    label: 'Interessado',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  SEM_INTERESSE: {
    label: 'Sem interesse',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  CLIENTE: {
    label: 'Cliente',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
  },
};

export function ProspectStatusBadge({
  status,
  onChangeStatus,
  disabled = false,
  size = 'md',
}: ProspectStatusBadgeProps) {
  const current = STATUS_CONFIG[status] || STATUS_CONFIG.NOVO;

  if (!onChangeStatus || disabled) {
    return (
      <span
        className={clsx(
          'inline-flex items-center font-semibold rounded-full border',
          current.bg,
          current.text,
          current.border,
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
        )}
      >
        {current.label}
      </span>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <select
        value={status}
        onChange={(e) => onChangeStatus(e.target.value as ProspectStatus)}
        className={clsx(
          'appearance-none font-semibold rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 pr-6 transition-all',
          current.bg,
          current.text,
          current.border,
          size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
        )}
      >
        {Object.entries(STATUS_CONFIG).map(([key, item]) => (
          <option key={key} value={key} className="bg-white text-slate-800 font-normal">
            {item.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className={clsx(
          'w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none',
          current.text
        )}
      />
    </div>
  );
}
