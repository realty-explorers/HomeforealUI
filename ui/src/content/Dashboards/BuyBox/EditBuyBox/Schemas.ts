import z from "zod";

const rangeSchema = z.array(z.union([z.boolean(), z.array(z.number())]));

const propertySchema = z.object({
  "Property Type": z.array(z.union([z.boolean(), z.string()])),
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
  "Property Type": [false, "Single-Family"],
  "Bedrooms": [false, [0, 100]],
  "Bathrooms": [false, [0, 100]],
  "Building sqft": [false, [0, 100]],
  "Lot sqft": [false, [0, 100]],
  "Year Built": [false, [0, 100]],
  "Pool": [false, "With"],
  "Garages": [false, [0, 100]],
  "Listing Price": [false, [0, 100]],
};

const oppSchema = z.object({
  "Limitations": z.array(z.union([
    z.boolean(),
    z.object({
      "ARV": rangeSchema,
    }),
  ])),

  "Fix & Flip": z.array(z.union([
    z.boolean(),
    z.object({
      "Margin": rangeSchema,
      "Cent on $": rangeSchema,
    }),
  ])),

  "Buy & Hold": z.array(z.union([
    z.boolean(),
    z.object({
      "Cap Rate": rangeSchema,
    }),
  ])),
});

const defaultOppValues = {
  "Limitations": [false, {
    "ARV": [false, [0, 100]],
  }],
  "Fix & Flip": [false, {
    "Margin": [false, [0, 100]],
    "Cent on $": [false, [0, 100]],
  }],
  "Buy & Hold": [false, {
    "Cap Rate": [false, [0, 100]],
  }],
};

const similaritySchema = z.object({
  "Same Property Type": z.boolean(),
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
  "Bedrooms": [false, [0, 100]],
  "Bathrooms": [false, [0, 100]],
  "Year Built": [false, [0, 100]],
  "Building sqft": [false, [0, 100]],
  "Lot sqft": [false, [0, 100]],
  "Same Pool Status": false,
  "Garages": [false, [0, 100]],
  "Distance": [false, 0],
  "Sale Date": [false, 0],
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
  "red": 0,
  "orange": 0,
  "yellow": 0,
  "green": 0,
};

const buyboxSchema = z.object({
  "buybox_name": z.string().default(""),
  "description": z.string().optional(),
  locations: z.array(z.string()),
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
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) {
        return [key, value._def.defaultValue()];
      }
      return [key, undefined];
    }),
  );
}

type buyboxSchemaType = z.infer<typeof buyboxSchema>;

export { buyboxSchema, getDefaults };
export type { buyboxSchemaType };
