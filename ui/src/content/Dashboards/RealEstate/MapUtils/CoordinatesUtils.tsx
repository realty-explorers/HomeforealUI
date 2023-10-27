import PropertyPreview from "@/models/propertyPreview";
import CompData from "@/models/compData";
import { currencyFormatter } from "@/utils/converters";

const generatePropertyGeoJson = (property: PropertyPreview) => {
  return {
    type: "Feature",
    properties: {
      id: property.source_id, // Generate a random ID
      price: currencyFormatter(property.sales_listing_price),
    },
    geometry: {
      type: "Point",
      coordinates: [property.longitude, property.latitude, 0.0],
    },
  };
};

const generateCompsGeoJson = (comp: CompData, index) => {
  return {
    type: "Feature",
    properties: {
      id: comp.source_id, // Generate a random ID
      index: index,
    },
    geometry: {
      type: "Point",
      coordinates: [comp.longitude, comp.latitude, 0.0],
    },
  };
};

export { generateCompsGeoJson, generatePropertyGeoJson };
