import React from 'react';
import { Screening } from '../data/screenings';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ScreeningModalProps {
  screening: Screening;
}

export const ScreeningInfoModal: React.FC<ScreeningModalProps> = ({ screening }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-blue-600 hover:text-blue-800 underline">
          Learn more
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{screening.name}</DialogTitle>
        </DialogHeader>
        
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions to provide additional screening information
function getScreeningProcedureInfo(screeningId: string): string {
  const procedures: Record<string, string> = {
    'blood-pressure': 'A healthcare provider will wrap an inflatable cuff around your arm. The cuff will tighten briefly while the measurement is taken. The process is quick and painless.',
    'cholesterol': 'A small blood sample will be taken from your arm. The sample is analyzed in a laboratory to measure various types of cholesterol and triglycerides.',
    'mammogram': 'Each breast is compressed between two plates while X-ray images are taken. The procedure takes about 20-30 minutes.',
    'colonoscopy': 'A thin, flexible tube with a tiny camera is used to examine the colon. The procedure typically takes 30-60 minutes and is performed under sedation.',
    'lung-cancer': 'You will lie on a table while a low-dose CT scanner takes detailed images of your lungs. The scan is quick and painless.',
    'diabetes': 'A blood sample will be taken to measure your blood glucose levels. This may include fasting blood sugar or A1C tests.',
    'mental-health': 'A healthcare provider will conduct an interview and may ask you to complete questionnaires about your thoughts, feelings, and behaviors.',
    'prostate': 'Includes a blood test for PSA levels and possibly a physical exam. The PSA test involves a simple blood draw.'
  };
  return procedures[screeningId] || 'Please consult your healthcare provider for specific procedure details.';
}

function getScreeningPrepInfo(screeningId: string): string {
  const preparations: Record<string, string> = {
    'blood-pressure': 'Avoid caffeine, exercise, and tobacco for 30 minutes before the test. Wear a short-sleeved shirt.',
    'cholesterol': 'You may need to fast for 9-12 hours before the test. Continue drinking water and taking prescribed medications unless instructed otherwise.',
    'mammogram': 'Wear a two-piece outfit. Don't use deodorant, powder, or lotion on your breasts or underarms on the day of the exam.',
    'colonoscopy': 'You'll need to follow a special diet the day before and use laxatives to clean out your colon. Your doctor will provide detailed instructions.',
    'lung-cancer': 'Wear comfortable clothes without metal zippers or buttons. You may be asked to hold your breath briefly during the scan.',
    'diabetes': 'For some tests, you'll need to fast for 8 hours. Your doctor will provide specific instructions based on the type of test.',
    'mental-health': 'No special preparation is needed. Try to be honest and open during the assessment.',
    'prostate': 'For a PSA test, you might need to avoid sexual activity for 48 hours beforehand. Ask your doctor for specific instructions.'
  };
  return preparations[screeningId] || 'Ask your healthcare provider about any necessary preparation.';
}

export default ScreeningInfoModal;
