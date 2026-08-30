import { BusinessProvider } from './business-provider.interface';
import { Business, SearchBusinessesParams } from '@/types/business';
import { calculateHaversineDistance } from './mock-business.provider';
import { formatWhatsappUrl, formatPhoneDisplay } from '../utils/formatters';

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

      const results = (data.results || []).slice(0, 20); // Top 20 resultados do Google

      // 2. Buscar detalhes de telefone e site via Place Details para cada empresa encontrada
      const detailedBusinesses: Business[] = await Promise.all(
        results.map(async (place: any) => {
          const lat = place.geometry?.location?.lat || 0;
          const lng = place.geometry?.location?.lng || 0;
          const address = place.formatted_address || place.vicinity || 'Não informado';

          const centerLat = params.latitude || lat;
          const centerLng = params.longitude || lng;
          const dist = calculateHaversineDistance(centerLat, centerLng, lat, lng);

          let phone: string | undefined = undefined;
          let website: string | undefined = undefined;

          // Consulta de Detalhes no Google Places
          try {
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,international_phone_number,website&key=${this.apiKey}&language=pt-BR`;
            const detRes = await fetch(detailsUrl);
            if (detRes.ok) {
              const detData = await detRes.json();
              if (detData.result) {
                const rawPhone =
                  detData.result.formatted_phone_number ||
                  detData.result.international_phone_number;
                phone = formatPhoneDisplay(rawPhone) || undefined;
                website = detData.result.website || undefined;
              }
            }
          } catch (detErr) {
            console.warn('Erro ao buscar detalhes do Place Google:', detErr);
          }

          const waUrl = formatWhatsappUrl(phone);

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
            phone: phone,
            website: website,
            whatsapp: waUrl ? waUrl.replace('https://wa.me/', '') : undefined,
            rating: place.rating || undefined,
            reviewCount: place.user_ratings_total || undefined,
            openingHours: place.opening_hours?.open_now ? 'Aberto agora' : 'Fechado',
            mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            source: 'Google Places',
            sourceUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          };
        })
      );

      return detailedBusinesses.filter((b) => {
        if (filters?.hasPhone && !b.phone) return false;
        if (filters?.hasWebsite && !b.website) return false;
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
