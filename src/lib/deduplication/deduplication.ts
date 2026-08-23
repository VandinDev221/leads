import { Business } from '@/types/business';

/**
 * Deduplica uma lista de estabelecimentos comerciais com base em:
 * 1. externalId / Place ID
 * 2. Telefone formatado
 * 3. Coordenadas aproximadas (latitude + longitude iguais até 4 casas decimais) + Nome similar
 * 4. Combinação normalizada de Nome + Endereço
 */
export function deduplicateBusinesses(businesses: Business[]): Business[] {
  const seenExternalIds = new Set<string>();
  const seenPhones = new Set<string>();
  const seenNameAddress = new Set<string>();
  const seenCoords = new Set<string>();

  const result: Business[] = [];

  for (const item of businesses) {
    // 1. Verificar externalId
    if (item.externalId && seenExternalIds.has(item.externalId)) {
      continue;
    }

    // 2. Normalizar telefone
    const rawPhone = item.phone ? item.phone.replace(/\D/g, '') : '';
    if (rawPhone.length >= 8 && seenPhones.has(rawPhone)) {
      continue;
    }

    // 3. Coordenadas aproximadas (~11 metros de precisão)
    const latKey = item.latitude.toFixed(4);
    const lngKey = item.longitude.toFixed(4);
    const normName = item.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const coordKey = `${latKey}_${lngKey}_${normName}`;

    if (seenCoords.has(coordKey)) {
      continue;
    }

    // 4. Nome + Endereço normalizado
    const normAddr = item.address.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const nameAddrKey = `${normName}_${normAddr.slice(0, 20)}`;

    if (normAddr.length > 5 && seenNameAddress.has(nameAddrKey)) {
      continue;
    }

    // Adicionar aos conjuntos de verificação
    if (item.externalId) seenExternalIds.add(item.externalId);
    if (rawPhone.length >= 8) seenPhones.add(rawPhone);
    seenCoords.add(coordKey);
    if (normAddr.length > 5) seenNameAddress.add(nameAddrKey);

    result.push(item);
  }

  return result;
}
