import { BusinessProvider } from './business-provider.interface';
import { Business, SearchBusinessesParams } from '@/types/business';
import { getCityCoordinates } from './city-geocoder';

// Cálculo da fórmula de Haversine para distâncias em km
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export class MockBusinessProvider implements BusinessProvider {
  name = 'Mock Data Provider';

  async searchBusinesses(params: SearchBusinessesParams): Promise<Business[]> {
    const { category, location, radiusKm, filters } = params;

    // Resolve as coordenadas e informações reais da cidade digitada pelo usuário
    const cityInfo = getCityCoordinates(location);
    const centerLat = params.latitude || cityInfo.lat;
    const centerLng = params.longitude || cityInfo.lng;
    const cityName = cityInfo.name;
    const stateName = cityInfo.state;
    const ddd = cityInfo.ddd;

    const catLower = category.toLowerCase().trim();

    // Gerar estabelecimentos realistas no centro e no raio exato da cidade pesquisada
    const generated: Business[] = [
      {
        id: `mock-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-1`,
        externalId: `place-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-1`,
        name: `${category} Premium ${cityName}`,
        category: category,
        categories: [category, 'Serviços'],
        address: `Av. Principal, 1000 - Centro`,
        city: cityName,
        state: stateName,
        country: 'Brasil',
        latitude: centerLat + 0.005,
        longitude: centerLng + 0.004,
        distanceKm: 0.8,
        phone: `(${ddd}) 98123-4567`,
        whatsapp: `55${ddd}981234567`,
        website: `https://${catLower.replace(/[^a-z]/g, '')}${cityName.toLowerCase().replace(/[^a-z]/g, '')}.com.br`,
        instagram: `@${catLower.replace(/[^a-z]/g, '')}_${cityName.toLowerCase().replace(/[^a-z]/g, '')}`,
        rating: 4.9,
        reviewCount: 142,
        openingHours: 'Seg-Sáb: 08:30 - 20:00',
        mapsUrl: `https://maps.google.com/?q=${centerLat + 0.005},${centerLng + 0.004}`,
        source: 'Mock Provider',
      },
      {
        id: `mock-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-2`,
        externalId: `place-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-2`,
        name: `${category} Vintage Club`,
        category: category,
        categories: [category, 'Atendimento Executivo'],
        address: `Rua Comercial, 45 - Bairro Nobre`,
        city: cityName,
        state: stateName,
        country: 'Brasil',
        latitude: centerLat - 0.008,
        longitude: centerLng - 0.006,
        distanceKm: 1.4,
        phone: `(${ddd}) 98877-6655`,
        whatsapp: `55${ddd}988776655`,
        website: undefined,
        instagram: `@${catLower.replace(/[^a-z]/g, '')}_club`,
        rating: 4.7,
        reviewCount: 89,
        openingHours: 'Seg-Sáb: 08:00 - 19:30',
        mapsUrl: `https://maps.google.com/?q=${centerLat - 0.008},${centerLng - 0.006}`,
        source: 'Mock Provider',
      },
      {
        id: `mock-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-3`,
        externalId: `place-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-3`,
        name: `Centro de ${category} ${cityName}`,
        category: category,
        categories: [category],
        address: `Av. das Flores, 512 - Jardim América`,
        city: cityName,
        state: stateName,
        country: 'Brasil',
        latitude: centerLat + 0.014,
        longitude: centerLng - 0.012,
        distanceKm: 2.3,
        phone: `(${ddd}) 3232-1122`,
        whatsapp: undefined,
        website: undefined,
        instagram: undefined,
        rating: 4.5,
        reviewCount: 34,
        openingHours: 'Seg-Sáb: 08:00 - 18:00',
        mapsUrl: `https://maps.google.com/?q=${centerLat + 0.014},${centerLng - 0.012}`,
        source: 'Mock Provider',
      },
      {
        id: `mock-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-4`,
        externalId: `place-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-4`,
        name: `Espaço ${category} Express`,
        category: category,
        categories: [category, 'Especializada'],
        address: `Alameda dos Ipês, 88 - Parque Central`,
        city: cityName,
        state: stateName,
        country: 'Brasil',
        latitude: centerLat - 0.018,
        longitude: centerLng + 0.015,
        distanceKm: 3.1,
        phone: `(${ddd}) 99188-3344`,
        whatsapp: `55${ddd}991883344`,
        website: `https://espaco${catLower.replace(/[^a-z]/g, '')}.com`,
        instagram: `@espaco_${catLower.replace(/[^a-z]/g, '')}`,
        rating: 4.8,
        reviewCount: 210,
        openingHours: 'Seg-Sex: 08:00 - 19:00, Sáb: 08:00 - 12:00',
        mapsUrl: `https://maps.google.com/?q=${centerLat - 0.018},${centerLng + 0.015}`,
        source: 'Mock Provider',
      },
      {
        id: `mock-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-5`,
        externalId: `place-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-5`,
        name: `${category} & Companhia`,
        category: category,
        categories: [category],
        address: `Av. Beira Mar, 2200 - Orla`,
        city: cityName,
        state: stateName,
        country: 'Brasil',
        latitude: centerLat + 0.025,
        longitude: centerLng + 0.022,
        distanceKm: 4.2,
        phone: `(${ddd}) 3251-4040`,
        whatsapp: `55${ddd}32514040`,
        website: `https://${catLower.replace(/[^a-z]/g, '')}cia.com.br`,
        instagram: `@${catLower.replace(/[^a-z]/g, '')}cia`,
        rating: 4.6,
        reviewCount: 95,
        openingHours: 'Seg-Dom: 09:00 - 22:00',
        mapsUrl: `https://maps.google.com/?q=${centerLat + 0.025},${centerLng + 0.022}`,
        source: 'Mock Provider',
      },
    ];

    return generated.filter((item) => {
      if ((item.distanceKm || 0) > radiusKm) return false;
      if (filters?.hasPhone && !item.phone) return false;
      if (filters?.hasWebsite && !item.website) return false;
      if (filters?.hasWhatsapp && !item.whatsapp) return false;
      if (filters?.hasInstagram && !item.instagram) return false;
      if (filters?.minRating && (item.rating || 0) < filters.minRating) return false;
      if (filters?.minReviews && (item.reviewCount || 0) < filters.minReviews)
        return false;
      return true;
    });
  }
}
