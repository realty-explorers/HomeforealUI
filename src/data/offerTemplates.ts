import { OfferFormData } from '@/schemas/OfferDataSchemas';

type TemplateType = 'residential' | 'commercial' | 'vacant-land' | 'custom';

export interface OfferTemplate {
  id: string;
  type: TemplateType;
  name: string;
  description: string;
  icon: string;
  data: OfferFormData;
}

export const offerTemplates: OfferTemplate[] = [
  {
    id: 'cash-offer-residential',
    type: 'residential',
    name: 'Cash Offer',
    description:
      'A straightforward all-cash offer with minimal contingencies for quick closing',
    icon: 'dollar-sign',
    data: {
      buyerDetails: {
        name: '[Buyer Name]',
        address: '[Buyer Address]',
        email: 'buyer@example.com'
      },
      financialDetails: {
        purchasePrice: 100000,
        financingType: 'Cash',
        loanAmount: 0
      },
      deposit: {
        depositAmount: 5000,
        holderName: 'Escrow Company',
        holderAddress: '123 Escrow St, City, State, ZIP',
        holderEmail: 'escrow@example.com'
      },
      conditions: {
        subjectProperty: {
          exists: false
        },
        excludeFixtures: {
          exclude: false
        },
        propertyState: {
          isNew: false,
          requestBuilderWarrany: false
        },
        sellerRepairs: {
          isRequired: false
        },
        residentialServiceContract: {
          exists: false
        }
      },
      propertyDisclosures: {
        occupancyAndProperty: true,
        fixturesAndItems: true,
        roof: true,
        additionsAndAlterations: true,
        soilTreeAndVegetation: true,
        woodDestroyingOrganisms: true,
        floodAndMoisture: true,
        toxicMaterialAndSubstances: true,
        covenantsFeesAndAssessments: true,
        plumbing: true,
        insulation: true,
        miscellaneous: true
      },
      propertyReports: {
        endangeredSpeciesReport: false,
        environmnetalReport: false
      },
      landSurvey: {
        requireNewSurvey: false,
        surveyorChoice: 'Buyer'
      },
      legalDescription: {},
      propertyTerms: {
        conductInspection: true,
        isInspectionContingent: false,
        inspectionDurationDays: 7
      },
      settlementExpenses: {
        sellerPaysFixedAmount: false,
        sellerCostsFixed: 0
      },
      closingDetails: {
        closeByDate: true,
        closingDeadline: 30,
        optionToTerminate: true
      },
      terminationOption: {
        allowTermination: true,
        terminationFee: 1000,
        terminationPeriodDays: 10
      }
    }
  },
  {
    id: 'mortgage-offer-residential',
    type: 'residential',
    name: 'Mortgage Offer',
    description:
      'Standard financing offer with loan contingencies for traditional purchases',
    icon: 'home-loan',
    data: {
      buyerDetails: {
        name: '[Buyer Name]',
        address: '[Buyer Address]',
        email: 'buyer@example.com'
      },
      financialDetails: {
        purchasePrice: 250000,
        financingType: 'Loan',
        loanAmount: 200000
      },
      deposit: {
        depositAmount: 5000,
        holderName: 'Escrow Company',
        holderAddress: '123 Escrow St, City, State, ZIP',
        holderEmail: 'escrow@example.com'
      },
      conditions: {
        subjectProperty: {
          exists: false
        },
        excludeFixtures: {
          exclude: false
        },
        propertyState: {
          isNew: false,
          requestBuilderWarrany: false
        },
        sellerRepairs: {
          isRequired: true,
          repairsDetails: 'Any repairs required by lender appraisal'
        },
        residentialServiceContract: {
          exists: true,
          maximumReimbursement: 500
        }
      },
      propertyDisclosures: {
        occupancyAndProperty: true,
        fixturesAndItems: true,
        roof: true,
        additionsAndAlterations: true,
        soilTreeAndVegetation: true,
        woodDestroyingOrganisms: true,
        floodAndMoisture: true,
        toxicMaterialAndSubstances: true,
        covenantsFeesAndAssessments: true,
        plumbing: true,
        insulation: true,
        miscellaneous: true
      },
      propertyReports: {
        endangeredSpeciesReport: false,
        environmnetalReport: false
      },
      landSurvey: {
        requireNewSurvey: true,
        surveyorChoice: 'Seller'
      },
      legalDescription: {},
      propertyTerms: {
        conductInspection: true,
        isInspectionContingent: true,
        inspectionDurationDays: 10
      },
      settlementExpenses: {
        sellerPaysFixedAmount: true,
        sellerCostsFixed: 3000
      },
      closingDetails: {
        closeByDate: true,
        closingDeadline: 45,
        optionToTerminate: true,
        additionalClause:
          'This offer is contingent upon buyer obtaining financing at an interest rate not to exceed 7% within 30 days.'
      },
      terminationOption: {
        allowTermination: true,
        terminationFee: 1000,
        terminationPeriodDays: 15
      }
    }
  }
  // {
  //   id: 'investor-offer',
  //   type: 'vacant-land',
  //   name: 'Investor Special',
  //   description: 'Optimized for investment properties with tenants',
  //   icon: '📈',
  //   data: {
  //     financialDetails: {
  //       purchasePrice: 400000,
  //       financingType: 'Other',
  //       loanAmount: 300000
  //     },
  //     deposit: {
  //       depositAmount: 40000,
  //       holderName: 'Investor Title LLC',
  //       holderAddress: '789 Market St, City, State 12345',
  //       holderPhone: '(555) 234-5678',
  //       holderEmail: 'deposits@investortitle.com'
  //     },
  //     conditions: {
  //       subjectProperty: true,
  //       exludedFixtures: []
  //     },
  //     landSurvey: {
  //       requireNewSurvey: false,
  //       surveyorChoice: 'Seller'
  //     },
  //     legalDescription: {
  //       description: ''
  //     },
  //     propertyTerms: {
  //       conductInspection: true,
  //       isInspectionContingent: true,
  //       inspectionDurationDays: 7,
  //       lease: true
  //     },
  //     propertyConditions: {
  //       isNew: false,
  //       disclosureTopics: {
  //         occupancyAndProperty: true,
  //         fixturesAndItems: true,
  //         roof: true,
  //         additionsAndAlterations: true,
  //         soilTreeAndVegetation: true,
  //         woodDestroyingOrganisms: true,
  //         floodAndMoisture: true,
  //         toxicMaterialAndSubstances: true,
  //         covenantsFeesAndAssessments: true,
  //         plumbing: true,
  //         insulation: true,
  //         miscellaneous: true,
  //         additionalDisclosures:
  //           'Current tenant information and lease details to be provided'
  //       },
  //       sellerRepairs: 'None - property sold as-is',
  //       conductEndangeredSpeciesReport: false,
  //       conductEnvironmnetalReport: true,
  //       requireResidentialServiceContract: false
  //     },
  //     buyerDetails: {
  //       name: '',
  //       address: '',
  //       phone: '',
  //       email: ''
  //     },
  //     settlementExpenses: {
  //       sellerPaysSettlementExpenses: false,
  //       settlementAmount: 0
  //     },
  //     closingDetails: {
  //       closingDate: '',
  //       optionToTerminate: true,
  //       additionalClause:
  //         'Subject to review of current tenant leases and rental income verification'
  //     },
  //     terminationOption: {
  //       allowTermination: true,
  //       terminationFee: 5000,
  //       terminationPeriodDays: 15
  //     }
  //   }
  // },
  // {
  //   id: 'new-construction',
  //   type: 'custom',
  //   name: 'New Construction',
  //   description: 'Tailored for newly built properties',
  //   icon: '🏗️',
  //   data: {
  //     financialDetails: {
  //       purchasePrice: 450000,
  //       financingType: 'Mortgage',
  //       loanAmount: 360000
  //     },
  //     deposit: {
  //       depositAmount: 45000,
  //       holderName: 'Builder Escrow Services',
  //       holderAddress: '101 Builder Way, City, State 12345',
  //       holderPhone: '(555) 345-6789',
  //       holderEmail: 'escrow@builderservices.com'
  //     },
  //     conditions: {
  //       subjectProperty: false,
  //       exludedFixtures: []
  //     },
  //     landSurvey: {
  //       requireNewSurvey: true,
  //       surveyorChoice: 'Seller'
  //     },
  //     legalDescription: {
  //       description: ''
  //     },
  //     propertyTerms: {
  //       conductInspection: true,
  //       isInspectionContingent: true,
  //       inspectionDurationDays: 14,
  //       lease: false
  //     },
  //     propertyConditions: {
  //       isNew: true,
  //       disclosureTopics: {
  //         occupancyAndProperty: true,
  //         fixturesAndItems: true,
  //         roof: true,
  //         additionsAndAlterations: false,
  //         soilTreeAndVegetation: true,
  //         woodDestroyingOrganisms: false,
  //         floodAndMoisture: true,
  //         toxicMaterialAndSubstances: true,
  //         covenantsFeesAndAssessments: true,
  //         plumbing: true,
  //         insulation: true,
  //         miscellaneous: true,
  //         additionalDisclosures:
  //           'Builder warranty information to be provided at closing'
  //       },
  //       sellerRepairs: '1-year builder warranty on all systems and structures',
  //       conductEndangeredSpeciesReport: false,
  //       conductEnvironmnetalReport: false,
  //       requireResidentialServiceContract: false
  //     },
  //     buyerDetails: {
  //       name: '',
  //       address: '',
  //       phone: '',
  //       email: ''
  //     },
  //     settlementExpenses: {
  //       sellerPaysSettlementExpenses: true,
  //       settlementAmount: 5000
  //     },
  //     closingDetails: {
  //       closingDate: '',
  //       optionToTerminate: true,
  //       additionalClause:
  //         'Final walkthrough to be conducted no more than 3 days before closing'
  //     },
  //     terminationOption: {
  //       allowTermination: true,
  //       terminationFee: 3000,
  //       terminationPeriodDays: 10
  //     }
  //   }
  // }
];

