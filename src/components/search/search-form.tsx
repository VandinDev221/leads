'use client';

import { useState } from 'react';
import { SearchBusinessesParams, SearchFilters } from '@/types/business';
import {
  Search,
  MapPin,
  Compass,
  SlidersHorizontal,
  Phone,
  Globe,
  MessageCircle,
  Star,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface SearchFormProps {
  onSearch: (params: SearchBusinessesParams) => void;
  isLoading: boolean;
}

const PRESET_CATEGORIES = [
  'Barbearia',
  'Salão de beleza',
  'Clínica odontológica',
  'Consultório médico',
  'Oficina mecânica',
  'Autopeças',
  'Restaurante',
  'Academia',
  'Pet shop',
  'Loja de roupas',
  'Mercado',
  'Imobiliária',
  'Contabilidade',
  'Advocacia',
];

const PRESET_CITIES = [
  'Santa Inês - MA',
  'São Luís - MA',
  'Imperatriz - MA',
  'Açailândia - MA',
  'Bacabal - MA',
  'Caxias - MA',
  'Balsas - MA',
  'São Paulo - SP',
  'Campinas - SP',
  'Rio de Janeiro - RJ',
  'Belo Horizonte - MG',
  'Brasília - DF',
  'Curitiba - PR',
  'Porto Alegre - RS',
  'Salvador - BA',
  'Fortaleza - CE',
  'Recife - PE',
  'Goiânia - GO',
  'Belém - PA',
  'Manaus - AM',
];

const RADIUS_OPTIONS = [1, 2, 5, 10, 20, 30, 50];

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [category, setCategory] = useState('Barbearia');
  const [location, setLocation] = useState('Santa Inês - MA');
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [customRadius, setCustomRadius] = useState<string>('');
  const [isCustomRadius, setIsCustomRadius] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Filtros Adicionais
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    hasPhone: false,
    hasWebsite: false,
    hasWhatsapp: false,
    hasInstagram: false,
    minRating: undefined,
    openNow: false,
    onlyUnprospecting: false,
  });

  const handleUseLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setLocation(`Localização Atual (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
        },
        (error) => {
          alert('Não foi possível obter a geolocalização. Por favor, selecione uma cidade.');
        }
      );
    } else {
      alert('Navegador não suporta geolocalização.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) {
      alert('Por favor, informe uma categoria.');
      return;
    }
    if (!location.trim()) {
      alert('Por favor, informe uma localização.');
      return;
    }

    const effectiveRadius = isCustomRadius ? Number(customRadius) || 10 : radiusKm;

    onSearch({
      category: category.trim(),
      location: location.trim(),
      latitude: userCoords?.lat,
      longitude: userCoords?.lng,
      radiusKm: effectiveRadius,
      filters,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Categoria */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Categoria do Estabelecimento
            </label>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Barbearia, Restaurante..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
              <datalist id="category-suggestions">
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            {/* Quick Category Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESET_CATEGORIES.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-all ${
                    category.toLowerCase() === cat.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Localização (Seletor + Input com Autocomplete) */}
          <div className="md:col-span-4">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase text-slate-500">
                Localização / Cidade
              </label>
              <button
                type="button"
                onClick={handleUseLocation}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" /> Usar GPS
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                list="city-suggestions"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setUserCoords(null);
                }}
                placeholder="Selecione ou digite a cidade..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
              <datalist id="city-suggestions">
                {PRESET_CITIES.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>

            {/* Quick City Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['Santa Inês - MA', 'São Luís - MA', 'Imperatriz - MA', 'São Paulo - SP'].map(
                (city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setLocation(city);
                      setUserCoords(null);
                    }}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-all ${
                      location.toLowerCase() === city.toLowerCase()
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {city.split('-')[0].trim()}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Raio */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Raio de busca
            </label>
            {!isCustomRadius ? (
              <select
                value={radiusKm}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomRadius(true);
                  } else {
                    setRadiusKm(Number(e.target.value));
                  }
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r} km
                  </option>
                ))}
                <option value="custom">Personalizado...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customRadius}
                  onChange={(e) => setCustomRadius(e.target.value)}
                  placeholder="Raio (km)"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomRadius(false)}
                  className="text-xs text-slate-500 underline whitespace-nowrap"
                >
                  Padrão
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação e Toggle de Filtros */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filtros adicionais</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showFilters ? 'rotate-180' : ''
              }`}
            />
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Buscando empresas...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Buscar Empresas</span>
              </>
            )}
          </button>
        </div>

        {/* Painel de Filtros Adicionais */}
        {showFilters && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasPhone || false}
                onChange={(e) => setFilters({ ...filters, hasPhone: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <Phone className="w-3.5 h-3.5 text-slate-500" /> Possui Telefone
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasWebsite || false}
                onChange={(e) => setFilters({ ...filters, hasWebsite: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <Globe className="w-3.5 h-3.5 text-slate-500" /> Possui Site
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasWhatsapp || false}
                onChange={(e) => setFilters({ ...filters, hasWhatsapp: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <MessageCircle className="w-3.5 h-3.5 text-slate-500" /> Possui WhatsApp
            </label>

            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <select
                value={filters.minRating || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minRating: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 font-medium"
              >
                <option value="">Qualquer avaliação</option>
                <option value="4.0">⭐ 4.0 ou mais</option>
                <option value="4.5">⭐ 4.5 ou mais</option>
                <option value="4.8">⭐ 4.8 ou mais</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
