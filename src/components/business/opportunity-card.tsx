'use client';

import { OpportunityInfo } from '@/types/business';
import { Lightbulb, Code2, Cpu, Search, CheckCircle2, ArrowRight } from 'lucide-react';

interface OpportunityCardProps {
  opportunities: OpportunityInfo[];
  onSelectService?: (serviceName: string) => void;
}

export function OpportunityCard({ opportunities, onSelectService }: OpportunityCardProps) {
  if (opportunities.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-xs italic">
        Nenhuma oportunidade óbvia detectada automaticamente.
      </div>
    );
  }

  const getIcon = (category: OpportunityInfo['category']) => {
    switch (category) {
      case 'WEB':
        return Code2;
      case 'SYSTEM':
      case 'AUTOMATION':
        return Cpu;
      case 'SEO':
        return Search;
      default:
        return Lightbulb;
    }
  };

  return (
    <div className="space-y-3">
      {opportunities.map((opp) => {
        const Icon = getIcon(opp.category);
        return (
          <div
            key={opp.id}
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/80 transition-all flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800">{opp.title}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {opp.suggestedService}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{opp.description}</p>
              </div>
            </div>

            {onSelectService && (
              <button
                type="button"
                onClick={() => onSelectService(opp.suggestedService)}
                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 shrink-0"
              >
                <span>Usar em Abordagem</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
