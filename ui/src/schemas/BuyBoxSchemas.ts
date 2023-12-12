import z from "zod";
import { defaults, defaultSimilarityFields } from "./defaults";

const rangeSchema = z.array(z.union([z.boolean(), z.array(z.number())]));
const minSchema = z.array(z.union([z.boolean(), z.number()]));

const propertySchema = z.object({
  "Property Types": z.array(z.union([z.boolean(), z.array(z.string())])),
  "Bedrooms": rangeSchema,
  "Bathrooms": rangeSchema,
  "Building sqft": rangeSchema,
  "Lot sqft": rangeSchema,
  "Year Built": rangeSchema,
  "Pool": z.array(z.union([z.boolean(), z.string()])),
  "Garages": rangeSchema,
  "Listing Price": rangeSchema,
});

const defaultPropertyValues = {
  "Property Types": [false, ["Single-Family"]],
  "Bedrooms": [false, [defaults.bedrooms.min, defaults.bedrooms.max]],
  "Bathrooms": [false, [defaults.bathrooms.min, defaults.bathrooms.max]],
  "Building sqft": [false, [defaults.area.min, defaults.area.max]],
  "Lot sqft": [false, [defaults.lotSize.min, defaults.lotSize.max]],
  "Year Built": [false, [defaults.yearBuilt.min, defaults.yearBuilt.max]],
  "Pool": [false, "With"],
  "Garages": [false, [defaults.garages.min, defaults.garages.max]],
  "Listing Price": [true, [
    defaults.listingPrice.min,
    defaults.listingPrice.max,
  ]],
};

const oppSchema = z.object({
  "strategy": z.string().min(1, "Please select a strategy"),
  "fix_and_flip": z.array(z.union([
    z.boolean(),
    z.object({
      "arv": minSchema,
      "margin": minSchema,
    }),
  ])),

  "buy_and_hold": z.array(z.union([
    z.boolean(),
    z.object({
      "gross_yield": minSchema,
      "cap_rate": minSchema,
    }),
  ])),
});

const defaultOppValues = {
  "strategy": "",
  "fix_and_flip": [false, {
    "arv": [false, defaults.arv.default],
    "margin": [false, defaults.margin.default],
  }],
  "buy_and_hold": [false, {
    "gross_yield": [false, defaults.grossYield.default],
    "cap_rate": [false, defaults.capRate.default],
  }],
};

const similaritySchema = z.object({
  "Same Property Type": z.boolean(),
  "Same Neighborhood": z.boolean(),
  "Bedrooms": rangeSchema.default([false, [0, 100]]),
  "Bathrooms": rangeSchema.default([false, [0, 100]]),
  "Building sqft": rangeSchema.default([false, [0, 100]]),
  "Year Built": rangeSchema.default([false, [0, 100]]),
  "Lot sqft": rangeSchema.default([false, [0, 100]]),
  "Same Pool Status": z.boolean(),
  "Garages": rangeSchema.default([false, [0, 100]]),
  "Distance": z.array(z.union([z.boolean(), z.number()])),
  "Sale Date": z.array(z.union([z.boolean(), z.number()])),
});

const defaultSimilarityValues = {
  "Same Property Type": false,
  "Same Neighborhood": true,
  "Bedrooms": [false, [
    defaultSimilarityFields.bedrooms.min,
    defaultSimilarityFields.bedrooms.max,
  ]],
  "Bathrooms": [false, [
    defaultSimilarityFields.bathrooms.min,
    defaultSimilarityFields.bathrooms.max,
  ]],
  "Year Built": [false, [
    defaultSimilarityFields.yearBuilt.min,
    defaultSimilarityFields.yearBuilt.max,
  ]],
  "Building sqft": [false, [
    defaultSimilarityFields.area.min,
    defaultSimilarityFields.area.max,
  ]],
  "Lot sqft": [false, [
    defaultSimilarityFields.lotSize.min,
    defaultSimilarityFields.lotSize.max,
  ]],
  "Same Pool Status": false,
  "Garages": [false, [
    defaultSimilarityFields.garages.min,
    defaultSimilarityFields.garages.max,
  ]],
  "Distance": [false, defaultSimilarityFields.distance.min],
  "Sale Date": [false, defaultSimilarityFields.saleDate.min],
};

const similarityFullSchema = z.object({
  "red": similaritySchema,
  "orange": similaritySchema,
  "yellow": similaritySchema,
  "green": similaritySchema,
});

