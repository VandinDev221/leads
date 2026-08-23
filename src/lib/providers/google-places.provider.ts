import { BusinessProvider } from './business-provider.interface';
import { Business, SearchBusinessesParams } from '@/types/business';
import { calculateHaversineDistance } from './mock-business.provider';

export class GooglePlacesProvider implements BusinessProvider {
  name = 'Google Places API';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_MAPS_API_KEY || '';
  }

  async searchBusinesses(params: SearchBusinessesParams): Promise<Business[]> {
    if (!this.apiKey) {
      console.warn('Google Places API key ausente. Utilize o MockProvider ou NominatimProvider.');
      return [];
    }

    const { category, location, radiusKm, filters } = params;
    const radiusMeters = Math.min(radiusKm * 1000, 50000); // Max 50km no Google

    try {
      // 1. Text Search query
      const query = `${category} em ${location}`;
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&radius=${radiusMeters}&key=${this.apiKey}&language=pt-BR`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google API retornou status HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.warn('Google Places API Status:', data.status, data.error_message);
      }

      const results = data.results || [];

      // Buscar detalhes se necessário (ou utilizar dados da busca textual)
      const businesses: Business[] = results.map((place: any) => {
        const lat = place.geometry?.location?.lat || 0;
        const lng = place.geometry?.location?.lng || 0;
        const address = place.formatted_address || place.vicinity || 'Não informado';

        // Estimar distância do centro aproximado
        const centerLat = params.latitude || lat;
        const centerLng = params.longitude || lng;
        const dist = calculateHaversineDistance(centerLat, centerLng, lat, lng);

        return {
          id: `google-${place.place_id}`,
          externalId: place.place_id,
          name: place.name,
          category: category,
          categories: place.types || [category],
          address: address,
          city: location.split('-')[0]?.trim() || 'Não informado',
          state: location.split('-')[1]?.trim() || undefined,
          country: 'Brasil',
          latitude: lat,
          longitude: lng,
          distanceKm: dist,
          phone: undefined, // Google Text Search não retorna fone direto (requer Place Details)
          website: undefined,
          rating: place.rating || undefined,
          reviewCount: place.user_ratings_total || undefined,
          openingHours: place.opening_hours?.open_now ? 'Aberto agora' : 'Fechado',
          mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          source: 'Google Places',
          sourceUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        };
      });

      return businesses.filter((b) => {
        if (filters?.minRating && (b.rating || 0) < filters.minRating) return false;
        if (filters?.minReviews && (b.reviewCount || 0) < filters.minReviews) return false;
        return true;
      });
    } catch (err) {
      console.error('Erro na integração com Google Places API:', err);
      return [];
    }
  }
}
