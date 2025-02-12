import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Screening } from '../data/screenings';
import { UserInput } from '../types/types';

interface PDFGeneratorProps {
  screenings: Screening[];
  userInput: UserInput;
}

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({ screenings, userInput }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { height, width } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Header
    page.drawText('Medical Screening Recommendations', {
      x: 50,
      y: height - 50,
      size: 20,
      font: boldFont,
    });

    // Patient Info
    page.drawText(`Patient Profile:`, {
      x: 50,
      y: height - 100,
      size: 12,
      font: boldFont,
    });

    page.drawText(`Age: ${userInput.age}`, {
      x: 50,
      y: height - 120,
      size: 12,
      font,
    });

    page.drawText(`Gender: ${userInput.gender}`, {
      x: 50,
      y: height - 140,
      size: 12,
      font,
    });

    // Risk Factors
    const riskFactors = Object.entries(userInput.riskFactors)
      .filter(([key, value]) => key !== 'familyHistory' && value)
      .map(([key]) => key);

    const familyHistory = Object.entries(userInput.riskFactors.familyHistory)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (riskFactors.length > 0) {
      page.drawText(`Risk Factors: ${riskFactors.join(', ')}`, {
        x: 50,
        y: height - 160,
        size: 12,
        font,
      });
    }

    if (familyHistory.length > 0) {
      page.drawText(`Family History: ${familyHistory.join(', ')}`, {
        x: 50,
        y: height - 180,
        size: 12,
        font,
      });
    }

    // Recommended Screenings
    page.drawText('Recommended Screenings:', {
      x: 50,
      y: height - 220,
      size: 14,
      font: boldFont,
    });

    let yOffset = 250;
    screenings.forEach((screening, index) => {
      // Add new page if needed
      if (yOffset > height - 50) {
        const newPage = pdfDoc.addPage();
        yOffset = 50;
      }

      page.drawText(`${index + 1}. ${screening.name}`, {
        x: 50,
        y: height - yOffset,
        size: 12,
        font: boldFont,
      });

      page.drawText(`Description: ${screening.description}`, {
        x: 70,
        y: height - (yOffset + 20),
        size: 10,
        font,
        maxWidth: width - 100,
      });

      page.drawText(`Frequency: ${screening.frequency}`, {
        x: 70,
        y: height - (yOffset + 40),
        size: 10,
        font,
      });

      yOffset += 70;
    });

    // Footer
    const today = new Date().toLocaleDateString();
    page.drawText(`Generated on: ${today}`, {
      x: 50,
      y: 50,
      size: 10,
      font,
    });

    page.drawText('This report is for informational purposes only. Please consult with your healthcare provider.', {
      x: 50,
      y: 30,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    return pdfDoc.save();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      const pdfBytes = await generatePDF();
      
      // Create download link
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'screening-recommendations.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setStatus('success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Download or Email Recommendations
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
              Save Your Recommendations
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Generating...' : 'Generate PDF'}
                </button>
              </div>

              {status === 'success' && (
                <p className="text-sm text-green-600">PDF generated successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-600">Error generating PDF. Please try again.</p>
              )}
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default PDFGenerator;