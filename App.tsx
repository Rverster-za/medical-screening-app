import React from 'react';
import { ScreeningRecommender } from './components/ScreeningRecommender';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Medical Screening Assistant
          </h1>
          <p className="mt-2 text-gray-600">
            Get personalized medical screening recommendations based on your profile
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white shadow rounded-lg">
          <ScreeningRecommender />
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            Disclaimer: This tool provides general recommendations only. 
            Always consult with your healthcare provider for personalized medical advice.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Medical Screening Assistant. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;