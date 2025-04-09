import { Property } from '@/models/analyzedProperty';
import { OfferFormData } from '@/schemas/OfferDataSchemas';
import { Offer } from '@/schemas/OfferSchemas';

interface FullOffer extends Offer {
  propertyDetails: Property;
  createdAt: Date;
}

export default FullOffer;
