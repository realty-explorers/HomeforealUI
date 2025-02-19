import { buyboxSchemaType } from '@/schemas/BuyBoxSchemas';

interface BuyBox {
  id: string;
  userAccess: string;
  access?: {
    subject: string;
    level: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  parameters: buyboxSchemaType;
}

export default BuyBox;
