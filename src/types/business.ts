export type ProspectStatus =
  | 'NOVO'
  | 'QUALIFICADO'
  | 'CONTATAR'
  | 'CONTATADO'
  | 'RESPONDEU'
  | 'INTERESSADO'
  | 'PROPOSTA'
  | 'NEGOCIACAO'
  | 'CLIENTE'
  | 'SEM_INTERESSE'
  | 'PERDIDO';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type InteractionType =
  | 'CALL'
  | 'WHATSAPP'
  | 'EMAIL'
  | 'INSTAGRAM'
  | 'MEETING'
  | 'NOTE'
  | 'STATUS_CHANGE'
  | 'PROPOSAL'
  | 'OTHER';

export type ProposalStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface OpportunityInfo {
  id: string;
  title: string;
  category: 'WEB' | 'SYSTEM' | 'AUTOMATION' | 'SEO' | 'SUPPORT';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  suggestedService: string;
}

export interface LeadScoreInfo {
  totalScore: number;
  opportunityScore: number;
  badge: 'HIGH_OPPORTUNITY' | 'MEDIUM_OPPORTUNITY' | 'LOW_OPPORTUNITY';
  label: string;
  color: string;
  factors: Array<{ name: string; score: number }>;
}

export interface LeadContact {
  id?: string;
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  notes?: string;
  isPrimary?: boolean;
}

export interface Interaction {
  id: string;
  leadId: string;
  type: InteractionType;
  description: string;
  createdAt: string | Date;
}

export interface FollowUp {
  id: string;
  leadId: string;
  scheduledAt: string | Date;
  type: string;
  notes?: string;
  isCompleted: boolean;
  createdAt: string | Date;
  lead?: {
    id: string;
    name: string;
    category: string;
    city?: string;
    phone?: string;
    whatsapp?: string;
  };
}

export interface Task {
  id: string;
  leadId?: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string | Date;
  createdAt: string | Date;
  lead?: {
    id: string;
    name: string;
  };
}

export interface Proposal {
  id: string;
  leadId: string;
  serviceName: string;
  estimatedValue: number;
  status: ProposalStatus;
  notes?: string;
  validUntil?: string | Date;
  createdAt: string | Date;
  lead?: {
    id: string;
    name: string;
  };
}

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
  email?: string;
  website?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  rating?: number;
  reviewCount?: number;
  openingHours?: string;
  mapsUrl: string;
  source: string;
  sourceUrl?: string;
  prospectStatus?: ProspectStatus;
  priority?: Priority;
  leadScore?: number;
  opportunityScore?: number;
  scoreInfo?: LeadScoreInfo;
  opportunities?: OpportunityInfo[];
  contacts?: LeadContact[];
  salesPotential?: 'LOW' | 'MEDIUM' | 'HIGH';
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
  hasFacebook?: boolean;
  hasEmail?: boolean;
  minRating?: number;
  minReviews?: number;
  openNow?: boolean;
  onlyUnprospecting?: boolean;
  priority?: Priority;
  minScore?: number;
  maxScore?: number;
  opportunityType?: string;
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

export interface SavedSearchItem {
  id: string;
  name: string;
  category: string;
  location: string;
  radiusKm: number;
  filtersJson?: string;
  createdAt: string;
}

export interface LeadList {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
  createdAt: string;
}
