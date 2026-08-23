import { BusinessProvider } from './business-provider.interface';
import { MockBusinessProvider } from './mock-business.provider';
import { NominatimOverpassProvider } from './nominatim-overpass.provider';
import { GooglePlacesProvider } from './google-places.provider';
import { SearchBusinessesParams, Business } from '@/types/business';
import { deduplicateBusinesses } from '../deduplication/deduplication';

export class ProviderFactory {
  static getProvider(providerName?: string): BusinessProvider {
    const selected = providerName || process.env.BUSINESS_PROVIDER || 'nominatim';

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
   * garantindo que o usuário nunca receba erro e sempre tenha resultados deduplicados.
   */
  static async search(params: SearchBusinessesParams): Promise<Business[]> {
    const provider = ProviderFactory.getProvider(params.provider);
    let results: Business[] = [];

    try {
      results = await provider.searchBusinesses(params);
    } catch (err) {
      console.warn(`Erro no provider ${provider.name}, acionando fallback Mock:`, err);
    }

    // Se o provider primário não retornou resultados ou falhou, usar o MockProvider
    if (results.length === 0) {
      const mockProvider = new MockBusinessProvider();
      results = await mockProvider.searchBusinesses(params);
    }

    // Deduplicação final obrigatória
    return deduplicateBusinesses(results);
  }
}