export const emptyTemplate: Omit<
  OfferTemplate,
  'id' | 'name' | 'description' | 'icon' | 'type'
> = {
  data: {
    buyerDetails: {
      name: '',
      address: '',
      email: ''
    },
    financialDetails: {
      purchasePrice: 1,
      financingType: ''
    },
    deposit: {
      depositAmount: 0,
      holderName: '',
      holderAddress: '',
      holderEmail: ''
    },
    conditions: {
      subjectProperty: {
        exists: false
      },
      excludeFixtures: {
        exclude: false
      },
      propertyState: {
        isNew: false,
        requestBuilderWarrany: false
      },
      sellerRepairs: {
        isRequired: false
      },
      residentialServiceContract: {
        exists: false
      }
    },
    propertyDisclosures: {
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
      miscellaneous: false
    },
    propertyReports: {
      endangeredSpeciesReport: false,
      environmnetalReport: false
    },
    landSurvey: {
      requireNewSurvey: false,
      surveyorChoice: 'Buyer'
    },
    legalDescription: {},
    propertyTerms: {
      conductInspection: false
    },
    settlementExpenses: {
      sellerPaysFixedAmount: true
    },
    closingDetails: {
      closeByDate: true,
      optionToTerminate: false
    },
    terminationOption: {
      allowTermination: false
    }
  }
};
