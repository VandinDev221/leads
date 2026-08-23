'use client';

import dynamic from 'next/dynamic';
import { Business } from '@/types/business';

const DynamicMap = dynamic(() => import('./business-map-inner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200 text-slate-400">
      <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
      <span className="text-sm font-medium">Carregando mapa interativo...</span>
    </div>
  ),
});

interface BusinessMapProps {
  businesses: Business[];
  onSelectBusiness: (business: Business) => void;
  center?: [number, number];
}

export function BusinessMap(props: BusinessMapProps) {
  return <DynamicMap {...props} />;
}
