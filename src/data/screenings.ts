import { Gender, RiskFactors, MedicalConditions } from '../types/types';

export interface Screening {
  id: string;
  name: string;
  description: string;
  frequency: string;
  ageRange?: {
    min: number;
    max: number;
  };
  gender?: Gender[];
}

const screenings: Screening[] = [
  {
    id: 'blood-pressure',
    name: 'Blood Pressure Screening',
    description: 'Measures the force of blood against artery walls to detect hypertension.',
    frequency: 'Every 2 years for normal readings; more frequently if elevated',
    ageRange: { min: 18, max: 150 }
  },
  {
    id: 'cholesterol',
    name: 'Cholesterol Screening',
    description: 'Blood test to measure various types of cholesterol and triglycerides.',
    frequency: 'Every 4-6 years for normal readings; more frequently if elevated',
    ageRange: { min: 20, max: 150 }
  },
  {
    id: 'mammogram',
    name: 'Mammogram',
    description: 'X-ray examination of breast tissue to screen for breast cancer.',
    frequency: 'Every 1-2 years',
    ageRange: { min: 40, max: 150 },
    gender: ['female']
  },
  {
    id: 'colonoscopy',
    name: 'Colonoscopy',
    description: 'Examination of the colon to screen for colorectal cancer.',
    frequency: 'Every 10 years',
    ageRange: { min: 45, max: 150 }
  }
];

export function getRecommendedScreenings(
  age: number,
  gender: Gender,
  riskFactors: RiskFactors,
  medicalConditions: MedicalConditions
): Screening[] {
  return screenings.filter(screening => {
    // Check age range
    if (screening.ageRange) {
      if (age < screening.ageRange.min || age > screening.ageRange.max) {
        return false;
      }
    }

    // Check gender-specific screenings
    if (screening.gender && !screening.gender.includes(gender)) {
      return false;
    }

    // Add additional logic based on risk factors and medical conditions
    if (screening.id === 'colonoscopy' && riskFactors.familyHistory.cancer) {
      return true;
    }

    if (screening.id === 'cholesterol' && 
       (medicalConditions.highCholesterol || medicalConditions.heartDisease)) {
      return true;
    }

    return true;
  });
}

export default screenings;