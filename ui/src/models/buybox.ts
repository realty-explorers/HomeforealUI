import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";

interface BuyBox {
  id: string;
  execute_date: Date;
  name: string;
  data: buyboxSchemaType;
  permissions: string[];
}

export default BuyBox;
