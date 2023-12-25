import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";

interface BuyBox {
  id: string;
  execute_date: Date;
  name: string;
  data: buyboxSchemaType;
  permissions: string[];
  total_deals?: number;
  new_deals?: number;
}

export default BuyBox;
