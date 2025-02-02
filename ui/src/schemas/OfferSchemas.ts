import { z } from 'zod';

// Helper schemas for common patterns
const moneySchema = z.number().positive('Amount must be greater than 0');
const daysSchema = z.number().min(0).max(365);

const financingTypesSchema = z.enum([
  'CONVENTIONAL LOAN',
  'SELLER FINANCE',
  'SUBJECT TO',
  'CASH'
]);
export const financingTypeLabels = financingTypesSchema.options;

const surveyorChoiceSchema = z.enum(['buyer', 'seller', 'shared']);
export const surveyorChoiceLabels = surveyorChoiceSchema.options;

export const OfferSchema = z.object({
  // Purchase Price and Financing
  financialDetails: z.object({
    purchasePrice: moneySchema,
    financingType: financingTypesSchema.optional(),
    loanAmount: z.number().optional()
  }),

  // Deposit
  deposit: z.object({
    depositAmount: moneySchema,
    holderName: z.string(),
    holderAddress: z.string(),
    holderPhone: z.string().optional(),
    holderEmail: z.string().email().optional()
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
    inspectionDurationDays: daysSchema.optional(),
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
    name: z.string(),
    address: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional()
  }),

  settlementExpenses: z.object({
    sellerPaysSettlementExpenses: z.boolean(),
    settlementAmount: moneySchema.optional()
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
    terminationFee: moneySchema.optional(),
    terminationPeriodDays: daysSchema.optional()
  })
});

export type OfferSchemaType = z.infer<typeof OfferSchema>;
