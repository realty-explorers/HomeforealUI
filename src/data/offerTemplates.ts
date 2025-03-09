type TemplateType = 'residential' | 'commercial' | 'vacant-land' | 'custom';

export interface OfferTemplate {
  id: string;
  type: TemplateType;
  name: string;
  description: string;
  icon: string;
  data: {
    financialDetails: {
      purchasePrice: number;
      financingType?: 'Cash' | 'Mortgage' | 'Other';
      loanAmount?: number;
    };
    deposit: {
      depositAmount: number;
      holderName: string;
      holderAddress: string;
      holderPhone?: string;
      holderEmail?: string;
    };
    conditions: {
      subjectProperty?: boolean;
      exludedFixtures?: string[];
    };
    landSurvey: {
      requireNewSurvey: boolean;
      surveyorChoice: 'Buyer' | 'Seller' | 'Mutual';
    };
    legalDescription: {
      description?: string;
    };
    propertyTerms: {
      conductInspection: boolean;
      isInspectionContingent?: boolean;
      inspectionDurationDays?: number;
      lease: boolean;
    };
    propertyConditions: {
      isNew: boolean;
      disclosureTopics: {
        occupancyAndProperty: boolean;
        fixturesAndItems: boolean;
        roof: boolean;
        additionsAndAlterations: boolean;
        soilTreeAndVegetation: boolean;
        woodDestroyingOrganisms: boolean;
        floodAndMoisture: boolean;
        toxicMaterialAndSubstances: boolean;
        covenantsFeesAndAssessments: boolean;
        plumbing: boolean;
        insulation: boolean;
        miscellaneous: boolean;
        additionalDisclosures?: string;
      };
      sellerRepairs?: string;
      conductEndangeredSpeciesReport: boolean;
      conductEnvironmnetalReport: boolean;
      requireResidentialServiceContract: boolean;
    };
    buyerDetails: {
      name: string;
      address: string;
      phone?: string;
      email?: string;
    };
    settlementExpenses: {
      sellerPaysSettlementExpenses: boolean;
      settlementAmount?: number;
    };
    closingDetails: {
      closingDate?: string;
      possesionOnClosing: boolean;
      optionToTerminate: boolean;
      additionalClause?: string;
    };
    terminationOption: {
      allowTermination: boolean;
      terminationFee?: number;
      terminationPeriodDays?: number;
    };
  };
}

export const offerTemplates: OfferTemplate[] = [
  {
    id: 'cash-offer',
    type: 'residential',
    name: 'Cash Offer',
    description: 'Quick closing with no financing contingency',
    icon: '💰',
    data: {
      financialDetails: {
        purchasePrice: 250000,
        financingType: 'Cash',
        loanAmount: 0
      },
      deposit: {
        depositAmount: 25000,
        holderName: 'ABC Title Company',
        holderAddress: '123 Main St, City, State 12345',
        holderPhone: '(555) 123-4567',
        holderEmail: 'escrow@abctitle.com'
      },
      conditions: {
        subjectProperty: false,
        exludedFixtures: []
      },
      landSurvey: {
        requireNewSurvey: true,
        surveyorChoice: 'Buyer'
      },
      legalDescription: {
        description: ''
      },
      propertyTerms: {
        conductInspection: true,
        isInspectionContingent: true,
        inspectionDurationDays: 10,
        lease: false
      },
      propertyConditions: {
        isNew: false,
        disclosureTopics: {
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
          miscellaneous: true,
          additionalDisclosures: ''
        },
        sellerRepairs: '',
        conductEndangeredSpeciesReport: false,
        conductEnvironmnetalReport: true,
        requireResidentialServiceContract: false
      },
      buyerDetails: {
        name: '',
        address: '',
        phone: '',
        email: ''
      },
      settlementExpenses: {
        sellerPaysSettlementExpenses: false,
        settlementAmount: 0
      },
      closingDetails: {
        closingDate: '',
        possesionOnClosing: true,
        optionToTerminate: true,
        additionalClause: ''
      },
      terminationOption: {
        allowTermination: true,
        terminationFee: 1000,
        terminationPeriodDays: 5
      }
    }
  },
  {
    id: 'mortgage-offer',
    type: 'commercial',
    name: 'Mortgage Offer',
    description: 'Standard offer with financing contingency',
    icon: '🏦',
    data: {
      financialDetails: {
        purchasePrice: 300000,
        financingType: 'Mortgage',
        loanAmount: 240000
      },
      deposit: {
        depositAmount: 15000,
        holderName: 'XYZ Escrow Services',
        holderAddress: '456 Oak St, City, State 12345',
        holderPhone: '(555) 987-6543',
        holderEmail: 'info@xyzescrow.com'
      },
      conditions: {
        subjectProperty: true,
        exludedFixtures: ['Refrigerator', 'Washer', 'Dryer']
      },
      landSurvey: {
        requireNewSurvey: true,
        surveyorChoice: 'Mutual'
      },
      legalDescription: {
        description: ''
      },
      propertyTerms: {
        conductInspection: true,
        isInspectionContingent: true,
        inspectionDurationDays: 14,
        lease: false
      },
      propertyConditions: {
        isNew: false,
        disclosureTopics: {
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
          miscellaneous: true,
          additionalDisclosures: ''
        },
        sellerRepairs: '',
        conductEndangeredSpeciesReport: false,
        conductEnvironmnetalReport: false,
        requireResidentialServiceContract: true
      },
      buyerDetails: {
        name: '',
        address: '',
        phone: '',
        email: ''
      },
      settlementExpenses: {
        sellerPaysSettlementExpenses: true,
        settlementAmount: 3000
      },
      closingDetails: {
        closingDate: '',
        possesionOnClosing: true,
        optionToTerminate: true,
        additionalClause: ''
      },
      terminationOption: {
        allowTermination: true,
        terminationFee: 2000,
        terminationPeriodDays: 10
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
  //       possesionOnClosing: false,
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
  //       possesionOnClosing: true,
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
    financialDetails: {
      purchasePrice: 0
    },
    deposit: {
      depositAmount: 0,
      holderName: '',
      holderAddress: ''
    },
    conditions: {},
    landSurvey: {
      requireNewSurvey: false,
      surveyorChoice: 'Buyer'
    },
    legalDescription: {},
    propertyTerms: {
      conductInspection: false,
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
        miscellaneous: false
      },
      conductEndangeredSpeciesReport: false,
      conductEnvironmnetalReport: false,
      requireResidentialServiceContract: false
    },
    buyerDetails: {
      name: '',
      address: ''
    },
    settlementExpenses: {
      sellerPaysSettlementExpenses: false
    },
    closingDetails: {
      possesionOnClosing: true,
      optionToTerminate: false
    },
    terminationOption: {
      allowTermination: false
    }
  }
};
