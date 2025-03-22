import z from 'zod';

const StatusSchema = z.enum([
  'PENDING_INTRO',
  'INTRO_SENT',
  'INTRO_RECEIVED',
  'INTERESTED',
  'NOT_INTERESTED'
]);

export type RealtorStatus = z.infer<typeof StatusSchema>;

const realtorStateSchema = z.object({
  status: StatusSchema,
  firstInteractionDate: z.date().optional(),
  lastInteractionDate: z.date().optional(),
  totalInteractions: z.number().int().optional()
});

export const RealtorSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  phoneNumbers: z.array(z.string()),
  state: realtorStateSchema
});

export type Realtor = z.infer<typeof RealtorSchema>;
