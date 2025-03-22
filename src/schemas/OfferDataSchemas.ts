import { z } from 'zod';

const moneySchema = z
  .number()
  .min(1, { message: 'Amount must be greater than 0' });
const financingTypesSchema = z.enum(['Cash', 'Mortgage', 'Other']);
const surveyorChoiceSchema = z.enum(['Buyer', 'Seller', 'Mutual']);
const daysSchema = z.number().int().positive();

export const OfferSchema = z.object({
  // Purchase Price and Financing
  financialDetails: z.object({
    purchasePrice: moneySchema,
    financingType: financingTypesSchema,
    loanAmount: z.number().nonnegative().optional()
  }),

  // Deposit
  deposit: z.object({
    depositAmount: z.number().nonnegative(),
    holderName: z.string(),
    holderAddress: z.string(),
    holderPhone: z.string().optional(),
    holderEmail: z.union([z.string().email().optional(), z.literal('')])
  }),

  // Conditions
  conditions: z.object({
    subjectProperty: z.boolean().optional(),
    exludedFixtures: z.array(z.string()).optional()
  }),

  // Land Survey
  landSurvey: z.object({
    requireNewSurvey: z.boolean(),
    surveyorChoice: surveyorChoiceSchema
  }),

  // Property Description
  legalDescription: z.object({
    description: z.string().optional()
  }),

  // Inspection Period
  propertyTerms: z.object({
    conductInspection: z.boolean(),
    isInspectionContingent: z.boolean().optional(),
    inspectionDurationDays: z.number().nonnegative().optional(),
    lease: z.boolean()
  }),

  propertyConditions: z.object({
    isNew: z.boolean(),
    disclosureTopics: z.object({
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
    sellerRepairs: z.string().optional(),
    conductEndangeredSpeciesReport: z.boolean(),
    conductEnvironmnetalReport: z.boolean(),
    requireResidentialServiceContract: z.boolean()
  }),

  buyerDetails: z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' }),
    address: z.string(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email address')
  }),

  settlementExpenses: z.object({
    sellerPaysSettlementExpenses: z.boolean(),
    settlementAmount: z.number().nonnegative().optional()
  }),

  closingDetails: z.object({
    closingDate: z.string().optional(),
    possesionOnClosing: z.boolean(),
    optionToTerminate: z.boolean(),
    additionalClause: z.string().optional()
  }),

  // Option to Terminate
  terminationOption: z.object({
    allowTermination: z.boolean(),
    terminationFee: z.number().nonnegative().optional(),
    terminationPeriodDays: daysSchema.optional()
  })
});

export type OfferFormData = z.infer<typeof OfferSchema>;
