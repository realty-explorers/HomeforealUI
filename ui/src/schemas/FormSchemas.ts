import z from 'zod';

const listSchema = z.object({
  enabled: z.boolean(),
  items: z.array(z.string())
});

const minSchema = z.object({
  enabled: z.boolean(),
  value: z.number()
});

const rangeSchema = z
  .object({
    enabled: z.boolean(),
    min: z.number(),
    max: z.number()
  })
  .refine((data) => !data.enabled || data.max >= data.min, {
    message: 'Max value must be greater than or equal to min value'
  });

function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  const data = Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) {
        console.log(key, value._def.defaultValue());
        return [key, value._def.defaultValue()];
      }
      return [key, undefined];
    })
  );
  console.log(data);
  return data;
}

export type RangeField = z.infer<typeof rangeSchema>;
export type ListField = z.infer<typeof listSchema>;
export type MinField = z.infer<typeof minSchema>;

export { rangeSchema, listSchema, minSchema };
