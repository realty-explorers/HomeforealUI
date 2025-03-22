import { z } from 'zod';
import { OfferSchema } from './OfferDataSchemas';

const OfferStatusSchema = z.enum([
  'PENDING',
  'IN_REVIEW',
  'REALTOR_CONTACTED',
  'REALTOR_REVIEW',
  'FINAL_SIGN_OFF',
  'ACCEPTED',
  'REJECTED'
]);

const FullOfferSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  status: OfferStatusSchema,
  offerData: OfferSchema
});

export type OfferStatus = z.infer<typeof OfferStatusSchema>;

export type Offer = z.infer<typeof FullOfferSchema>;
