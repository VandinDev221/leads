import { BusinessProvider } from './business-provider.interface';
import { Business, SearchBusinessesParams } from '@/types/business';

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

  private baseDatabase: Array<Omit<Business, 'distanceKm'>> = [
    // São Luís - MA (Coordenadas ~ -2.5307, -44.3068)
    {
      id: 'mock-slz-1',
      externalId: 'place-slz-barber-1',
      name: 'Barbearia Don Corleone',
      category: 'Barbearia',
      categories: ['Barbearia', 'Cabelo & Barba', 'Estética Masculina'],
      address: 'Av. dos Holandeses, 1000 - Calhau',
      city: 'São Luís',
      state: 'MA',
      country: 'Brasil',
      postalCode: '65071-380',
      latitude: -2.4925,
      longitude: -44.2589,
      phone: '(98) 98123-4567',
      whatsapp: '5598981234567',
      website: 'https://doncorleonebarbearia.com.br',
      instagram: '@doncorleoneslz',
      rating: 4.9,
      reviewCount: 142,
      openingHours: 'Seg-Sáb: 09:00 - 20:00',
      mapsUrl: 'https://maps.google.com/?q=-2.4925,-44.2589',
      source: 'Mock Provider',
      sourceUrl: 'https://doncorleonebarbearia.com.br',
    },
    {
      id: 'mock-slz-2',
      externalId: 'place-slz-barber-2',
      name: 'Barbearia Vintage Club',
      category: 'Barbearia',
      categories: ['Barbearia', 'Cabelereiro'],
      address: 'Rua das Gaivotas, 45 - Renascença',
      city: 'São Luís',
      state: 'MA',
      country: 'Brasil',
      postalCode: '65075-400',
      latitude: -2.5034,
      longitude: -44.2712,
      phone: '(98) 98877-6655',
      whatsapp: '5598988776655',
      website: undefined,
      instagram: '@vintageclub_slz',
      rating: 4.7,
      reviewCount: 89,
      openingHours: 'Seg-Sáb: 08:30 - 19:30',
      mapsUrl: 'https://maps.google.com/?q=-2.5034,-44.2712',
      source: 'Mock Provider',
    },
    {
      id: 'mock-slz-3',
      externalId: 'place-slz-barber-3',
      name: 'Barbearia do Zé',
      category: 'Barbearia',
      categories: ['Barbearia'],
      address: 'Rua Grande, 512 - Centro',
      city: 'São Luís',
      state: 'MA',
      country: 'Brasil',
      postalCode: '65020-250',
      latitude: -2.5298,
      longitude: -44.3025,
      phone: '(98) 3232-1122',
      whatsapp: undefined,
      website: undefined,
      instagram: undefined,
      rating: 4.5,
      reviewCount: 34,
      openingHours: 'Seg-Sáb: 08:00 - 18:00',
      mapsUrl: 'https://maps.google.com/?q=-2.5298,-44.3025',
      source: 'Mock Provider',
    },
    {
      id: 'mock-slz-4',
      externalId: 'place-slz-dentist-1',
      name: 'Clínica Odontológica OdontoPrime',
      category: 'Clínica odontológica',
      categories: ['Clínica odontológica', 'Dentista', 'Ortodontia'],
      address: 'Av. Colares Moreira, 400 - Renascença II',
      city: 'São Luís',
      state: 'MA',
      country: 'Brasil',
      postalCode: '65075-440',
      latitude: -2.4998,
      longitude: -44.2685,
      phone: '(98) 3214-9900',
      whatsapp: '5598932149900',
      website: 'https://odontoprimeslz.com.br',
      instagram: '@odontoprimeslz',
      rating: 4.8,
      reviewCount: 210,
      openingHours: 'Seg-Sex: 08:00 - 19:00, Sáb: 08:00 - 12:00',
      mapsUrl: 'https://maps.google.com/?q=-2.4998,-44.2685',
      source: 'Mock Provider',
    },
    {
      id: 'mock-slz-5',
      externalId: 'place-slz-restaurant-1',
      name: 'Restaurante Cabana do Sol',
      category: 'Restaurante',
      categories: ['Restaurante', 'Culinária Regional', 'Gastronomia'],
      address: 'Av. Litorânea, 12 - Ponta do Farol',
      city: 'São Luís',
      state: 'MA',
      country: 'Brasil',
      postalCode: '65076-170',
      latitude: -2.4862,
      longitude: -44.2541,
      phone: '(98) 3235-2323',
      whatsapp: '5598932352323',
      website: 'https://cabanadosol.com.br',
      instagram: '@cabanadosol',
      rating: 4.9,
      reviewCount: 1540,
      openingHours: 'Seg-Dom: 11:30 - 23:30',
      mapsUrl: 'https://maps.google.com/?q=-2.4862,-44.2541',
      source: 'Mock Provider',
    },
    {
      id: 'mock-slz-6',
      externalId: 'place-slz-gym-1',
      name: 'Academia FitStudio',
      category: 'Academia',
      categories: ['Academia', 'Fitness', 'Musculação'],
      address: 'Av. Daniel de La Touche, 1500 - Cohama',
      city: 'São Luís',
      state: 'MA',
      country: 'Brasil',
      postalCode: '65074-115',
      latitude: -2.5185,
      longitude: -44.2488,
      phone: '(98) 99188-3344',
      whatsapp: '5598991883344',
      website: 'https://fitstudioslz.com.br',
      instagram: '@fitstudioslz',
      rating: 4.6,
      reviewCount: 95,
      openingHours: 'Seg-Sex: 05:30 - 22:30, Sáb: 08:00 - 16:00',
      mapsUrl: 'https://maps.google.com/?q=-2.5185,-44.2488',
      source: 'Mock Provider',
    },
    {
      id: 'mock-slz-7',
      externalId: 'place-slz-pet-1',
      name: 'Pet Shop Bicho Estimado',
      category: 'Pet shop',
      categories: ['Pet shop', 'Veterinária', 'Banho e Tosa'],
      address: 'Av. São Luís Rei de França, 80 - Turu',
      city: 'São Luís',
      state: 'MA',
      country: 'Brasil',
      postalCode: '65065-470',
      latitude: -2.5098,
      longitude: -44.2215,
      phone: '(98) 3248-5050',
      whatsapp: '5598932485050',
      website: undefined,
      instagram: '@bichoestimado_turu',
      rating: 4.7,
      reviewCount: 68,
      openingHours: 'Seg-Sáb: 08:00 - 18:30',
      mapsUrl: 'https://maps.google.com/?q=-2.5098,-44.2215',
      source: 'Mock Provider',
    },
    {
      id: 'mock-slz-8',
      externalId: 'place-slz-auto-1',
      name: 'Oficina Mecânica AutoCenter Express',
      category: 'Oficina mecânica',
      categories: ['Oficina mecânica', 'Autopeças', 'Manutenção Automotiva'],
      address: 'Av. Jerônimo de Albuquerque, 2200 - Vinhais',
      city: 'São Luís',
      state: 'MA',
      country: 'Brasil',
      postalCode: '65070-000',
      latitude: -2.5210,
      longitude: -44.2610,
      phone: '(98) 3251-4040',
      whatsapp: '5598932514040',
      website: 'https://autocenterexpress.com.br',
      instagram: '@autocenterexpress',
      rating: 4.4,
      reviewCount: 52,
      openingHours: 'Seg-Sex: 08:00 - 18:00',
      mapsUrl: 'https://maps.google.com/?q=-2.5210,-44.2610',
      source: 'Mock Provider',
    },
    // São Paulo - SP
    {
      id: 'mock-sp-1',
      externalId: 'place-sp-barber-1',
      name: 'Barbearia Corleone Paulista',
      category: 'Barbearia',
      categories: ['Barbearia', 'Estética'],
      address: 'Alameda Santos, 1200 - Cerqueira César',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      postalCode: '01418-100',
      latitude: -23.5628,
      longitude: -46.6548,
      phone: '(11) 3251-0011',
      whatsapp: '5511932510011',
      website: 'https://barbeariacorleone.com.br',
      instagram: '@barbeariacorleone',
      rating: 4.9,
      reviewCount: 890,
      openingHours: 'Seg-Sáb: 09:00 - 21:00',
      mapsUrl: 'https://maps.google.com/?q=-23.5628,-46.6548',
      source: 'Mock Provider',
    },
  ];

  async searchBusinesses(params: SearchBusinessesParams): Promise<Business[]> {
    const { category, location, radiusKm, filters } = params;

    // Centro padrão para busca caso latitude/longitude não venham informados
    let centerLat = -2.5298; // São Luís
    let centerLng = -44.3025;

    const locLower = location.toLowerCase();
    if (locLower.includes('são paulo') || locLower.includes('sp')) {
      centerLat = -23.5505;
      centerLng = -46.6333;
    } else if (locLower.includes('rio') || locLower.includes('rj')) {
      centerLat = -22.9068;
      centerLng = -43.1729;
    }

    if (params.latitude && params.longitude) {
      centerLat = params.latitude;
      centerLng = params.longitude;
    }

    const catLower = category.toLowerCase().trim();

    // Filtrar por categoria e calcular distância
    let results: Business[] = this.baseDatabase
      .map((item) => {
        const dist = calculateHaversineDistance(
          centerLat,
          centerLng,
          item.latitude,
          item.longitude
        );

        return {
          ...item,
          distanceKm: dist,
        };
      })
      .filter((item) => {
        // Filtragem por distância do raio
        if (item.distanceKm > radiusKm) return false;

        // Filtragem por categoria (match flexível)
        if (catLower) {
          const matchCategory = item.category.toLowerCase().includes(catLower);
          const matchSubCategory = item.categories?.some((c) =>
            c.toLowerCase().includes(catLower)
          );
          if (!matchCategory && !matchSubCategory) return false;
        }

        // Filtros opcionais adicionais
        if (filters?.hasPhone && !item.phone) return false;
        if (filters?.hasWebsite && !item.website) return false;
        if (filters?.hasWhatsapp && !item.whatsapp) return false;
        if (filters?.hasInstagram && !item.instagram) return false;
        if (filters?.minRating && (item.rating || 0) < filters.minRating) return false;
        if (filters?.minReviews && (item.reviewCount || 0) < filters.minReviews)
          return false;

        return true;
      });

    // Se nenhum item foi encontrado para a categoria na base fixa, gerar 3 estabelecimentos realistas no raio
    if (results.length === 0 && catLower) {
      const generated: Business[] = [
        {
          id: `gen-1-${Date.now()}`,
          externalId: `gen-place-1-${catLower}`,
          name: `${category} Premium ${location.split('-')[0].trim()}`,
          category: category,
          categories: [category, 'Serviços'],
          address: `Av. Principal, 100 - Center`,
          city: location.split('-')[0]?.trim() || 'Cidade Local',
          state: location.split('-')[1]?.trim() || 'BR',
          country: 'Brasil',
          latitude: centerLat + 0.008,
          longitude: centerLng + 0.006,
          distanceKm: 1.2,
          phone: '(98) 99123-9988',
          whatsapp: '5598991239988',
          website: `https://${catLower.replace(/[^a-z]/g, '')}local.com.br`,
          instagram: `@${catLower.replace(/[^a-z]/g, '')}_local`,
          rating: 4.8,
          reviewCount: 45,
          openingHours: 'Seg-Sáb: 08:00 - 18:00',
          mapsUrl: `https://maps.google.com/?q=${centerLat + 0.008},${centerLng + 0.006}`,
          source: 'Mock Provider',
        },
        {
          id: `gen-2-${Date.now()}`,
          externalId: `gen-place-2-${catLower}`,
          name: `Centro de ${category} & Cia`,
          category: category,
          categories: [category],
          address: `Rua Comercial, 450 - Bairro Nobre`,
          city: location.split('-')[0]?.trim() || 'Cidade Local',
          state: location.split('-')[1]?.trim() || 'BR',
          country: 'Brasil',
          latitude: centerLat - 0.012,
          longitude: centerLng - 0.009,
          distanceKm: 2.4,
          phone: '(98) 3245-8811',
          whatsapp: '559893248811',
          website: undefined,
          instagram: `@${catLower.replace(/[^a-z]/g, '')}_cia`,
          rating: 4.6,
          reviewCount: 28,
          openingHours: 'Seg-Sex: 08:00 - 19:00',
          mapsUrl: `https://maps.google.com/?q=${centerLat - 0.012},${centerLng - 0.009}`,
          source: 'Mock Provider',
        },
        {
          id: `gen-3-${Date.now()}`,
          externalId: `gen-place-3-${catLower}`,
          name: `Espaço ${category} Express`,
          category: category,
          categories: [category, 'Atendimento Rápido'],
          address: `Alameda das Flores, 88`,
          city: location.split('-')[0]?.trim() || 'Cidade Local',
          state: location.split('-')[1]?.trim() || 'BR',
          country: 'Brasil',
          latitude: centerLat + 0.018,
          longitude: centerLng - 0.015,
          distanceKm: 3.8,
          phone: '(98) 98811-0022',
          whatsapp: '5598988110022',
          website: `https://espaco${catLower.replace(/[^a-z]/g, '')}.com`,
          instagram: undefined,
          rating: 4.5,
          reviewCount: 19,
          openingHours: 'Seg-Sáb: 09:00 - 19:00',
          mapsUrl: `https://maps.google.com/?q=${centerLat + 0.018},${centerLng - 0.015}`,
          source: 'Mock Provider',
        },
      ];

      return generated.filter((g) => (g.distanceKm || 0) <= radiusKm);
    }

    return results;
  }
}
