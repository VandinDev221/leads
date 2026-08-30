export interface CityInfo {
  name: string;
  state: string;
  lat: number;
  lng: number;
  ddd: string;
}

const KNOWN_CITIES: CityInfo[] = [
  // Maranhão (MA)
  { name: 'São Luís', state: 'MA', lat: -2.5298, lng: -44.3025, ddd: '98' },
  { name: 'Imperatriz', state: 'MA', lat: -5.5266, lng: -47.4917, ddd: '99' },
  { name: 'Santa Inês', state: 'MA', lat: -3.6667, lng: -45.3800, ddd: '98' },
  { name: 'Açailândia', state: 'MA', lat: -4.9472, lng: -47.5003, ddd: '99' },
  { name: 'Caxias', state: 'MA', lat: -4.8583, lng: -43.3561, ddd: '99' },
  { name: 'Timon', state: 'MA', lat: -5.0939, lng: -42.8361, ddd: '99' },
  { name: 'Bacabal', state: 'MA', lat: -4.2361, lng: -44.7828, ddd: '99' },
  { name: 'Balsas', state: 'MA', lat: -7.5322, lng: -46.0378, ddd: '99' },
  { name: 'Codó', state: 'MA', lat: -4.4553, lng: -43.8864, ddd: '99' },
  { name: 'Santa Luzia', state: 'MA', lat: -3.9525, lng: -45.6961, ddd: '98' },
  { name: 'Pinheiro', state: 'MA', lat: -2.5214, lng: -45.0833, ddd: '98' },
  { name: 'Pedreiras', state: 'MA', lat: -4.5714, lng: -44.5961, ddd: '99' },
  { name: 'Barra do Corda', state: 'MA', lat: -5.5056, lng: -45.2428, ddd: '99' },
  { name: 'Chapadinha', state: 'MA', lat: -3.7417, lng: -43.3597, ddd: '98' },
  { name: 'Grajaú', state: 'MA', lat: -5.8194, lng: -46.1389, ddd: '99' },
  { name: 'Itapecuru Mirim', state: 'MA', lat: -3.3958, lng: -44.3597, ddd: '98' },

  // São Paulo (SP)
  { name: 'São Paulo', state: 'SP', lat: -23.5505, lng: -46.6333, ddd: '11' },
  { name: 'Campinas', state: 'SP', lat: -22.9099, lng: -47.0626, ddd: '19' },
  { name: 'Guarulhos', state: 'SP', lat: -23.4542, lng: -46.5337, ddd: '11' },
  { name: 'São José dos Campos', state: 'SP', lat: -23.1896, lng: -45.8841, ddd: '12' },
  { name: 'Ribeirão Preto', state: 'SP', lat: -21.1704, lng: -47.8103, ddd: '16' },
  { name: 'Sorocaba', state: 'SP', lat: -23.5015, lng: -47.4526, ddd: '15' },
  { name: 'Santos', state: 'SP', lat: -23.9608, lng: -46.3339, ddd: '13' },

  // Rio de Janeiro (RJ)
  { name: 'Rio de Janeiro', state: 'RJ', lat: -22.9068, lng: -43.1729, ddd: '21' },
  { name: 'Niterói', state: 'RJ', lat: -22.8833, lng: -43.1036, ddd: '21' },

  // Minas Gerais (MG)
  { name: 'Belo Horizonte', state: 'MG', lat: -19.9167, lng: -43.9345, ddd: '31' },
  { name: 'Uberlândia', state: 'MG', lat: -18.9186, lng: -48.2772, ddd: '34' },
  { name: 'Juiz de Fora', state: 'MG', lat: -21.7664, lng: -43.3496, ddd: '32' },

  // Distrito Federal & Centro-Oeste
  { name: 'Brasília', state: 'DF', lat: -15.7975, lng: -47.8919, ddd: '61' },
  { name: 'Goiânia', state: 'GO', lat: -16.6869, lng: -49.2648, ddd: '62' },
  { name: 'Campo Grande', state: 'MS', lat: -20.4697, lng: -54.6201, ddd: '67' },
  { name: 'Cuiabá', state: 'MT', lat: -15.6010, lng: -56.0979, ddd: '65' },

  // Nordeste
  { name: 'Salvador', state: 'BA', lat: -12.9777, lng: -38.5016, ddd: '71' },
  { name: 'Feira de Santana', state: 'BA', lat: -12.2664, lng: -38.9663, ddd: '75' },
  { name: 'Fortaleza', state: 'CE', lat: -3.7319, lng: -38.5267, ddd: '85' },
  { name: 'Sobral', state: 'CE', lat: -3.6872, lng: -40.3497, ddd: '88' },
  { name: 'Recife', state: 'PE', lat: -8.0476, lng: -34.8770, ddd: '81' },
  { name: 'Caruaru', state: 'PE', lat: -8.2839, lng: -35.9761, ddd: '81' },
  { name: 'Natal', state: 'RN', lat: -5.7945, lng: -35.2110, ddd: '84' },
  { name: 'João Pessoa', state: 'PB', lat: -7.1195, lng: -34.8450, ddd: '83' },
  { name: 'Maceió', state: 'AL', lat: -9.6498, lng: -35.7089, ddd: '82' },
  { name: 'Teresina', state: 'PI', lat: -5.0920, lng: -42.8038, ddd: '86' },
  { name: 'Aracaju', state: 'SE', lat: -10.9472, lng: -37.0731, ddd: '79' },

  // Sul
  { name: 'Curitiba', state: 'PR', lat: -25.4284, lng: -49.2733, ddd: '41' },
  { name: 'Londrina', state: 'PR', lat: -23.3045, lng: -51.1696, ddd: '43' },
  { name: 'Maringá', state: 'PR', lat: -23.4210, lng: -51.9331, ddd: '44' },
  { name: 'Porto Alegre', state: 'RS', lat: -30.0346, lng: -51.2177, ddd: '51' },
  { name: 'Florianópolis', state: 'SC', lat: -27.5954, lng: -48.5480, ddd: '48' },
  { name: 'Joinville', state: 'SC', lat: -26.3044, lng: -48.8464, ddd: '47' },

  // Norte
  { name: 'Manaus', state: 'AM', lat: -3.1190, lng: -60.0217, ddd: '92' },
  { name: 'Belém', state: 'PA', lat: -1.4558, lng: -48.4902, ddd: '91' },
  { name: 'Santarém', state: 'PA', lat: -2.4431, lng: -54.7083, ddd: '93' },
  { name: 'Macapá', state: 'AP', lat: 0.0355, lng: -51.0705, ddd: '96' },
  { name: 'Palmas', state: 'TO', lat: -10.2491, lng: -48.3243, ddd: '63' },
  { name: 'Porto Velho', state: 'RO', lat: -8.7619, lng: -63.9039, ddd: '69' },
  { name: 'Boa Vista', state: 'RR', lat: 2.8235, lng: -60.6758, ddd: '95' },
  { name: 'Rio Branco', state: 'AC', lat: -9.9754, lng: -67.8249, ddd: '68' },
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

  // Tentar deduzir DDD pelo estado
  let ddd = '98';
  const stUpper = rawState.toUpperCase();
  if (stUpper === 'SP') ddd = '11';
  else if (stUpper === 'RJ') ddd = '21';
  else if (stUpper === 'MG') ddd = '31';
  else if (stUpper === 'RS') ddd = '51';
  else if (stUpper === 'PR') ddd = '41';
  else if (stUpper === 'BA') ddd = '71';
  else if (stUpper === 'CE') ddd = '85';
  else if (stUpper === 'PE') ddd = '81';
  else if (stUpper === 'PA') ddd = '91';
  else if (stUpper === 'MA') ddd = '99';

  let hash = 0;
  for (let i = 0; i < normInput.length; i++) {
    hash = normInput.charCodeAt(i) + ((hash << 5) - hash);
  }

  const latOffset = (Math.abs(hash % 270) / 10).toFixed(4);
  const lngOffset = (Math.abs((hash >> 3) % 160) / 10).toFixed(4);

  const lat = -Number(latOffset) - 2.0;
  const lng = -Number(lngOffset) - 38.0;

  return {
    name: rawCity,
    state: rawState.toUpperCase(),
    lat,
    lng,
    ddd,
  };
}
