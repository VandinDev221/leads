import { Business, SearchBusinessesParams } from '@/types/business';

export interface BusinessProvider {
  name: string;
  searchBusinesses(params: SearchBusinessesParams): Promise<Business[]>;
  getBusinessDetails?(externalId: string): Promise<Business | null>;
}
