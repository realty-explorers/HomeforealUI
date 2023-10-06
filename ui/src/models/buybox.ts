import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";

interface BuyBox {
  id: string;
  name: string;
  data: buyboxSchemaType;
}

export default BuyBox;
