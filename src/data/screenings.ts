import { ScreeningGuideline, Vaccination, Gender } from '../types/types';

export const australianScreeningGuidelines: ScreeningGuideline[] = [
  {
    id: 'bone-density',
    name: 'Bone Mineral Density',
    description: 'DEXA scan for osteoporosis risk assessment',
    ageRange: { min: 70, max: null },
    frequency: 'As recommended by GP',
    gender: 'all',
    riskFactors: ['previous_fracture', 'family_history_osteoporosis', 'low_body_weight', 'smoking', 'long_term_steroid_use']
  },
  {
    id: 'psa-screening',
    name: 'Prostate Specific Antigen (PSA)',
    description: 'Prostate cancer risk assessment - discuss benefits and risks with your GP',
    ageRange: { min: 50, max: 69 },
    frequency: 'Every 2 years if chosen after informed decision',
    gender: 'male',
    riskFactors: ['family_history_prostate_cancer', 'african_ancestry']
  }
];

export const adultVaccinations: Vaccination[] = [
  {
    id: 'influenza',
    name: 'Influenza (Flu) Vaccine',
    description: 'Annual protection against seasonal influenza strains',
    targetGroups: ['All adults', 'Pregnant women', 'People 65 years and over', 'Aboriginal and Torres Strait Islander people', 'People with medical risk conditions'],
    schedule: 'Single dose annually',
    fundedGroups: ['65 years and over', 'Aboriginal and Torres Strait Islander people', 'Pregnant women', 'People with specific medical conditions'],
    notes: 'Recommended for all adults, especially before winter season'
  },
  {
    id: 'covid19',
    name: 'COVID-19 Vaccine',
    description: 'Protection against COVID-19',
    targetGroups: ['All eligible adults'],
    schedule: 'As per current ATAGI guidelines',
    notes: 'Booster doses recommended for eligible groups'
  },
  {
    id: 'pneumococcal',
    name: 'Pneumococcal Vaccine',
    description: 'Protection against pneumococcal disease',
    targetGroups: ['Adults 70 years and over', 'Aboriginal and Torres Strait Islander people 50 years and over', 'People with specific risk conditions'],
    schedule: 'Single dose at age 70',
    fundedGroups: ['70 years and over', 'Aboriginal and Torres Strait Islander people aged 50 years and over'],
    notes: 'Additional doses may be recommended for some risk groups'
  },
  {
    id: 'zoster',
    name: 'Zoster (Shingles) Vaccine',
    description: 'Protection against shingles and post-herpetic neuralgia',
    targetGroups: ['Adults 70 years old'],
    schedule: 'Single dose at age 70',
    fundedGroups: ['70 years (catch-up available for 71-79 years)'],
    notes: 'Free under NIP for people aged 70 years'
  }
];
