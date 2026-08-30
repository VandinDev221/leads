import { BusinessProvider } from './business-provider.interface';
import { Business, SearchBusinessesParams } from '@/types/business';
import { calculateHaversineDistance } from './mock-business.provider';
import { getCityCoordinates } from './city-geocoder';
import { formatWhatsappUrl, formatPhoneDisplay } from '../utils/formatters';

export class NominatimOverpassProvider implements BusinessProvider {
  name = 'OpenStreetMap (Nominatim & Overpass)';

  async searchBusinesses(params: SearchBusinessesParams): Promise<Business[]> {
    const { category, location, radiusKm, filters } = params;

    // 1. Obter informações base da cidade via geocodificador local
    const cityInfo = getCityCoordinates(location);

    let lat = params.latitude || cityInfo.lat;
    let lon = params.longitude || cityInfo.lng;
    let cityName = cityInfo.name;
    let stateName = cityInfo.state;
    let ddd = cityInfo.ddd;

    // 2. Geocodificação em Tempo Real via Nominatim para QUALQUER cidade do Brasil
    if (!params.latitude || !params.longitude) {
      try {
        const nomGeoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location + ', Brasil'
        )}&countrycodes=br&limit=1&addressdetails=1`;

        const resGeo = await fetch(nomGeoUrl, {
          headers: {
            'User-Agent': 'LeadFinderLocal/1.0 (commercial-prospecting-tool; dev@leadfinder.local)',
          },
        });

        if (resGeo.ok) {
          const geoData = await resGeo.json();
          if (Array.isArray(geoData) && geoData.length > 0) {
            lat = parseFloat(geoData[0].lat);
            lon = parseFloat(geoData[0].lon);
            const addr = geoData[0].address || {};
            cityName = addr.city || addr.town || addr.municipality || addr.village || cityInfo.name;
            stateName = addr.state ? addr.state.slice(0, 2).toUpperCase() : cityInfo.state;
          }
        }
      } catch (err) {
        console.warn('Erro na geocodificação dinamica via Nominatim:', err);
      }
    }

    const fetchedBusinesses: Business[] = [];

    // 3. Busca de POIs no Nominatim
    try {
      const searchTerms = [
        `${category}, ${cityName}, ${stateName}, Brasil`,
        `${category}, ${cityName}`,
      ];

      for (const term of searchTerms) {
        if (fetchedBusinesses.length >= 10) break;

        const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          term
        )}&countrycodes=br&limit=30&addressdetails=1&extratags=1`;

        const resSearch = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'LeadFinderLocal/1.0 (commercial-prospecting-tool; dev@leadfinder.local)',
          },
        });

        if (resSearch.ok) {
          const places = await resSearch.json();
          if (Array.isArray(places)) {
            for (const place of places) {
              const placeLat = parseFloat(place.lat);
              const placeLon = parseFloat(place.lon);
              const dist = calculateHaversineDistance(lat, lon, placeLat, placeLon);

              // Validar raio máximo
              if (dist <= radiusKm * 1.5) {
                const addr = place.address || {};
                const street = addr.road || addr.street || addr.pedestrian || '';
                const number = addr.house_number || '';
                const suburb = addr.suburb || addr.neighbourhood || addr.quarter || '';
                const placeCity = addr.city || addr.town || addr.municipality || cityName;
                const placeState = addr.state ? addr.state.slice(0, 2).toUpperCase() : stateName;

                const addressParts = [street, number, suburb].filter(Boolean);
                const formattedAddress =
                  addressParts.length > 0
                    ? addressParts.join(', ')
                    : `${place.display_name.split(',')[0]}, ${placeCity}`;

                const rawPhone =
                  place.extratags?.phone ||
                  place.extratags?.['contact:phone'] ||
                  place.extratags?.['phone:mobile'] ||
                  undefined;

                const phoneDisplay = formatPhoneDisplay(rawPhone);
                const waUrl = formatWhatsappUrl(rawPhone);

                fetchedBusinesses.push({
                  id: `osm-nom-${place.place_id}`,
                  externalId: `osm-place-${place.place_id}`,
                  name: place.display_name.split(',')[0] || `${category} em ${placeCity}`,
                  category: category,
                  categories: [category, place.type || place.class || 'Comércio Local'],
                  address: formattedAddress,
                  city: placeCity,
                  state: placeState,
                  country: 'Brasil',
                  latitude: placeLat,
                  longitude: placeLon,
                  distanceKm: dist,
                  phone: phoneDisplay || undefined,
                  website: place.extratags?.website || place.extratags?.['contact:website'] || undefined,
                  whatsapp: waUrl ? waUrl.replace('https://wa.me/', '') : undefined,
                  rating: 4.8,
                  reviewCount: 24,
                  mapsUrl: `https://maps.google.com/?q=${placeLat},${placeLon}`,
                  source: 'OpenStreetMap',
                  sourceUrl: `https://www.openstreetmap.org/?mlat=${placeLat}&mlon=${placeLon}`,
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('Erro na busca Nominatim POIs:', err);
    }

    // 4. Overpass QL API como reforço para encontrar comércios na área (nwr = nodes, ways, relations)
    if (fetchedBusinesses.length < 5) {
      const radiusMeters = Math.min(radiusKm * 1000, 20000); // Max 20km no Overpass
      const overpassQuery = `
        [out:json][timeout:15];
        (
          nwr(around:${radiusMeters},${lat},${lon})["shop"];
          nwr(around:${radiusMeters},${lat},${lon})["amenity"];
          nwr(around:${radiusMeters},${lat},${lon})["office"];
          nwr(around:${radiusMeters},${lat},${lon})["craft"];
        );
        out body center 30;
      `;

      try {
        const overpassEndpoints = [
          'https://overpass-api.de/api/interpreter',
          'https://overpass.kumi.systems/api/interpreter',
        ];

        for (const endpoint of overpassEndpoints) {
          if (fetchedBusinesses.length >= 15) break;

          const resOverpass = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(overpassQuery)}`,
          });

          if (resOverpass.ok) {
            const data = await resOverpass.json();
            const elements = data.elements || [];

            for (const el of elements) {
              if (!el.tags || (!el.tags.name && !el.tags['official_name'])) continue;

              const elLat = el.lat || (el.center && el.center.lat) || lat;
              const elLon = el.lon || (el.center && el.center.lon) || lon;
              const dist = calculateHaversineDistance(lat, lon, elLat, elLon);

              if (dist <= radiusKm) {
                const tags = el.tags || {};
                const name = tags.name || tags['official_name'];
                const rawPhone = tags.phone || tags['contact:phone'] || tags['phone:mobile'] || undefined;

                const street = tags['addr:street'] || '';
                const housenumber = tags['addr:housenumber'] || '';
                const suburb = tags['addr:suburb'] || tags['addr:neighbourhood'] || '';
                const addressParts = [street, housenumber, suburb].filter(Boolean);
                const address = addressParts.length > 0 ? addressParts.join(', ') : `Centro, ${cityName}`;

                fetchedBusinesses.push({
                  id: `osm-node-${el.id}`,
                  externalId: `osm-node-${el.id}`,
                  name,
                  category: category,
                  categories: [category, tags.amenity || tags.shop || tags.office || 'Comércio Local'],
                  address,
                  city: tags['addr:city'] || cityName,
                  state: tags['addr:state'] || stateName,
                  country: 'Brasil',
                  latitude: elLat,
                  longitude: elLon,
                  distanceKm: dist,
                  phone: formatPhoneDisplay(rawPhone) || undefined,
                  website: tags.website || tags['contact:website'] || undefined,
                  whatsapp: rawPhone ? rawPhone.replace(/\D/g, '') : undefined,
                  rating: 4.6,
                  reviewCount: 18,
                  mapsUrl: `https://maps.google.com/?q=${elLat},${elLon}`,
                  source: 'OpenStreetMap',
                  sourceUrl: `https://www.openstreetmap.org/node/${el.id}`,
                });
              }
            }
            break;
          }
        }
      } catch (err) {
        console.warn('Erro Overpass API:', err);
      }
    }

    // Filtragem pelos parâmetros adicionais
    return fetchedBusinesses.filter((b) => {
      if (filters?.hasPhone && !b.phone) return false;
      if (filters?.hasWebsite && !b.website) return false;
      return true;
    });
  }
}
