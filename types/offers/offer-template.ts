import { Property } from '@/models/analyzedProperty';
import { OfferFormData } from '@/schemas/OfferDataSchemas';
import { OfferData } from '@/schemas/OfferSchemas';

export type OfferTemplate = Omit<OfferData, 'financialDetails' | 'deposit'>;
