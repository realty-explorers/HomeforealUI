interface PropertyPreview {
  id: string;
  address: string;
  coordinates: [number, number];
  arv_price: number;
  arv25_price: number;
  cap_rate: string;
  price: number;
  image: string;
  area: number;
  status: string;
  property_type: string;
  beds: number;
  baths: number;
}

export default PropertyPreview;
