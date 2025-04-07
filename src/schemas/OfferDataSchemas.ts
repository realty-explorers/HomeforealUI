import { z } from 'zod';

const moneySchema = z
  .number()
  .min(1, { message: 'Amount must be greater than 0' });
const financingTypesSchema = z.enum(['Cash', 'Loan', 'Other']);
const surveyorChoiceSchema = z.enum(['Buyer', 'Seller', 'Mutual']);
const daysSchema = z.number().int().positive();

export const OfferSchema = z.object({
  buyerDetails: z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' }),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email address')
  }),
  // Purchase Price and Financing
  financialDetails: z.object({
    purchasePrice: moneySchema,
    financingType: z.string().min(2, 'Financing type is required'),
    financingTypeOther: z
      .string()
      .min(2, 'Financing type must be atleast 2 characters')
      .optional(),
    loanAmount: z.number().nonnegative().optional()
  }),

  deposit: z.object({
    depositAmount: z.number().nonnegative(),
    holderName: z.string(),
    holderAddress: z.string(),
    holderPhone: z.string().optional(),
    holderEmail: z.union([z.string().email().optional(), z.literal('')])
  }),

  conditions: z.object({
    subjectProperty: z.object({
      exists: z.boolean(),
      address: z.string().min(2, { message: 'Address is required' }).optional()
    }),
    excludeFixtures: z.object({
      exclude: z.boolean(),
      fixtures: z.string().optional()
    }),
    propertyState: z.object({
      isNew: z.boolean(),
      requestBuilderWarrany: z.boolean()
    }),
    sellerRepairs: z.object({
      isRequired: z.boolean(),
      repairsDetails: z.string().optional()
    }),
    residentialServiceContract: z.object({
      exists: z.boolean(),
      maximumReimbursement: z.number().nonnegative().optional()
    })
  }),

  propertyDisclosures: z.object({
    occupancyAndProperty: z.boolean(),
    fixturesAndItems: z.boolean(),
    roof: z.boolean(),
    additionsAndAlterations: z.boolean(),
    soilTreeAndVegetation: z.boolean(),
    woodDestroyingOrganisms: z.boolean(),
    floodAndMoisture: z.boolean(),
    toxicMaterialAndSubstances: z.boolean(),
    covenantsFeesAndAssessments: z.boolean(),
    plumbing: z.boolean(),
    insulation: z.boolean(),
    miscellaneous: z.boolean(),
    additionalDisclosures: z.string().optional()
  }),

  propertyReports: z.object({
    endangeredSpeciesReport: z.boolean(),
    environmnetalReport: z.boolean()
  }),

  landSurvey: z.object({
    requireNewSurvey: z.boolean(),
    surveyorChoice: surveyorChoiceSchema
  }),

  legalDescription: z.object({
    description: z.string().optional()
  }),

  propertyTerms: z.object({
    conductInspection: z.boolean(),
    isInspectionContingent: z.boolean().optional(),
    inspectionDurationDays: z.number().nonnegative().optional()
  }),

  settlementExpenses: z.object({
    sellerPaysFixedAmount: z.boolean(),
    sellerCostsFixed: z.number().nonnegative().optional(),
    sellerCostsPercentage: z.number().min(0).max(100).optional()
  }),

  closingDetails: z.object({
    closeByDate: z.boolean(),
    closingDate: z.string().optional(),
    closingDeadline: z.number().nonnegative().optional(),
    optionToTerminate: z.boolean(),
    additionalClause: z.string().optional()
  }),

  terminationOption: z.object({
    allowTermination: z.boolean(),
    terminationFee: z.number().nonnegative().optional(),
    terminationPeriodDays: daysSchema.optional()
  })
});

export type OfferFormData = z.infer<typeof OfferSchema>;
