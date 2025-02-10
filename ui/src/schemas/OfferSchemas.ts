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
    loanAmount: z.number().nonnegative().optional()
  }),

  // Deposit
  deposit: z.object({
    depositAmount: moneySchema,
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
    email: z.union([z.string().email().optional(), z.literal('')])
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

export type OfferSchemaType = z.infer<typeof OfferSchema>;

export const defaultOfferData: OfferSchemaType = {
  financialDetails: {
    purchasePrice: 0,
    financingType: 'CONVENTIONAL LOAN',
    loanAmount: 0
  },
  deposit: {
    depositAmount: 0,
    holderName: '',
    holderAddress: '',
    holderPhone: undefined,
    holderEmail: undefined
  },
  conditions: {
    subjectProperty: false,
    exludedFixtures: []
  },
  landSurvey: {
    requireNewSurvey: false,
    surveyorChoice: 'buyer'
  },
  legalDescription: {
    description: ''
  },
  propertyTerms: {
    conductInspection: false,
    isInspectionContingent: false,
    inspectionDurationDays: 0,
    lease: false
  },
  propertyConditions: {
    isNew: false,
    disclosureTopics: {
      occupancyAndProperty: false,
      fixturesAndItems: false,
      roof: false,
      additionsAndAlterations: false,
      soilTreeAndVegetation: false,
      woodDestroyingOrganisms: false,
      floodAndMoisture: false,
      toxicMaterialAndSubstances: false,
      covenantsFeesAndAssessments: false,
      plumbing: false,
      insulation: false,
      miscellaneous: false,
      additionalDisclosures: ''
    },
    sellerRepairs: '',
    conductEndangeredSpeciesReport: false,
    conductEnvironmnetalReport: false,
    requireResidentialServiceContract: false
  },
  buyerDetails: {
    name: '',
    address: ''
  },
  settlementExpenses: {
    sellerPaysSettlementExpenses: false,
    settlementAmount: 0
  },
  closingDetails: {
    closingDate: '',
    possesionOnClosing: false,
    optionToTerminate: false,
    additionalClause: ''
  },
  terminationOption: {
    allowTermination: false,
    terminationFee: 0,
    terminationPeriodDays: 0
  }
};
