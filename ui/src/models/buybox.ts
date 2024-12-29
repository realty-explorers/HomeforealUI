import { buyboxSchemaType } from '@/schemas/BuyBoxSchemas';

interface BuyBox {
  id: string;
  execute_date: Date;
  parameters: buyboxSchemaType;
  permissions: string[];
}

export default BuyBox;
