interface PropertyPreview {
  id: string;
  address: string;
  coordinates: [number, number];
  arvPrice: number;
  arv25Price: number;
  cap_rate: string;
  price?: number;
  priceGroup?: {
    min: number;
    max: number;
  };
  image: string;
  area: number;
  status: string;
  propertyType: string;
  beds: number;
  baths: number;
  listDate: Date;
  masked: boolean;
}

export default PropertyPreview;
