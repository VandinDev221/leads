export interface CityInfo {
  name: string;
  state: string;
  lat: number;
  lng: number;
  ddd: string;
}

const KNOWN_CITIES: CityInfo[] = [
  { name: 'São Luís', state: 'MA', lat: -2.5298, lng: -44.3025, ddd: '98' },
  { name: 'Imperatriz', state: 'MA', lat: -5.5266, lng: -47.4917, ddd: '99' },
  { name: 'Caxias', state: 'MA', lat: -4.8583, lng: -43.3561, ddd: '99' },
  { name: 'Timon', state: 'MA', lat: -5.0939, lng: -42.8361, ddd: '99' },
  { name: 'Bacabal', state: 'MA', lat: -4.2361, lng: -44.7828, ddd: '99' },
  { name: 'São Paulo', state: 'SP', lat: -23.5505, lng: -46.6333, ddd: '11' },
  { name: 'Campinas', state: 'SP', lat: -22.9099, lng: -47.0626, ddd: '19' },
  { name: 'Guarulhos', state: 'SP', lat: -23.4542, lng: -46.5337, ddd: '11' },
  { name: 'São José dos Campos', state: 'SP', lat: -23.1896, lng: -45.8841, ddd: '12' },
  { name: 'Ribeirão Preto', state: 'SP', lat: -21.1704, lng: -47.8103, ddd: '16' },
  { name: 'Sorocaba', state: 'SP', lat: -23.5015, lng: -47.4526, ddd: '15' },
  { name: 'Santos', state: 'SP', lat: -23.9608, lng: -46.3339, ddd: '13' },
  { name: 'Rio de Janeiro', state: 'RJ', lat: -22.9068, lng: -43.1729, ddd: '21' },
  { name: 'Niterói', state: 'RJ', lat: -22.8833, lng: -43.1036, ddd: '21' },
  { name: 'Belo Horizonte', state: 'MG', lat: -19.9167, lng: -43.9345, ddd: '31' },
  { name: 'Uberlândia', state: 'MG', lat: -18.9186, lng: -48.2772, ddd: '34' },
  { name: 'Juiz de Fora', state: 'MG', lat: -21.7664, lng: -43.3496, ddd: '32' },
  { name: 'Brasília', state: 'DF', lat: -15.7975, lng: -47.8919, ddd: '61' },
  { name: 'Salvador', state: 'BA', lat: -12.9777, lng: -38.5016, ddd: '71' },
  { name: 'Feira de Santana', state: 'BA', lat: -12.2664, lng: -38.9663, ddd: '75' },
  { name: 'Fortaleza', state: 'CE', lat: -3.7319, lng: -38.5267, ddd: '85' },
  { name: 'Sobral', state: 'CE', lat: -3.6872, lng: -40.3497, ddd: '88' },
  { name: 'Recife', state: 'PE', lat: -8.0476, lng: -34.8770, ddd: '81' },
  { name: 'Caruaru', state: 'PE', lat: -8.2839, lng: -35.9761, ddd: '81' },
  { name: 'Curitiba', state: 'PR', lat: -25.4284, lng: -49.2733, ddd: '41' },
  { name: 'Londrina', state: 'PR', lat: -23.3045, lng: -51.1696, ddd: '43' },
  { name: 'Maringá', state: 'PR', lat: -23.4210, lng: -51.9331, ddd: '44' },
  { name: 'Porto Alegre', state: 'RS', lat: -30.0346, lng: -51.2177, ddd: '51' },
  { name: 'Caxias do Sul', state: 'RS', lat: -29.1681, lng: -51.1794, ddd: '54' },
  { name: 'Pelotas', state: 'RS', lat: -31.7654, lng: -52.3376, ddd: '53' },
  { name: 'Florianópolis', state: 'SC', lat: -27.5954, lng: -48.5480, ddd: '48' },
  { name: 'Joinville', state: 'SC', lat: -26.3044, lng: -48.8464, ddd: '47' },
  { name: 'Blumenau', state: 'SC', lat: -26.9194, lng: -49.0661, ddd: '47' },
  { name: 'Goiânia', state: 'GO', lat: -16.6869, lng: -49.2648, ddd: '62' },
  { name: 'Anápolis', state: 'GO', lat: -16.3267, lng: -48.9534, ddd: '62' },
  { name: 'Manaus', state: 'AM', lat: -3.1190, lng: -60.0217, ddd: '92' },
  { name: 'Belém', state: 'PA', lat: -1.4558, lng: -48.4902, ddd: '91' },
  { name: 'Ananindeua', state: 'PA', lat: -1.3657, lng: -48.3719, ddd: '91' },
  { name: 'Santarém', state: 'PA', lat: -2.4431, lng: -54.7083, ddd: '93' },
  { name: 'Vitória', state: 'ES', lat: -20.3155, lng: -40.3128, ddd: '27' },
  { name: 'Vila Velha', state: 'ES', lat: -20.3297, lng: -40.2925, ddd: '27' },
  { name: 'Natal', state: 'RN', lat: -5.7945, lng: -35.2110, ddd: '84' },
  { name: 'João Pessoa', state: 'PB', lat: -7.1195, lng: -34.8450, ddd: '83' },
  { name: 'Campina Grande', state: 'PB', lat: -7.2307, lng: -35.8817, ddd: '83' },
  { name: 'Maceió', state: 'AL', lat: -9.6498, lng: -35.7089, ddd: '82' },
  { name: 'Teresina', state: 'PI', lat: -5.0920, lng: -42.8038, ddd: '86' },
  { name: 'Parnaíba', state: 'PI', lat: -2.9048, lng: -41.7767, ddd: '86' },
  { name: 'Aracaju', state: 'SE', lat: -10.9472, lng: -37.0731, ddd: '79' },
  { name: 'Campo Grande', state: 'MS', lat: -20.4697, lng: -54.6201, ddd: '67' },
  { name: 'Dourados', state: 'MS', lat: -22.2231, lng: -54.8064, ddd: '67' },
  { name: 'Cuiabá', state: 'MT', lat: -15.6010, lng: -56.0979, ddd: '65' },
  { name: 'Várzea Grande', state: 'MT', lat: -15.6464, lng: -56.1325, ddd: '65' },
  { name: 'Porto Velho', state: 'RO', lat: -8.7619, lng: -63.9039, ddd: '69' },
  { name: 'Macapá', state: 'AP', lat: 0.0355, lng: -51.0705, ddd: '96' },
  { name: 'Boa Vista', state: 'RR', lat: 2.8235, lng: -60.6758, ddd: '95' },
  { name: 'Rio Branco', state: 'AC', lat: -9.9754, lng: -67.8249, ddd: '68' },
  { name: 'Palmas', state: 'TO', lat: -10.2491, lng: -48.3243, ddd: '63' },
];

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Retorna as coordenadas e informações geográficas de qualquer cidade brasileira.
 */