const defaultSimilarityFullValues = {
  "red": defaultSimilarityValues,
  "orange": defaultSimilarityValues,
  "yellow": defaultSimilarityValues,
  "green": defaultSimilarityValues,
};

const similarityWeightsSchema = z.object({
  "red": z.number(),
  "orange": z.number(),
  "yellow": z.number(),
  "green": z.number(),
});

const defaultSimilarityWeights = {
  "red": 0.1,
  "orange": 0.3,
  "yellow": 0.8,
  "green": 1,
};

const locationSchema = z.object({
  "locations": z.array(
    z.object({
      "type": z.string(),
      "name": z.string(),
      "identifier": z.string(),
    }),
  ),
  "area": z.object({
    "Flood": z.boolean(),
  }),
}).optional();

const defaultLocationValues = {
  "locations": [],
  "area": {
    "Flood": false,
  },
};

const buyboxSchema = z.object({
  "buybox_name": z.string().min(3, "Name must be at least 3 characters long")
    .default(""),
  "description": z.string().optional(),
  // locations: z.array(z.string()).optional(),
  "target_location": locationSchema.default(defaultLocationValues),
  property: propertySchema.default(defaultPropertyValues),
  opp: oppSchema.default(defaultOppValues),
  similarity: similarityFullSchema.default(defaultSimilarityFullValues),
  "similarity_weights": similarityWeightsSchema.default(
    defaultSimilarityWeights,
  ),
});

const buyboxSchemaV2 = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string().optional(),
  locations: z.array(z.string()),
  limitations: z.boolean(),
  arv: z.object({
    active: z.boolean(),
    values: z.array(z.number()).optional(),
  }).default({ active: false, values: [0, 100] }),
  fixAndFlip: z.boolean(),
  margin: z.object({
    active: z.boolean(),
    values: z.array(z.number()).optional(),
  }).default({ active: false, values: [0, 100] }),
  centsOnDollar: z.object({
    active: z.boolean(),
    values: z.array(z.number()).optional(),
  }).default({ active: false, values: [0, 100] }),
  buyAndHold: z.boolean(),
  capRate: z.object({
    active: z.boolean(),
    values: z.array(z.number()).optional(),
  }).default({ active: false, values: [0, 100] }),
  noHighFloodRisk: z.boolean(),

  propertyType: z.object({
    active: z.boolean(),
    values: z.array(z.string()).optional(),
  }).default({ active: false, values: [] }),
  bedrooms: z.object({
    active: z.boolean(),
    values: z.array(z.number()).optional(),
  }).default({ active: false, values: [0, 100] }),

  bathrooms: z.object({
    active: z.boolean(),
    values: z.array(z.number()).optional(),
  }).default({ active: false, values: [0, 100] }),

  buildingSqft: z.object({
    active: z.boolean(),
    values: z.array(z.number()).optional(),
  }).default({ active: false, values: [0, 100] }),

  lotSqft: z.object({
    active: z.boolean(),
    values: z.array(z.number()).optional(),
  }).default({ active: false, values: [0, 100] }),

  yearBuilt: z.object({
    active: z.boolean(),
    values: z.array(z.number()).optional(),
  }).default({ active: false, values: [0, 100] }),

  pool: z.boolean(),

  garages: z.object({
    active: z.boolean(),
    values: z.array(z.number()).optional(),
  }).default({ active: false, values: [0, 100] }),

  listingPrice: z.object({
    active: z.boolean(),
    values: z.array(z.number()).optional(),
  }).default({ active: false, values: [0, 100] }),
  green: similaritySchema.default(defaultSimilarityValues),
  yellow: similaritySchema.default(defaultSimilarityValues),
  orange: similaritySchema.default(defaultSimilarityValues),
  red: similaritySchema.default(defaultSimilarityValues),
});

function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  const data = Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) {
        console.log(key, value._def.defaultValue());
        return [key, value._def.defaultValue()];
      }
      return [key, undefined];
    }),
  );
  console.log(data);
  return data;
}

const getDefaultData = () => {
  const defaultData = {
    "buybox_name": "",
    "description": "",
    // locations: z.array(z.string()).optional(),
    "target_location": Object.assign(defaultLocationValues),
    property: Object.assign(defaultPropertyValues),
    opp: Object.assign(defaultOppValues),
    similarity: defaultSimilarityFullValues,
    "similarity_weights": defaultSimilarityWeights,
  };
  return defaultData;
};

type buyboxSchemaType = z.infer<typeof buyboxSchema>;

export { buyboxSchema, getDefaultData, getDefaults };
export type { buyboxSchemaType };
