import { BusinessProvider } from './business-provider.interface';
import { MockBusinessProvider } from './mock-business.provider';
import { NominatimOverpassProvider } from './nominatim-overpass.provider';
import { GooglePlacesProvider } from './google-places.provider';
import { SearchBusinessesParams, Business } from '@/types/business';
import { deduplicateBusinesses } from '../deduplication/deduplication';

export interface SearchResponseResult {
  businesses: Business[];
  providerUsed: 'google' | 'nominatim' | 'mock';
  isFallback: boolean;
}

export class ProviderFactory {
  static getProvider(providerName?: string): BusinessProvider {
    const selected = providerName || process.env.BUSINESS_PROVIDER || 'google';

    switch (selected.toLowerCase()) {
      case 'nominatim':
      case 'osm':
      case 'openstreetmap':
        return new NominatimOverpassProvider();
      case 'mock':
        return new MockBusinessProvider();
      case 'google':
      default:
        return new GooglePlacesProvider();
    }
  }

  /**
   * Executa a busca estritamente através do provedor selecionado.
   * Se não houver dados no mapa para a localização, retorna 0 resultados ("Não encontrado"),
   * sem gerar dados fictícios.
   */
  static async searchWithMeta(params: SearchBusinessesParams): Promise<SearchResponseResult> {
    const primaryProvider = ProviderFactory.getProvider(params.provider);
    let results: Business[] = [];
    let providerUsed: 'google' | 'nominatim' | 'mock' =
      primaryProvider instanceof GooglePlacesProvider
        ? 'google'
        : primaryProvider instanceof NominatimOverpassProvider
        ? 'nominatim'
        : 'mock';
    let isFallback = false;

    try {
      results = await primaryProvider.searchBusinesses(params);
    } catch (err) {
      console.warn(`Erro no provedor ${primaryProvider.name}:`, err);
    }

    // Se o provedor primário era Google e retornou 0, tenta Nominatim em tempo real
    if (results.length === 0 && providerUsed === 'google') {
      try {
        const osmProvider = new NominatimOverpassProvider();
        results = await osmProvider.searchBusinesses(params);
        if (results.length > 0) {
          providerUsed = 'nominatim';
          isFallback = true;
        }
      } catch (e) {
        console.warn('Busca no OpenStreetMap retornou 0 resultados:', e);
      }
    }

    // REGRA RÍGIDA DE PRODUÇÃO: NUNCA acionar gerador fictício.
    // Retorna exatamente a lista encontrada (ou vazia [0 resultados]).

    const deduplicated = deduplicateBusinesses(results);

    return {
      businesses: deduplicated,
      providerUsed,
      isFallback,
    };
  }

  static async search(params: SearchBusinessesParams): Promise<Business[]> {
    const res = await ProviderFactory.searchWithMeta(params);
    return res.businesses;
  }
}
