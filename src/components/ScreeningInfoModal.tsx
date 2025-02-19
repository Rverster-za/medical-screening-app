import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Screening } from '../data/screenings';

interface ScreeningModalProps {
  screening: Screening;
}

export const ScreeningInfoModal: React.FC<ScreeningModalProps> = ({ screening }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Learn more
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow-xl">
            <Dialog.Title className="text-xl font-semibold">
              {screening.name}
            </Dialog.Title>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-600">{screening.description}</p>
              </div>

              <div>
                <h3 className="font-semibold">Recommended Frequency</h3>
                <p className="text-gray-600">{screening.frequency}</p>
              </div>

              {screening.ageRange && (
                <div>
                  <h3 className="font-semibold">Age Range</h3>
                  <p className="text-gray-600">
                    {screening.ageRange.min} - {screening.ageRange.max} years old
                  </p>
                </div>
              )}

              {screening.gender && (
                <div>
                  <h3 className="font-semibold">Recommended For</h3>
                  <p className="text-gray-600">
                    {screening.gender.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ')}
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-semibold">What to Expect</h3>
                <p className="text-gray-600">
                  {getScreeningProcedureInfo(screening.id)}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Preparation</h3>
                <p className="text-gray-600">
                  {getScreeningPrepInfo(screening.id)}
                </p>
              </div>

              <div className="pt-4 text-sm text-gray-500">
                <p>
                  Note: This information is for general guidance only. 
                  Specific recommendations may vary based on your individual health situation. 
                  Always consult with your healthcare provider.
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

// Helper functions remain the same
function getScreeningProcedureInfo(screeningId: string): string {
  const procedures: Record<string, string> = {
    'blood-pressure': 'A healthcare provider will wrap an inflatable cuff around your arm. The cuff will tighten briefly while the measurement is taken. The process is quick and painless.',
    'cholesterol': 'A small blood sample will be taken from your arm. The sample is analyzed in a laboratory to measure various types of cholesterol and triglycerides.',
    'mammogram': 'Each breast is compressed between two plates while X-ray images are taken. The procedure takes about 20-30 minutes.',
    'colonoscopy': 'A thin, flexible tube with a tiny camera is used to examine the colon. The procedure typically takes 30-60 minutes and is performed under sedation.',
  };
  return procedures[screeningId] || 'Please consult your healthcare provider for specific procedure details.';
}

function getScreeningPrepInfo(screeningId: string): string {
  const preparations: Record<string, string> = {
    'blood-pressure': 'Avoid caffeine, exercise, and tobacco for 30 minutes before the test. Wear a short-sleeved shirt.',
    'cholesterol': 'You may need to fast for 9-12 hours before the test. Continue drinking water and taking prescribed medications unless instructed otherwise.',
    'mammogram': "Wear a two-piece outfit. Don't use deodorant, powder, or lotion on your breasts or underarms on the day of the exam.",
    'colonoscopy': "You'll need to follow a special diet the day before and use laxatives to clean out your colon. Your doctor will provide detailed instructions."
  };
  return preparations[screeningId] || 'Ask your healthcare provider about any necessary preparation.';
}

export default ScreeningInfoModal;