export type ProspectStatus =
  | 'NOVO'
  | 'CONTATAR'
  | 'CONTATADO'
  | 'RESPONDEU'
  | 'INTERESSADO'
  | 'SEM_INTERESSE'
  | 'CLIENTE';

export interface Business {
  id: string;
  externalId: string;
  name: string;
  category: string;
  categories?: string[];
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  phone?: string;
  website?: string;
  whatsapp?: string;
  instagram?: string;
  rating?: number;
  reviewCount?: number;
  openingHours?: string;
  mapsUrl: string;
  source: string;
  sourceUrl?: string;
  prospectStatus?: ProspectStatus;
  notes?: string;
  lastContactedAt?: string | Date;
  nextContactAt?: string | Date;
  isFavorite?: boolean;
  isSaved?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SearchFilters {
  hasPhone?: boolean;
  hasWebsite?: boolean;
  hasWhatsapp?: boolean;
  hasInstagram?: boolean;
  minRating?: number;
  minReviews?: number;
  openNow?: boolean;
  onlyUnprospecting?: boolean;
}

export interface SearchBusinessesParams {
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  radiusKm: number;
  filters?: SearchFilters;
  provider?: 'nominatim' | 'google' | 'mock';
}

export interface SearchHistoryItem {
  id: string;
  category: string;
  location: string;
  radiusKm: number;
  resultsCount: number;
  createdAt: string;
}
