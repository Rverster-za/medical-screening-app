import React, { useState } from 'react';
import { Gender, RiskFactors, MedicalConditions, UserInput } from '../types/types';
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
      <h1 className="text-2xl font-bold mb-4">Medical Screening Recommender</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">
            Age:
            <input
              type="number"
              value={userInput.age}
              onChange={handleAgeChange}
              className="ml-2 p-1 border rounded"
              min="0"
              max="150"
            />
          </label>
        </div>

        <div>
          <label className="block mb-2">
            Gender:
            <select
              value={userInput.gender}
              onChange={handleGenderChange}
              className="ml-2 p-1 border rounded"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </label>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Risk Factors:</h3>
          <div className="space-y-2">
            {Object.keys(defaultRiskFactors).map(factor => {
              if (factor !== 'familyHistory') {
                return (
                  <label key={factor} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={userInput.riskFactors[factor as keyof RiskFactors]}
                      onChange={() => handleRiskFactorChange(factor as keyof RiskFactors)}
                      className="mr-2"
                    />
                    {factor.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                );
              }
              return null;
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Family History:</h3>
          <div className="space-y-2">
            {Object.keys(defaultRiskFactors.familyHistory).map(factor => (
              <label key={factor} className="flex items-center">
                <input
                  type="checkbox"
                  checked={userInput.riskFactors.familyHistory[factor as keyof RiskFactors['familyHistory']]}
                  onChange={() => handleRiskFactorChange(factor, true)}
                  className="mr-2"
                />
                {factor.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Medical Conditions:</h3>
          <div className="space-y-2">
            {Object.keys(defaultMedicalConditions).map(condition => (
              <label key={condition} className="flex items-center">
                <input
                  type="checkbox"
                  checked={userInput.medicalConditions[condition as keyof MedicalConditions]}
                  onChange={() => handleMedicalConditionChange(condition as keyof MedicalConditions)}
                  className="mr-2"
                />
                {condition.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Get Recommendations
        </button>
      </form>

{recommendations.map(screening => (
              <div key={screening.id} className="border p-4 rounded">
                <h3 className="font-semibold">{screening.name}</h3>
                <p className="text-gray-600">{screening.description}</p>
                <p className="text-sm mt-2">Frequency: {screening.frequency}</p>
                <div className="mt-2">
                  <ScreeningInfoModal screening={screening} />
                </div>
              </div>
            ))}
          </div>
          {recommendations.length > 0 && <PDFGenerator screenings={recommendations} userInput={userInput} />}
        </div>
      )}
    </div>
  );
};

export default ScreeningRecommender;
