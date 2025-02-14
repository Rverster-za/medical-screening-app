import React, { useState } from 'react';
import { Gender, RiskFactors, MedicalConditions, UserInput, RiskFactorKeys, FamilyHistoryKeys } from '../types/types';
import { getRecommendedScreenings, Screening } from '../data/screenings';
import ScreeningInfoModal from './ScreeningInfoModal';
import PDFGenerator from './PDFGenerator';

const defaultRiskFactors: RiskFactors = {
  alcohol: false,
  smoking: false,
  illicitDrugs: false,
  familyHistory: {
    heartDisease: false,
    cancer: false,
    earlyDeath: false,
    geneticDisorders: false,
  },
};

const defaultMedicalConditions: MedicalConditions = {
  highBloodPressure: false,
  highCholesterol: false,
  diabetes: false,
  heartDisease: false,
  asthma: false,
  emphysema: false,
  mentalHealthCondition: false,
};

export const ScreeningRecommender: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    age: 0,
    gender: 'male',
    riskFactors: defaultRiskFactors,
    medicalConditions: defaultMedicalConditions,
  });

  const [recommendations, setRecommendations] = useState<Screening[]>([]);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(prev => ({
      ...prev,
      age: parseInt(e.target.value) || 0,
    }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserInput(prev => ({
      ...prev,
      gender: e.target.value as Gender,
    }));
  };

  const handleRiskFactorChange = (factor: keyof RiskFactors | keyof RiskFactors['familyHistory'], isFamily = false) => {
    setUserInput(prev => ({
      ...prev,
      riskFactors: isFamily
        ? {
            ...prev.riskFactors,
            familyHistory: {
              ...prev.riskFactors.familyHistory,
              [factor]: !prev.riskFactors.familyHistory[factor as keyof RiskFactors['familyHistory']],
            },
          }
        : {
            ...prev.riskFactors,
            [factor]: !prev.riskFactors[factor as keyof RiskFactors],
          },
    }));
  };

  const handleMedicalConditionChange = (condition: keyof MedicalConditions) => {
    setUserInput(prev => ({
      ...prev,
      medicalConditions: {
        ...prev.medicalConditions,
        [condition]: !prev.medicalConditions[condition],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const screenings = getRecommendedScreenings(
      userInput.age,
      userInput.gender,
      userInput.riskFactors,
      userInput.medicalConditions
    );
    setRecommendations(screenings);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Medical Screening Questionnaire</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
              <input
                type="number"
                value={userInput.age}
                onChange={handleAgeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                max="150"
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
              <select
                value={userInput.gender}
                onChange={handleGenderChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </label>
          </div>
        </div>

       <div>
  <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Factors</h3>
  <div className="space-y-2">
    {(['alcohol', 'smoking', 'illicitDrugs'] as RiskFactorKeys[]).map(factor => (
      <label key={factor} className="flex items-center">
        <input
          type="checkbox"
          checked={userInput.riskFactors[factor]}
          onChange={() => handleRiskFactorChange(factor)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2">{factor.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
      </label>
    ))}
  </div>
</div>

<div>
  <h3 className="text-lg font-medium text-gray-900 mb-4">Family History</h3>
  <div className="space-y-2">
    {(['heartDisease', 'cancer', 'earlyDeath', 'geneticDisorders'] as FamilyHistoryKeys[]).map(factor => (
      <label key={factor} className="flex items-center">
        <input
          type="checkbox"
          checked={userInput.riskFactors.familyHistory[factor]}
          onChange={() => handleRiskFactorChange(factor as FamilyHistoryKeys, true)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2">{factor.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
      </label>
    ))}
  </div>
</div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Get Recommendations
        </button>
      </form>

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Your Recommended Screenings</h3>
          <div className="space-y-4">
            {recommendations.map(screening => (
              <div key={screening.id} className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-lg">{screening.name}</h4>
                <p className="text-gray-600 mt-1">{screening.description}</p>
                <p className="text-sm text-gray-500 mt-2">Frequency: {screening.frequency}</p>
                <div className="mt-2">
                  <ScreeningInfoModal screening={screening} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <PDFGenerator screenings={recommendations} userInput={userInput} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreeningRecommender;