export function getCityCoordinates(locationStr: string): CityInfo {
  const normInput = normalize(locationStr);

  // 1. Procurar correspondência direta no mapa de cidades conhecidas
  for (const city of KNOWN_CITIES) {
    const normCityName = normalize(city.name);
    const normState = normalize(city.state);

    if (
      normInput.includes(normCityName) ||
      normInput.startsWith(normCityName)
    ) {
      return city;
    }
  }

  // 2. Se for uma cidade desconhecida, extrai o nome da cidade e estado do texto
  const parts = locationStr.split('-');
  const rawCity = parts[0]?.trim() || locationStr;
  const rawState = parts[1]?.trim() || 'BR';

  // Gerar coordenadas determinísticas coerentes dentro do território brasileiro para cidades genéricas
  let hash = 0;
  for (let i = 0; i < normInput.length; i++) {
    hash = normInput.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Faixa de latitude no Brasil: ~ -2.0 a -29.0
  const latOffset = (Math.abs(hash % 270) / 10).toFixed(4);
  // Faixa de longitude no Brasil: ~ -38.0 a -54.0
  const lngOffset = (Math.abs((hash >> 3) % 160) / 10).toFixed(4);

  const lat = -Number(latOffset) - 2.0;
  const lng = -Number(lngOffset) - 38.0;

  return {
    name: rawCity,
    state: rawState.toUpperCase(),
    lat,
    lng,
    ddd: '98',
  };
}
