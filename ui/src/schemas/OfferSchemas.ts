import { z } from 'zod';

// Helper schemas for common patterns
const moneySchema = z.number().positive('Amount must be greater than 0');
const daysSchema = z.number().min(0).max(365);

const financingTypesSchema = z.enum(['BANK', 'SELLER', 'EXISTING_MORTGAGE']);
export const financingTypeLabels = financingTypesSchema.options;

const surveyorChoiceSchema = z.enum(['buyer', 'seller', 'shared']);
export const surveyorChoiceLabels = surveyorChoiceSchema.options;

export const OfferSchema = z.object({
  // Purchase Price and Financing
  financialDetails: z.object({
    purchasePrice: moneySchema,
    requireFinancing: z.boolean(),
    financingType: financingTypesSchema.optional(),
    loanAmount: z.number().optional(),
    interestRate: z.number().optional()
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
  propertyDescription: z.object({
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

  // Closing and Possession
  closingDetails: z.object({
    closingMethod: z.enum(['specific_date', 'days_after_execution']),
    closingDate: z.string().optional(),
    daysAfterExecution: z.number().optional(),
    possessionDate: z.string(),
    possessionTime: z.string()
  }),

  // Option to Terminate
  terminationOption: z.object({
    allowTermination: z.boolean(),
    terminationFee: moneySchema.optional(),
    terminationPeriodDays: daysSchema.optional()
  }),

  // Additional Clauses
  additionalClauses: z
    .array(
      z.object({
        clause: z.string(),
        details: z.string()
      })
    )
    .optional(),

  // Settlement Expenses
  settlementExpenses: z.object({
    closingCostsPaidBy: z.enum(['buyer', 'seller', 'split']),
    splitPercentageBuyer: z.number().optional(),
    splitPercentageSeller: z.number().optional(),
    transferTaxPaidBy: z.enum(['buyer', 'seller', 'split'])
  })
});

export type OfferSchemaType = z.infer<typeof OfferSchema>;
