import z from "zod";

const rangeSchema = z.array(z.union([z.boolean(), z.array(z.number())]));

const defaultSimilarityValues = {
  samePropertyType: false,
  bedrooms: [false, [0, 100]],
  bathrooms: [false, [0, 100]],
  yearBuilt: [false, [0, 100]],
  buildingSqft: [false, [0, 100]],
  lotSqft: [false, [0, 100]],
  samePoolStatus: false,
  garages: [false, [0, 100]],
  distance: 0,
  saleDate: 0,
  weight: 0,
};

const similaritySchema = z.object({
  samePropertyType: z.boolean(),
  bedrooms: rangeSchema.default([false, [0, 100]]),
  bathrooms: rangeSchema.default([false, [0, 100]]),
  yearBuilt: rangeSchema.default([false, [0, 100]]),

  buildingSqft: rangeSchema.default([false, [0, 100]]),
  lotSqft: rangeSchema.default([false, [0, 100]]),
  samePoolStatus: z.boolean(),
  garages: rangeSchema.default([false, [0, 100]]),
  distance: z.number(),
  saleDate: z.number(),
  weight: z.number(),
});

const buyboxSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string().optional(),
  locations: z.array(z.string()),
  limitations: z.boolean(),
  arv: rangeSchema.default([false, [0, 100]]),
  fixAndFlip: z.boolean(),
  margin: rangeSchema.default([false, [0, 100]]),
  centsOnDollar: rangeSchema.default([false, [0, 100]]),
  buyAndHold: z.boolean(),
  capRate: rangeSchema.default([false, [0, 100]]),
  noHighFloodRisk: z.boolean(),

  propertyType: rangeSchema.default([false, [0, 100]]),
  bedrooms: rangeSchema.default([false, [0, 100]]),
  bathrooms: rangeSchema.default([false, [0, 100]]),
  buildingSqft: rangeSchema.default([false, [0, 100]]),
  lotSqft: rangeSchema.default([false, [0, 100]]),
  yearBuilt: rangeSchema.default([false, [0, 100]]),
  pool: z.boolean(),
  garages: rangeSchema.default([false, [0, 100]]),
  listingPrice: rangeSchema.default([false, [0, 100]]),
  green: similaritySchema.default(defaultSimilarityValues),
  yellow: similaritySchema.default(defaultSimilarityValues),
  orange: similaritySchema.default(defaultSimilarityValues),
  red: similaritySchema.default(defaultSimilarityValues),
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
