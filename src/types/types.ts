// Basic input types
export type Gender = 'male' | 'female' | 'non-binary';
export type AgeRange = {
  min: number;
  max: number;
};

// Define valid family history keys
export type FamilyHistoryKeys = 'heartDisease' | 'cancer' | 'earlyDeath' | 'geneticDisorders';

// Define valid risk factor keys (excluding familyHistory)
export type RiskFactorKeys = 'alcohol' | 'smoking' | 'illicitDrugs';

// Risk factors and medical conditions
export interface RiskFactors {
  alcohol: boolean;
  smoking: boolean;
  illicitDrugs: boolean;
  familyHistory: {
    [K in FamilyHistoryKeys]: boolean;
  };
}

export interface MedicalConditions {
  highBloodPressure: boolean;
  highCholesterol: boolean;
  diabetes: boolean;
  heartDisease: boolean;
  asthma: boolean;
  emphysema: boolean;
  mentalHealthCondition: boolean;
}

// User input data structure
export interface UserInput {
  age: number;
  gender: Gender;
  riskFactors: RiskFactors;
  medicalConditions: MedicalConditions;
}
