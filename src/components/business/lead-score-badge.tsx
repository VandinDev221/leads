'use client';

import { LeadScoreInfo } from '@/types/business';
import { Flame, Sparkles, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

interface LeadScoreBadgeProps {
  scoreInfo?: LeadScoreInfo;
  size?: 'sm' | 'md';
}

export function LeadScoreBadge({ scoreInfo, size = 'md' }: LeadScoreBadgeProps) {
  if (!scoreInfo) return null;

  const isHigh = scoreInfo.badge === 'HIGH_OPPORTUNITY';
  const isMed = scoreInfo.badge === 'MEDIUM_OPPORTUNITY';

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 font-bold rounded-lg border transition-all',
        scoreInfo.color,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      )}
      title={`Pontuação da oportunidade: ${scoreInfo.opportunityScore} | Pontuação geral: ${scoreInfo.totalScore}`}
    >
      {isHigh && <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
      {isMed && <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
      {!isHigh && !isMed && <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
      <span>{scoreInfo.label}</span>
    </div>
  );
}
