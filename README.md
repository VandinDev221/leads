# 🏢 LeadFinder Local — Sistema de Prospecção Comercial B2B

![LeadFinder Local Status](https://img.shields.io/badge/Status-Produ%C3%A7%C3%A3o-success?style=for-the-badge)
![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

> **LeadFinder Local** é um sistema web especializado para equipes comerciais e desenvolvedores B2B localizarem empresas e estabelecimentos em determinada região para prospecção ativa de serviços (desenvolvimento de software, automação, criação de sites, sistemas SaaS, marketing e vendas).

🌐 **Aplicação em Produção na Vercel**: [https://leadfinder-local.vercel.app](https://leadfinder-local.vercel.app)

---

## 📌 Sumário

1. [Visão Geral e Objetivo](#-visão-geral-e-objetivo)
2. [Fluxo do MVP](#-fluxo-do-mvp)
3. [Arquitetura & Abstração de Dados](#-arquitetura--abstração-de-dados)
4. [Funcionalidades Detalhadas](#-funcionalidades-detalhadas)
5. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
6. [Estrutura de Pastas do Projeto](#-estrutura-de-pastas-do-projeto)
7. [Documentação dos Endpoints da API REST](#-documentação-dos-endpoints-da-api-rest)
8. [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)
9. [Guia de Implantação em Produção (Vercel)](#-guia-de-implantação-em-produção-vercel)
10. [Licença e Créditos](#-licença-e-créditos)

---

## 🎯 Visão Geral e Objetivo

O objetivo principal do **LeadFinder Local** é oferecer uma experiência extremamente rápida, focada e confiável para encontrar potenciais clientes comerciais. 

Ao contrário de CRMs complexos, o foco é a velocidade de prospecção:
**Buscar → Filtrar → Visualizar → Organizar → Prospectar → Exportar.**

### Exemplo de Utilização:
- **Categoria**: Barbearias (ou Restaurantes, Clínicas, Oficinas, etc.)
- **Localização**: São Luís - MA (ou São Paulo - SP, Curitiba - PR, etc.)
- **Raio**: 10 km
- **Resultado**: Lista e mapa com distância, endereço real, telefone formatado, link direto para **WhatsApp Web (com DDD 55)**, site, avaliação no Google/Maps e alteração direta do status de prospecção.

---

## 🔄 Fluxo do MVP

```text
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Buscar Leads   │ ──> │ Alternar Visualiz.│ ──> │ Prospectar/Status│
│ Categoria/Raio  │     │   Lista | Mapa   │     │ Novo/Interessado │
└─────────────────┘     └──────────────────┘     └──────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Exportar CSV   │ <── │ Carteira Salva   │ <── │ Abrir WhatsApp/  │
│  Compat. Excel  │     │   "Meus Leads"   │     │ Ligar / Detalhes │
└─────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 🏗️ Arquitetura & Abstração de Dados

### 🧩 Padrão `BusinessProvider`

Para garantir que a aplicação não fique refém de uma única API externa nem faça scraping ilegal de dados, o projeto adota o design pattern **Strategy/Factory** com a interface abstrata `BusinessProvider`:

```typescript
export interface BusinessProvider {
  name: string;
  searchBusinesses(params: SearchBusinessesParams): Promise<Business[]>;
  getBusinessDetails?(externalId: string): Promise<Business | null>;
}
```

#### Provedores Suportados:

1. **`NominatimOverpassProvider`** (Padrão Gratuito):
   - Integração com a API do **OpenStreetMap** (Nominatim para geocodificação e Overpass QL para busca textual e consulta de estabelecimentos por raio).
   - Zero custos e sem necessidade de chave de API.
2. **`GooglePlacesProvider`** (Oficial Produção):
   - Integração com a **Google Places API** (Text Search & Nearby Search).
   - Ativado automaticamente quando a variável `GOOGLE_MAPS_API_KEY` está presente.
3. **`MockBusinessProvider`** (Dev Local & Fallback):
   - Provedor estático de alta fidelidade integrado com o geocodificador dinâmico `city-geocoder.ts`.
   - Gera estabelecimentos no centro exato da cidade pesquisada com DDD local brasileiro e coordenadas precisas.

---

## ✨ Funcionalidades Detalhadas

- 🔍 **Busca Dinâmica por Categoria e Localização**:
  - Sugestões autocompletáveis para categorias populares (*Barbearia*, *Salão de Beleza*, *Clínica Odontológica*, *Consultório Médico*, *Oficina Mecânica*, *Autopeças*, *Restaurante*, *Academia*, *Pet Shop*, *Loja de Roupas*, *Mercado*, *Imobiliária*, *Contabilidade*, *Advocacia*) + entrada livre.
  - Seleção de raio flexível: 1 km, 2 km, 5 km, 10 km, 20 km, 30 km, 50 km ou valor customizado.
  - Geolocalização em 1 clique via GPS do navegador HTML5.

- 🗺️ **Visualizador de Mapa Interativo (Leaflet)**:
  - Alternância imediata em abas **[Lista] | [Mapa]**.
  - Marcadores geográficos com popups contendo resumo, distância, telefone e botão de detalhes.

- 📞 **Contatos e Gatilhos Rápidos**:
  - **WhatsApp**: Link direto formatado (`https://wa.me/55...`) garantindo o código de país do Brasil.
  - **Ligar**: Protocolo `tel:` para acionamento direto do discador.
  - **Google Maps**: Navegação no mapa externo.
  - **Website**: Abertura em nova aba.

- 🏷️ **Gerenciador de Status de Prospecção**:
  - Estados: `Novo`, `Contatar`, `Contatado`, `Respondeu`, `Interessado`, `Sem interesse`, `Cliente`.
  - Atualização direta em linha na tabela, nos cards ou no modal de detalhes.

- 📝 **Modal de Detalhes & Observações**:
  - Modal para registro de notas de reuniões/abordagens e agendamento de data do próximo contato.

- ⭐ **Área "Meus Leads" (Favoritos)**:
  - Marcação de favoritos e visualização de carteira salva.

- 📜 **Histórico de Buscas**:
  - Registro automático das pesquisas anteriores com repetição da consulta em 1 clique.

- 📊 **Dashboard de Prospecção**:
  - Cards numéricos com total de leads encontrados, contatados, interessados e clientes conquistados + gráfico de funil de vendas (Recharts).

- 📥 **Exportação em CSV**:
  - Gerador de relatórios CSV codificado em UTF-8 com BOM (`\uFEFF`) para abertura direta no Microsoft Excel e Google Planilhas sem problemas de acentuação.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
| :--- | :--- |
| **Next.js 14** | Framework React com App Router e Server Actions/API Routes |
| **TypeScript** | Tipagem estática rigorosa para frontend e backend |
| **Tailwind CSS** | Estilização utilitária moderna e responsiva (SaaS B2B) |
| **Prisma ORM** | Mapeamento relacional e suporte a SQLite e PostgreSQL |
| **Leaflet / React-Leaflet** | Renderização de mapas interativos sem dependências pagas |
| **Lucide Icons** | Biblioteca de ícones vetoriais modernos |
| **Recharts** | Gráficos responsivos para o Dashboard comercial |
| **Vercel** | Hospedagem serverless global com CI/CD integrado |

---

## 📁 Estrutura de Pastas do Projeto

```text
LEADS/
├── prisma/
│   └── schema.prisma              # Schema do banco de dados (SavedLead, SearchHistory, SearchCache)
├── public/
│   ├── favicon.ico                # Ícone favicon
│   └── markers/                   # Ícones customizados do mapa
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # Rotas de API REST
│   │   │   ├── search/route.ts    # API de busca integrada ao BusinessProvider
│   │   │   ├── leads/route.ts     # CRUD de leads salvos e atualização de status
│   │   │   ├── history/route.ts   # Histórico de pesquisas
│   │   │   ├── export/route.ts    # Gerador de relatórios CSV
│   │   │   └── dashboard/route.ts # Métricas comerciais do dashboard
│   │   ├── dashboard/page.tsx     # Página do Dashboard de Vendas
│   │   ├── my-leads/page.tsx      # Página "Meus Leads" (Favoritos)
│   │   ├── history/page.tsx       # Página do Histórico de Pesquisas
│   │   ├── settings/page.tsx      # Página de Configurações do Provider
│   │   ├── page.tsx               # Tela Principal de Busca (Lista / Mapa)
│   │   ├── layout.tsx             # Layout raiz com Sidebar e Navbar
│   │   └── icon.svg               # Ícone SVG do navegador
│   ├── components/
│   │   ├── business/              # Tabela, Cards, Badge de Status e Modal de Detalhes
│   │   ├── dashboard/             # Cards de métricas e gráfico Recharts
│   │   ├── layout/                # Sidebar e Navbar responsivos
│   │   ├── map/                   # Componentes do Mapa Interativo Leaflet
│   │   └── search/                # Formulário de Busca e Painel de Filtros
│   ├── lib/
│   │   ├── db/                    # Cliente Prisma desacoplado
│   │   ├── deduplication/         # Algoritmo de deduplicação inteligente
│   │   ├── export/                # Utilitário de exportação para CSV
│   │   ├── providers/             # Interfaces e Provedores (Nominatim, Google, Mock, Geocoder)
│   │   └── utils/                 # Formatadores de fone e link do WhatsApp (DDD 55)
│   └── types/                     # Tipos TypeScript compartilhados (Business, ProspectStatus)
├── vercel.json                    # Configurações de build da Vercel
├── package.json
└── README.md
```

---

## 📡 Documentação dos Endpoints da API REST

### 1. `POST /api/search`
Realiza uma busca de estabelecimentos comerciais de acordo com os parâmetros enviados.

- **Body (JSON)**:
  ```json
  {
    "category": "Barbearia",
    "location": "São Luís - MA",
    "radiusKm": 10,
    "filters": {
      "hasPhone": true,
      "hasWebsite": false,
      "minRating": 4.5
    }
  }
  ```

---

### 2. `GET /api/leads` & `POST /api/leads`
Recupera ou salva/atualiza um lead na carteira persistente.

- **GET Params**:
  - `favorite=true`: Filtra apenas favoritados.
  - `status=INTERESSADO`: Filtra por status de prospecção.
  - `q=Busca`: Filtra por texto no nome, categoria ou cidade.

- **POST Body (JSON)**:
  ```json
  {
    "externalId": "place-123",
    "name": "Barbearia Don Corleone",
    "prospectStatus": "INTERESSADO",
    "notes": "Cliente solicitou proposta para novo site SaaS",
    "nextContactAt": "2026-09-05",
    "isFavorite": true
  }
  ```

---

### 3. `POST /api/export`
Gera o download de um arquivo CSV formatado com todos os dados dos estabelecimentos selecionados.

---

### 4. `GET /api/dashboard`
Retorna as métricas agregadas de prospecção e os dados do gráfico de funil.

---

## 💻 Como Executar o Projeto Localmente

### 1. Clonar o Repositório
```bash
git clone https://github.com/VandinDev221/leads.git
cd leads
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
BUSINESS_PROVIDER="nominatim"
GOOGLE_MAPS_API_KEY=""
```

### 4. Inicializar o Banco de Dados (Prisma)
```bash
npx prisma db push
```

### 5. Executar a Aplicação em Modo de Desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🚀 Guia de Implantação em Produção (Vercel)

1. Conecte o repositório GitHub `VandinDev221/leads` ao painel da **Vercel**.
2. Configure as seguintes variáveis de ambiente em **Project Settings > Environment Variables**:

| Variável | Descrição | Exemplo / Valor |
| :--- | :--- | :--- |
| `DATABASE_URL` | String de Conexão com o PostgreSQL | `postgresql://user:pass@host:5432/dbname` |
| `BUSINESS_PROVIDER` | Provedor de Dados Padrão | `nominatim` ou `google` |
| `GOOGLE_MAPS_API_KEY` | Chave da Google Places API (opcional) | `AIzaSy...` |

3. O comando de build automático configurado no `vercel.json` é:
   ```bash
   prisma generate && next build
   ```

---

## 📜 Licença e Créditos

Desenvolvido por **[VandinDev221](https://github.com/VandinDev221)** como solução de prospecção comercial B2B sob a licença MIT.
