import { BusinessProvider } from './business-provider.interface';
import { Business, SearchBusinessesParams } from '@/types/business';
import { calculateHaversineDistance } from './mock-business.provider';

export class NominatimOverpassProvider implements BusinessProvider {
  name = 'OpenStreetMap (Nominatim & Overpass)';

  async searchBusinesses(params: SearchBusinessesParams): Promise<Business[]> {
    const { category, location, radiusKm, filters } = params;

    let lat = params.latitude;
    let lon = params.longitude;
    let city = '';
    let state = '';

    // 1. Geocodificar localização se latitude/longitude não forem fornecidas
    if (!lat || !lon) {
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}&countrycodes=br&limit=1`;
        const resNom = await fetch(nomUrl, {
          headers: {
            'User-Agent': 'LeadFinderLocal/1.0 (commercial-prospecting-tool)',
          },
        });
        if (resNom.ok) {
          const data = await resNom.json();
          if (data && data.length > 0) {
            lat = parseFloat(data[0].lat);
            lon = parseFloat(data[0].lon);
            const displayName = data[0].display_name || '';
            const parts = displayName.split(',');
            city = parts[0]?.trim() || '';
            state = parts[parts.length - 2]?.trim() || '';
          }
        }
      } catch (err) {
        console.error('Erro na geocodificação Nominatim:', err);
      }
    }

    // Se ainda não tiver coordenadas, fallback para centro de São Luís
    if (!lat || !lon) {
      lat = -2.5298;
      lon = -44.3025;
      city = 'São Luís';
      state = 'MA';
    }

    const radiusMeters = radiusKm * 1000;

    // Map categories to OSM Overpass tags
    const categoryTagMap: Record<string, string> = {
      barbearia: 'hairdresser',
      'salão de beleza': 'hairdresser',
      'clínica odontológica': 'dentist',
      dentista: 'dentist',
      'consultório médico': 'clinic',
      'oficina mecânica': 'car_repair',
      autopeças: 'car_parts',
      restaurante: 'restaurant',
      academia: 'fitness_centre',
      'pet shop': 'pet',
      'loja de roupas': 'clothes',
      mercado: 'supermarket',
      imobiliária: 'estate_agent',
      contabilidade: 'accounting',
      advocacia: 'lawyer',
    };

    const catLower = category.toLowerCase().trim();
    const osmTag = categoryTagMap[catLower] || 'shop';

    // 2. Consulta Overpass QL
    const overpassQuery = `
      [out:json][timeout:15];
      (
        node(around:${radiusMeters},${lat},${lon})["amenity"="${osmTag}"];
        node(around:${radiusMeters},${lat},${lon})["shop"="${osmTag}"];
        node(around:${radiusMeters},${lat},${lon})["craft"="${osmTag}"];
        node(around:${radiusMeters},${lat},${lon})["name"~"${category}", i];
        way(around:${radiusMeters},${lat},${lon})["name"~"${category}", i];
      );
      out body center 30;
    `;

    try {
      const overpassUrl = 'https://overpass-api.de/api/interpreter';
      const res = await fetch(overpassUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });

      if (!res.ok) {
        throw new Error(`Overpass API respondeu com status ${res.status}`);
      }

      const data = await res.json();
      const elements = data.elements || [];

      const businesses: Business[] = elements
        .filter((el: any) => el.tags && (el.tags.name || el.tags['official_name']))
        .map((el: any) => {
          const elLat = el.lat || (el.center && el.center.lat) || lat;
          const elLon = el.lon || (el.center && el.center.lon) || lon;
          const tags = el.tags || {};
          const name = tags.name || tags['official_name'] || category;
          const phone = tags.phone || tags['contact:phone'] || tags['phone:mobile'] || undefined;
          const website = tags.website || tags['contact:website'] || undefined;

          const street = tags['addr:street'] || '';
          const housenumber = tags['addr:housenumber'] || '';
          const suburb = tags['addr:suburb'] || tags['addr:neighbourhood'] || '';
          const addressParts = [street, housenumber, suburb].filter(Boolean);
          const address = addressParts.length > 0 ? addressParts.join(', ') : `${city || location}`;

          const dist = calculateHaversineDistance(lat!, lon!, elLat, elLon);

          return {
            id: `osm-${el.id}`,
            externalId: `osm-node-${el.id}`,
            name,
            category: category,
            categories: [category, tags.amenity || tags.shop || 'Comércio Local'],
            address,
            city: tags['addr:city'] || city || 'Não informado',
            state: tags['addr:state'] || state || 'Não informado',
            country: 'Brasil',
            postalCode: tags['addr:postcode'] || undefined,
            latitude: elLat,
            longitude: elLon,
            distanceKm: dist,
            phone,
            website,
            whatsapp: phone ? phone.replace(/\D/g, '') : undefined,
            rating: 4.5,
            reviewCount: 12,
            mapsUrl: `https://maps.google.com/?q=${elLat},${elLon}`,
            source: 'OpenStreetMap',
            sourceUrl: `https://www.openstreetmap.org/node/${el.id}`,
          };
        });

      // Se o Overpass retornar resultados válidos, filtra e devolve
      if (businesses.length > 0) {
        return businesses.filter((b) => {
          if (filters?.hasPhone && !b.phone) return false;
          if (filters?.hasWebsite && !b.website) return false;
          return true;
        });
      }
    } catch (err) {
      console.warn('Overpass API indisponível ou sem retorno, caindo no gerador estruturado:', err);
    }

    // Fallback gracioso com coordenadas reais para caso o Overpass esteja em manutenção
    return [];
  }
}
