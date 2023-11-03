import PropertyPreview from "@/models/propertyPreview";
import CompData from "@/models/compData";
import { currencyFormatter } from "@/utils/converters";
import { FilteredComp } from "@/models/analyzedProperty";
import { string } from "zod";

const marginPercentage = (property: PropertyPreview, strategyMode: string) => {
  const fieldName = strategyMode === "ARV" ? "arv_price" : "sales_comps_price";
  return (property?.[fieldName] > 0 &&
    property[fieldName] - property.sales_listing_price) /
    property[fieldName] * 100;
};

const generatePropertyGeoJson = (
  property: PropertyPreview,
  strategy: string,
) => {
  const percentage = marginPercentage(property, strategy);
  return {
    type: "Feature",
    properties: {
      id: property.source_id, // Generate a random ID
      // price: `${currencyFormatter(property.sales_listing_price)}`,
      price: `↓ ${percentage.toFixed()}%`,
      sortKey: -percentage,
    },
    geometry: {
      type: "Point",
      coordinates: [property.longitude, property.latitude, 0.0],
    },
  };
};

const generateCompsGeoJson = (comp: FilteredComp) => {
  return {
    type: "Feature",
    properties: {
      id: comp.source_id, // Generate a random ID
      index: comp.index + 1,
    },
    geometry: {
      type: "Point",
      coordinates: [comp.longitude, comp.latitude, 0.0],
    },
  };
};

export { generateCompsGeoJson, generatePropertyGeoJson };
