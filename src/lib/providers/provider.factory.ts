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
    const hasGoogleKey = Boolean(process.env.GOOGLE_MAPS_API_KEY);
    const selected = providerName || (hasGoogleKey ? 'google' : process.env.BUSINESS_PROVIDER || 'nominatim');

    switch (selected.toLowerCase()) {
      case 'google':
        return new GooglePlacesProvider();
      case 'nominatim':
      case 'osm':
      case 'openstreetmap':
        return new NominatimOverpassProvider();
      case 'mock':
      default:
        return new MockBusinessProvider();
    }
  }

  /**
   * Executa a busca através do provedor selecionado com fallback automático
   * e indica de forma transparente ao frontend qual provedor respondeu.
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
      console.warn(`Erro no provedor ${primaryProvider.name}, acionando fallback:`, err);
    }

    // Se o provedor primário não retornou resultados suficientes, tentar Nominatim se era Google ou vice-versa, ou acionar o gerador local B2B
    if (results.length === 0 && providerUsed === 'google') {
      try {
        const osmProvider = new NominatimOverpassProvider();
        results = await osmProvider.searchBusinesses(params);
        if (results.length > 0) {
          providerUsed = 'nominatim';
          isFallback = true;
        }
      } catch (e) {
        console.warn('Fallback OSM falhou:', e);
      }
    }

    // Se ainda assim tiver 0 resultados (cidade pequena sem POIs mapeados no OSM), usar gerador B2B contextual
    if (results.length === 0) {
      const mockProvider = new MockBusinessProvider();
      results = await mockProvider.searchBusinesses(params);
      providerUsed = 'mock';
      isFallback = true;
    }

    // Deduplicação final obrigatória
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
