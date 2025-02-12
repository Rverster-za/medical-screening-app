// Basic input types
export type Gender = 'male' | 'female' | 'non-binary';

export type AgeRange = {
  min: number;
  max: number;
};

// Risk factors and medical conditions
export interface RiskFactors {
  alcohol: boolean;
  smoking: boolean;
  illicitDrugs: boolean;
  familyHistory: {
    heartDisease: boolean;
    cancer: boolean;
    earlyDeath: boolean;
    geneticDisorders: boolean;
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