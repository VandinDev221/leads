import assert from 'assert';
import { calculateLeadScore } from '../src/lib/scoring/lead-score';
import { analyzeLeadOpportunities } from '../src/lib/opportunity/opportunity-analyzer';
import { formatWhatsappUrl } from '../src/lib/utils/formatters';
import { deduplicateBusinesses } from '../src/lib/deduplication/deduplication';
import { Business } from '../src/types/business';

console.log('🧪 Iniciando suíte de testes B2B do LeadFinder Local...\n');

// Teste 1: WhatsApp link com DDD 55
const rawPhone = '(98) 98123-4567';
const waUrl = formatWhatsappUrl(rawPhone);
assert.strictEqual(waUrl, 'https://wa.me/5598981234567', 'Formatador do WhatsApp falhou');
console.log('✅ Teste 1 Passou: Formatador de WhatsApp com DDD 55');

// Teste 2: Lead Score
const sampleLeadNoWeb: Partial<Business> = {
  name: 'Barbearia Exemplo',
  category: 'Barbearia',
  phone: '(98) 98123-4567',
  rating: 4.8,
  reviewCount: 120,
};
const scoreInfo = calculateLeadScore(sampleLeadNoWeb);
assert(scoreInfo.opportunityScore >= 30, 'Score de oportunidade deve ser elevado para empresa sem website');
assert.strictEqual(scoreInfo.badge, 'HIGH_OPPORTUNITY', 'Deve classificar como alta oportunidade');
console.log('✅ Teste 2 Passou: Motor LeadScore (Oportunidade Dev Web sem site)');

// Teste 3: Opportunity Analyzer
const sampleOficina: Partial<Business> = {
  name: 'Oficina Auto Peças Corleone',
  category: 'Oficina mecânica',
  phone: '(98) 98888-7777',
};
const opps = analyzeLeadOpportunities(sampleOficina);
const osOpp = opps.find((o) => o.id === 'opp-erp-os');
assert(osOpp !== undefined, 'Deve sugerir Sistema de Gestão/OS para Oficina Mecânica');
console.log('✅ Teste 3 Passou: Opportunity Analyzer (Sugestão de Sistema de OS)');

// Teste 4: Deduplicação de Leads
const duplicateList: Business[] = [
  {
    id: '1',
    externalId: 'ext-100',
    name: 'Empresa A',
    category: 'Geral',
    address: 'Rua 1',
    latitude: -2.5,
    longitude: -44.2,
    mapsUrl: '',
    source: 'nominatim',
    phone: '(98) 98111-2222',
  },
  {
    id: '2',
    externalId: 'ext-100', // Mesmo externalId
    name: 'Empresa A Duplicada',
    category: 'Geral',
    address: 'Rua 1',
    latitude: -2.5,
    longitude: -44.2,
    mapsUrl: '',
    source: 'nominatim',
    phone: '(98) 98111-2222',
  },
];
const deduped = deduplicateBusinesses(duplicateList);
assert.strictEqual(deduped.length, 1, 'Deduplicação por externalId falhou');
console.log('✅ Teste 4 Passou: Deduplicação inteligente de estabelecimentos');

console.log('\n🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');
